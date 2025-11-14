const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/database');
const { generateToken, hashPassword, comparePassword, generateOTP } = require('../utils/auth');
const { sendOTPEmail, sendOTPSMS, storeOTP, verifyOTP } = require('../utils/otpService');
const { getLocationDetails } = require('../utils/locationService');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, address, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate role
    if (!['customer', 'retailer', 'wholesaler'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Get location details if address provided
    let locationData = null;
    if (address || location) {
      locationData = await getLocationDetails(address || `${location.lat},${location.lng}`);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      address: address || '',
      latitude: locationData?.lat || location?.lat || null,
      longitude: locationData?.lng || location?.lng || null,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    db.addUser(user);

    // Generate and send OTP
    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);
    if (phone) {
      await sendOTPSMS(phone, otp);
    }

    res.status(201).json({
      message: 'Registration successful. Please verify OTP.',
      userId: user.id,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    const user = db.getUserByEmail(email);
    if (user) {
      db.updateUser(user.id, { isVerified: true });
      const token = generateToken(user);
      res.json({
        message: 'OTP verified successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);
    if (user.phone) {
      await sendOTPSMS(user.phone, otp);
    }

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Social login (Google/Facebook) - Simplified version
router.post('/social-login', async (req, res) => {
  try {
    const { email, name, provider, providerId } = req.body;

    if (!email || !name || !provider) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let user = db.getUserByEmail(email);

    if (!user) {
      // Create new user for social login
      user = {
        id: uuidv4(),
        name,
        email,
        password: '', // No password for social login
        phone: '',
        role: 'customer', // Default role
        address: '',
        latitude: null,
        longitude: null,
        isVerified: true, // Social logins are pre-verified
        provider,
        providerId,
        createdAt: new Date().toISOString()
      };
      db.addUser(user);
    }

    const token = generateToken(user);
    res.json({
      message: 'Social login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ error: 'Social login failed' });
  }
});

module.exports = router;

