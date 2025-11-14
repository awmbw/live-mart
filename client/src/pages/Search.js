import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Search.css';

const Search = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    isLocal: false,
    maxDistance: '10'
  });
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user location if available
    if (navigator.geolocation && user) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [user]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchQuery,
        ...filters
      };

      if (userLocation) {
        params.location = userLocation;
      }

      const response = await api.get('/search/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindShops = async () => {
    if (!userLocation) {
      alert('Please enable location services');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/search/shops', {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          maxDistance: filters.maxDistance
        }
      });
      setShops(response.data);
    } catch (error) {
      console.error('Error finding shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1>Search Products</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn-search">
              Search
            </button>
          </div>
        </div>

        <div className="search-content">
          <aside className="search-filters">
            <h3>Filters</h3>
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
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  name="isLocal"
                  checked={filters.isLocal}
                  onChange={handleFilterChange}
                />
                Local Products Only
              </label>
            </div>
            {userLocation && (
              <>
                <div className="filter-group">
                  <label>Max Distance (km)</label>
                  <input
                    type="number"
                    name="maxDistance"
                    value={filters.maxDistance}
                    onChange={handleFilterChange}
                    min="1"
                    max="50"
                  />
                </div>
                <button onClick={handleFindShops} className="btn-find-shops">
                  Find Nearby Shops
                </button>
              </>
            )}
          </aside>

          <main className="search-results">
            {shops.length > 0 && (
              <div className="shops-section">
                <h2>Nearby Shops</h2>
                <div className="shops-list">
                  {shops.map((shop) => (
                    <div key={shop.id} className="shop-card">
                      <h3>{shop.name}</h3>
                      <p>{shop.address}</p>
                      <p className="shop-distance">
                        📍 {shop.distance.toFixed(2)} km away
                      </p>
                      <p className="shop-products">
                        {shop.productCount} products available
                      </p>
                      <Link
                        to={`/products?retailerId=${shop.id}`}
                        className="btn-view-shop"
                      >
                        View Products
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="products-section">
              <h2>Search Results</h2>
              {loading ? (
                <div className="loading">Searching...</div>
              ) : products.length === 0 ? (
                <div className="no-results">
                  {searchQuery ? 'No products found. Try a different search.' : 'Enter a search query to find products.'}
                </div>
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
                        <p className="product-price">₹{product.price}</p>
                        {product.distance !== null && (
                          <p className="product-distance">
                            📍 {product.distance.toFixed(2)} km away
                          </p>
                        )}
                        {product.averageRating > 0 && (
                          <div className="product-rating">
                            ⭐ {product.averageRating.toFixed(1)}
                          </div>
                        )}
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Search;

