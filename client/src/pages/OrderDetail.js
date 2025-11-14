import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
        setOrderStatus(response.data.orderStatus);
        setPaymentStatus(response.data.paymentStatus);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [id, user]);

  const handleStatusUpdate = async () => {
    if (!user || (user.role !== 'retailer' && user.role !== 'wholesaler')) {
      return;
    }

    try {
      await api.put(`/orders/${id}/status`, {
        orderStatus: orderStatus,
        paymentStatus: paymentStatus
      });
      toast.success('Order status updated');
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return '#ff9800';
      case 'confirmed':
        return '#2196F3';
      case 'processing':
        return '#9c27b0';
      case 'shipped':
        return '#00bcd4';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  if (loading) {
    return <div className="loading">Loading order...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        <button onClick={() => navigate('/orders')} className="btn-back">
          ← Back to Orders
        </button>

        <div className="order-header-detail">
          <div>
            <h1>Order #{order.id.slice(0, 8)}</h1>
            <p className="order-date-detail">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="order-status-detail">
            <span
              className="status-badge-large"
              style={{ backgroundColor: getStatusColor(order.orderStatus) }}
            >
              {order.orderStatus.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="order-sections">
          <div className="order-items-section">
            <h2>Order Items</h2>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <div className="item-image">
                    {item.product?.image ? (
                      <img src={item.product.image} alt={item.productName} />
                    ) : (
                      <div className="item-placeholder">📦</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.productName}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price} each</p>
                  </div>
                  <div className="item-subtotal">
                    ₹{item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total-section">
              <div className="total-row">
                <span>Total:</span>
                <span className="total-amount">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="order-info-section">
            <div className="info-card">
              <h3>Order Information</h3>
              <div className="info-row">
                <span>Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="info-row">
                <span>Payment Status:</span>
                <span>{order.paymentStatus}</span>
              </div>
              {order.deliveryAddress && (
                <div className="info-row">
                  <span>Delivery Address:</span>
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
              {order.isOfflineOrder && order.scheduledDate && (
                <div className="info-row">
                  <span>Scheduled Date:</span>
                  <span>{new Date(order.scheduledDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="info-row">
                <span>Last Updated:</span>
                <span>{new Date(order.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            {(user?.role === 'retailer' || user?.role === 'wholesaler') && (
              <div className="info-card">
                <h3>Update Order Status</h3>
                <div className="form-group">
                  <label>Order Status</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <button onClick={handleStatusUpdate} className="btn-update-status">
                  Update Status
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

