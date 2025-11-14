import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 Live MART
        </Link>
        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">Products</Link>
          <Link to="/search" className="navbar-link">Search</Link>
          {user ? (
            <>
              {user.role === 'customer' && (
                <Link to="/cart" className="navbar-link">Cart</Link>
              )}
              <Link to="/orders" className="navbar-link">Orders</Link>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

