import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get('/products/categories/all'),
          api.get('/products?inStock=true')
        ]);
        setCategories(categoriesRes.data);
        setFeaturedProducts(productsRes.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Live MART</h1>
          <p>Your one-stop shop for all your needs</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/search" className="btn btn-secondary">
              Search Products
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="category-card"
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card"
              >
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="product-placeholder">📦</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>
                  {product.stock > 0 ? (
                    <span className="product-stock in-stock">In Stock</span>
                  ) : (
                    <span className="product-stock out-of-stock">Out of Stock</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

