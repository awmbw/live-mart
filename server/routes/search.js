const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { authenticate } = require('../utils/auth');
const { findNearbyShops } = require('../utils/locationService');

// Search products
router.get('/products', (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, inStock, location, maxDistance, isLocal } = req.query;
    let products = db.getProducts();

    // Text search
    if (q) {
      const searchTerm = q.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (category) {
      products = products.filter(p => p.categoryId === category);
    }

    // Price filter
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Stock filter
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    // Local products filter
    if (isLocal === 'true') {
      products = products.filter(p => p.isLocalProduct === true);
    }

    // Location-based filtering
    if (location && location.lat && location.lng) {
      const retailers = db.getUsers().filter(u => u.role === 'retailer');
      const nearbyRetailers = findNearbyShops(
        parseFloat(location.lat),
        parseFloat(location.lng),
        retailers,
        maxDistance ? parseFloat(maxDistance) : 10
      );

      const nearbyRetailerIds = nearbyRetailers.map(r => r.id);
      products = products.filter(p =>
        p.retailerId && nearbyRetailerIds.includes(p.retailerId)
      );

      // Add distance to products
      products = products.map(product => {
        const retailer = nearbyRetailers.find(r => r.id === product.retailerId);
        return {
          ...product,
          distance: retailer ? retailer.distance : null
        };
      });
    }

    // Add feedback and ratings
    products = products.map(product => {
      const feedback = db.getFeedbackByProduct(product.id);
      return {
        ...product,
        feedback,
        averageRating: feedback.length > 0
          ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
          : 0
      };
    });

    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get nearby shops
router.get('/shops', authenticate, (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const retailers = db.getUsers().filter(u => u.role === 'retailer');
    const nearbyShops = findNearbyShops(
      parseFloat(lat),
      parseFloat(lng),
      retailers,
      maxDistance ? parseFloat(maxDistance) : 10
    );

    // Add product count to each shop
    const shopsWithProducts = nearbyShops.map(shop => {
      const products = db.getProductsByRetailer(shop.id);
      return {
        id: shop.id,
        name: shop.name,
        address: shop.address,
        latitude: shop.latitude,
        longitude: shop.longitude,
        distance: shop.distance,
        productCount: products.length
      };
    });

    res.json(shopsWithProducts);
  } catch (error) {
    console.error('Get nearby shops error:', error);
    res.status(500).json({ error: 'Failed to get nearby shops' });
  }
});

module.exports = router;

