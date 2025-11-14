const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');
const { authenticate } = require('../utils/auth');

// Add feedback
router.post('/', authenticate, (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ error: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verify user has ordered this product
    if (orderId) {
      const order = db.getOrderById(orderId);
      if (!order || order.customerId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to provide feedback for this order' });
      }
    }

    const feedback = {
      id: uuidv4(),
      productId,
      orderId: orderId || null,
      userId: req.user.id,
      userName: req.user.name || 'Anonymous',
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date().toISOString()
    };

    db.addFeedback(feedback);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
});

// Get feedback for a product
router.get('/product/:productId', (req, res) => {
  try {
    const feedback = db.getFeedbackByProduct(req.params.productId);
    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
});

module.exports = router;

