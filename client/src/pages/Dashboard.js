import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    image: '',
    isLocalProduct: false,
    availabilityDate: ''
  });
  const [categories, setCategories] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (user.role === 'customer') {
          const ordersRes = await api.get('/orders');
          setOrders(ordersRes.data);
          setStats({
            totalOrders: ordersRes.data.length,
            pendingOrders: ordersRes.data.filter(o => o.orderStatus !== 'delivered').length
          });
        } else if (user.role === 'retailer' || user.role === 'wholesaler') {
          const [productsRes, ordersRes, categoriesRes] = await Promise.all([
            api.get(`/products/${user.role === 'retailer' ? 'retailer' : 'wholesaler'}/${user.id}`),
            api.get('/orders'),
            api.get('/products/categories/all')
          ]);
          setProducts(productsRes.data);
          setOrders(ordersRes.data);
          setCategories(categoriesRes.data);
          setStats({
            totalProducts: productsRes.data.length,
            totalOrders: ordersRes.data.length,
            pendingOrders: ordersRes.data.filter(o => o.orderStatus !== 'delivered').length,
            lowStock: productsRes.data.filter(p => p.stock < 10).length
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      toast.success('Product added successfully');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        image: '',
        isLocalProduct: false,
        availabilityDate: ''
      });
      setShowAddProduct(false);
      // Refresh products
      const response = await api.get(`/products/${user.role === 'retailer' ? 'retailer' : 'wholesaler'}/${user.id}`);
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete product');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <p className="dashboard-welcome">Welcome, {user.name} ({user.role})</p>

        <div className="dashboard-stats">
          {user.role === 'customer' && (
            <>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p className="stat-value">{stats.pendingOrders || 0}</p>
              </div>
            </>
          )}
          {(user.role === 'retailer' || user.role === 'wholesaler') && (
            <>
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-value">{stats.totalProducts || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p className="stat-value">{stats.pendingOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Low Stock Items</h3>
                <p className="stat-value">{stats.lowStock || 0}</p>
              </div>
            </>
          )}
        </div>

        {(user.role === 'retailer' || user.role === 'wholesaler') && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Products</h2>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="btn-add-product"
              >
                {showAddProduct ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {showAddProduct && (
              <form onSubmit={handleAddProduct} className="add-product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Availability Date</label>
                    <input
                      type="date"
                      value={newProduct.availabilityDate}
                      onChange={(e) => setNewProduct({ ...newProduct, availabilityDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newProduct.isLocalProduct}
                      onChange={(e) => setNewProduct({ ...newProduct, isLocalProduct: e.target.checked })}
                    />
                    Local Product
                  </label>
                </div>
                <button type="submit" className="btn-submit">Add Product</button>
              </form>
            )}

            <div className="products-table">
              {products.length === 0 ? (
                <p>No products yet. Add your first product!</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>₹{product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id.slice(0, 8)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.orderStatus}</td>
                      <td>₹{order.total.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="btn-view"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

