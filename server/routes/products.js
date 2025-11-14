const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');
const { authenticate, authorize } = require('../utils/auth');

// Get all products (for customers)
router.get('/', (req, res) => {
  try {
    const { category, retailerId, inStock } = req.query;
    let products = db.getProducts();

    // Filter by category
    if (category) {
      products = products.filter(p => p.categoryId === category);
    }

    // Filter by retailer
    if (retailerId) {
      products = products.filter(p => p.retailerId === retailerId);
    }

    // Filter by stock availability
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    // Add feedback to products
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
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const feedback = db.getFeedbackByProduct(product.id);
    const retailer = db.getUserById(product.retailerId);
    const wholesaler = product.wholesalerId ? db.getUserById(product.wholesalerId) : null;

    res.json({
      ...product,
      feedback,
      averageRating: feedback.length > 0
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        : 0,
      retailer: retailer ? { id: retailer.id, name: retailer.name } : null,
      wholesaler: wholesaler ? { id: wholesaler.id, name: wholesaler.name } : null
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Get categories
router.get('/categories/all', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Add product (retailers and wholesalers)
router.post('/', authenticate, authorize('retailer', 'wholesaler'), (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      image,
      wholesalerId,
      availabilityDate,
      isLocalProduct
    } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = {
      id: uuidv4(),
      name,
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      categoryId,
      image: image || '',
      retailerId: req.user.role === 'retailer' ? req.user.id : null,
      wholesalerId: req.user.role === 'wholesaler' ? req.user.id : (wholesalerId || null),
      availabilityDate: availabilityDate || null,
      isLocalProduct: isLocalProduct || false,
      createdAt: new Date().toISOString()
    };

    db.addProduct(product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
router.put('/:id', authenticate, authorize('retailer', 'wholesaler'), (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership
    if (req.user.role === 'retailer' && product.retailerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (req.user.role === 'wholesaler' && product.wholesalerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.price) updates.price = parseFloat(req.body.price);
    if (req.body.stock !== undefined) updates.stock = parseInt(req.body.stock);
    if (req.body.categoryId) updates.categoryId = req.body.categoryId;
    if (req.body.image !== undefined) updates.image = req.body.image;
    if (req.body.availabilityDate !== undefined) updates.availabilityDate = req.body.availabilityDate;
    if (req.body.isLocalProduct !== undefined) updates.isLocalProduct = req.body.isLocalProduct;

    const updatedProduct = db.updateProduct(req.params.id, updates);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', authenticate, authorize('retailer', 'wholesaler'), (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership
    if (req.user.role === 'retailer' && product.retailerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (req.user.role === 'wholesaler' && product.wholesalerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    db.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get retailer's products
router.get('/retailer/:retailerId', (req, res) => {
  try {
    const products = db.getProductsByRetailer(req.params.retailerId);
    res.json(products);
  } catch (error) {
    console.error('Get retailer products error:', error);
    res.status(500).json({ error: 'Failed to get retailer products' });
  }
});

// Get wholesaler's products
router.get('/wholesaler/:wholesalerId', (req, res) => {
  try {
    const products = db.getProductsByWholesaler(req.params.wholesalerId);
    res.json(products);
  } catch (error) {
    console.error('Get wholesaler products error:', error);
    res.status(500).json({ error: 'Failed to get wholesaler products' });
  }
});

module.exports = router;

