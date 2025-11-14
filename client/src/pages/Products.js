import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products', { params: filters }),
          api.get('/products/categories/all')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <aside className="products-sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="₹0"
            />
          </div>
          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="₹10000"
            />
          </div>
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={filters.inStock}
                onChange={handleFilterChange}
              />
              In Stock Only
            </label>
          </div>
        </aside>

        <main className="products-main">
          <h2>Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
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
                    {product.isLocalProduct && (
                      <span className="local-badge">🌾 Local</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                    <p className="product-price">₹{product.price}</p>
                    {product.averageRating > 0 && (
                      <div className="product-rating">
                        ⭐ {product.averageRating.toFixed(1)} ({product.feedback?.length || 0})
                      </div>
                    )}
                    {product.stock > 0 ? (
                      <span className="product-stock in-stock">
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="product-stock out-of-stock">Out of Stock</span>
                    )}
                    {product.availabilityDate && (
                      <p className="availability-date">
                        Available from: {new Date(product.availabilityDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;

