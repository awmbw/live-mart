import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can add items to cart');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: id,
        quantity,
        retailerId: product.retailerId,
        wholesalerId: product.wholesalerId
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Item added to cart!');
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit feedback');
      return;
    }

    try {
      await api.post('/feedback', {
        productId: id,
        rating: feedback.rating,
        comment: feedback.comment
      });
      toast.success('Feedback submitted!');
      setFeedback({ rating: 5, comment: '' });
      // Refresh product to show new feedback
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit feedback');
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-main">
          <div className="product-image-large">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="product-placeholder-large">📦</div>
            )}
            {product.isLocalProduct && (
              <span className="local-badge-large">🌾 Local Product</span>
            )}
          </div>
          <div className="product-details">
            <h1>{product.name}</h1>
            {product.description && <p className="product-description-full">{product.description}</p>}
            <div className="product-price-large">₹{product.price}</div>
            {product.averageRating > 0 && (
              <div className="product-rating-large">
                ⭐ {product.averageRating.toFixed(1)} ({product.feedback?.length || 0} reviews)
              </div>
            )}
            <div className="product-stock-info">
              {product.stock > 0 ? (
                <span className="in-stock-large">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock-large">Out of Stock</span>
              )}
            </div>
            {product.availabilityDate && (
              <p className="availability-date-large">
                Available from: {new Date(product.availabilityDate).toLocaleDateString()}
              </p>
            )}
            {product.retailer && (
              <p className="retailer-info">Sold by: {product.retailer.name}</p>
            )}
            {product.wholesaler && (
              <p className="wholesaler-info">Available via wholesaler: {product.wholesaler.name}</p>
            )}

            {user?.role === 'customer' && product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <button onClick={addToCart} className="btn-add-to-cart">
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="product-feedback-section">
          <h2>Customer Reviews</h2>
          {product.feedback && product.feedback.length > 0 ? (
            <div className="feedback-list">
              {product.feedback.map((review) => (
                <div key={review.id} className="feedback-item">
                  <div className="feedback-header">
                    <strong>{review.userName}</strong>
                    <span className="feedback-rating">⭐ {review.rating}</span>
                  </div>
                  {review.comment && <p className="feedback-comment">{review.comment}</p>}
                  <p className="feedback-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}

          {user && (
            <form onSubmit={submitFeedback} className="feedback-form">
              <h3>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={feedback.rating}
                  onChange={(e) => setFeedback({ ...feedback, rating: parseInt(e.target.value) })}
                >
                  <option value="5">5 ⭐</option>
                  <option value="4">4 ⭐</option>
                  <option value="3">3 ⭐</option>
                  <option value="2">2 ⭐</option>
                  <option value="1">1 ⭐</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
              <button type="submit" className="btn-submit-feedback">
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

