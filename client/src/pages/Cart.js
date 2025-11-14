import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    paymentMethod: 'online',
    deliveryAddress: '',
    isOfflineOrder: false,
    scheduledDate: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/');
      return;
    }

    const loadCart = async () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);

      // Fetch product details
      try {
        const productPromises = cart.map(item =>
          api.get(`/products/${item.productId}`)
        );
        const productResponses = await Promise.all(productPromises);
        setProducts(productResponses.map(res => res.data));
      } catch (error) {
        console.error('Error loading cart products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user, navigate]);

  const updateQuantity = (productId, newQuantity) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartItems(cart);
    }
  };

  const removeItem = (productId) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setProducts(products.filter(p => p.id !== productId));
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId === productId);
  };

  const getTotal = () => {
    return products.reduce((total, product) => {
      const item = getCartItem(product.id);
      return total + (product.price * (item?.quantity || 0));
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (orderData.isOfflineOrder && !orderData.scheduledDate) {
      toast.error('Please select a date for offline order');
      return;
    }

    try {
      const items = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        retailerId: item.retailerId,
        wholesalerId: item.wholesalerId
      }));

      const response = await api.post('/orders', {
        items,
        paymentMethod: orderData.paymentMethod,
        deliveryAddress: orderData.deliveryAddress || user.address,
        scheduledDate: orderData.scheduledDate,
        isOfflineOrder: orderData.isOfflineOrder
      });

      // Clear cart
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="btn-shop">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2>Shopping Cart</h2>
          {products.map((product) => {
            const item = getCartItem(product.id);
            if (!item) return null;

            return (
              <div key={product.id} className="cart-item">
                <div className="cart-item-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="cart-placeholder">📦</div>
                  )}
                </div>
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <p className="cart-item-price">₹{product.price} each</p>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ₹{(product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{getTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{getTotal().toFixed(2)}</span>
          </div>

          <div className="order-options">
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={orderData.paymentMethod}
                onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
              >
                <option value="online">Online Payment</option>
                <option value="offline">Cash on Delivery</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={orderData.isOfflineOrder}
                  onChange={(e) => setOrderData({ ...orderData, isOfflineOrder: e.target.checked })}
                />
                Schedule for later (Offline Order)
              </label>
            </div>

            {orderData.isOfflineOrder && (
              <div className="form-group">
                <label>Schedule Date</label>
                <input
                  type="date"
                  value={orderData.scheduledDate}
                  onChange={(e) => setOrderData({ ...orderData, scheduledDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                value={orderData.deliveryAddress}
                onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                placeholder={user.address || 'Enter delivery address'}
                rows="3"
              />
            </div>

            <button onClick={handlePlaceOrder} className="btn-place-order">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

