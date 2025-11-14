const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');
const { authenticate, authorize } = require('../utils/auth');
const { sendNotificationEmail } = require('../utils/otpService');

// Create order (customers)
router.post('/', authenticate, authorize('customer'), (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress, scheduledDate, isOfflineOrder } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Validate items and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = db.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemTotal
      });
    }

    const order = {
      id: uuidv4(),
      customerId: req.user.id,
      retailerId: items[0].retailerId || null, // Assuming all items from same retailer
      wholesalerId: items[0].wholesalerId || null,
      items: orderItems,
      total,
      paymentMethod: paymentMethod || 'online',
      paymentStatus: paymentMethod === 'offline' ? 'pending' : 'pending',
      orderStatus: 'placed',
      deliveryAddress: deliveryAddress || '',
      scheduledDate: isOfflineOrder && scheduledDate ? scheduledDate : null,
      isOfflineOrder: isOfflineOrder || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update stock
    for (const item of items) {
      const product = db.getProductById(item.productId);
      db.updateProduct(item.productId, {
        stock: product.stock - item.quantity
      });
    }

    db.addOrder(order);

    // Send notification
    const customer = db.getUserById(req.user.id);
    if (customer && customer.email) {
      sendNotificationEmail(
        customer.email,
        'Order Placed',
        `Your order #${order.id} has been placed successfully. Total: ₹${total}`
      );
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders (for authenticated user based on role)
router.get('/', authenticate, (req, res) => {
  try {
    let orders = [];
    if (req.user.role === 'customer') {
      orders = db.getOrdersByCustomer(req.user.id);
    } else if (req.user.role === 'retailer') {
      orders = db.getOrdersByRetailer(req.user.id);
    } else if (req.user.role === 'wholesaler') {
      orders = db.getOrdersByWholesaler(req.user.id);
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get order by ID
router.get('/:id', authenticate, (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (req.user.role === 'retailer' && order.retailerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (req.user.role === 'wholesaler' && order.wholesalerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Add product details
    const orderWithDetails = {
      ...order,
      items: order.items.map(item => {
        const product = db.getProductById(item.productId);
        return {
          ...item,
          product: product ? {
            id: product.id,
            name: product.name,
            image: product.image
          } : null
        };
      })
    };

    res.json(orderWithDetails);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Update order status (retailers and wholesalers)
router.put('/:id/status', authenticate, authorize('retailer', 'wholesaler'), (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = db.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (req.user.role === 'retailer' && order.retailerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (req.user.role === 'wholesaler' && order.wholesalerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = {
      updatedAt: new Date().toISOString()
    };

    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updatedOrder = db.updateOrder(req.params.id, updates);

    // Send notification to customer
    const customer = db.getUserById(order.customerId);
    if (customer && customer.email) {
      sendNotificationEmail(
        customer.email,
        'Order Status Updated',
        `Your order #${order.id} status has been updated to: ${orderStatus || order.orderStatus}`
      );
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Retailer places order with wholesaler
router.post('/retailer-to-wholesaler', authenticate, authorize('retailer'), (req, res) => {
  try {
    const { items, wholesalerId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!wholesalerId) {
      return res.status(400).json({ error: 'Wholesaler ID is required' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = db.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.wholesalerId !== wholesalerId) {
        return res.status(400).json({ error: `Product ${product.name} not available from this wholesaler` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemTotal
      });
    }

    const order = {
      id: uuidv4(),
      customerId: null,
      retailerId: req.user.id,
      wholesalerId,
      items: orderItems,
      total,
      paymentMethod: 'offline',
      paymentStatus: 'pending',
      orderStatus: 'placed',
      deliveryAddress: '',
      scheduledDate: null,
      isOfflineOrder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update stock
    for (const item of items) {
      const product = db.getProductById(item.productId);
      db.updateProduct(item.productId, {
        stock: product.stock - item.quantity
      });
    }

    db.addOrder(order);

    res.status(201).json(order);
  } catch (error) {
    console.error('Retailer to wholesaler order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;

