const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { authenticate, authorize } = require('../utils/auth');
const { getLocationDetails } = require('../utils/locationService');

// Get user profile
router.get('/profile', authenticate, (req, res) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, address, location } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) {
      updates.address = address;
      // Get location details if address changed
      const locationData = await getLocationDetails(address);
      if (locationData) {
        updates.latitude = locationData.lat;
        updates.longitude = locationData.lng;
      }
    }
    if (location) {
      updates.latitude = location.lat;
      updates.longitude = location.lng;
    }

    const updatedUser = db.updateUser(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get purchase history (for customers)
router.get('/purchase-history', authenticate, authorize('customer'), (req, res) => {
  try {
    const orders = db.getOrdersByCustomer(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({ error: 'Failed to get purchase history' });
  }
});

// Get customer purchase history (for retailers)
router.get('/customers/:customerId/history', authenticate, authorize('retailer'), (req, res) => {
  try {
    const orders = db.getOrdersByCustomer(req.params.customerId)
      .filter(order => order.retailerId === req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Get customer history error:', error);
    res.status(500).json({ error: 'Failed to get customer history' });
  }
});

// Get retailer purchase history (for wholesalers)
router.get('/retailers/:retailerId/history', authenticate, authorize('wholesaler'), (req, res) => {
  try {
    const orders = db.getOrdersByRetailer(req.params.retailerId)
      .filter(order => order.wholesalerId === req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Get retailer history error:', error);
    res.status(500).json({ error: 'Failed to get retailer history' });
  }
});

module.exports = router;

