import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

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
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders yet</h2>
            <Link to="/products" className="btn-shop">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="order-card"
              >
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id.slice(0, 8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="order-items">
                  <p>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    Total: ₹{order.total.toFixed(2)}
                  </div>
                  <div className="order-payment">
                    Payment: {order.paymentMethod} ({order.paymentStatus})
                  </div>
                </div>
                {order.isOfflineOrder && order.scheduledDate && (
                  <div className="order-scheduled">
                    📅 Scheduled for: {new Date(order.scheduledDate).toLocaleDateString()}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

