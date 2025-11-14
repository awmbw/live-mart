const nodemailer = require('nodemailer');
const twilio = require('twilio');

// In-memory OTP storage (in production, use Redis)
const otpStore = new Map();

// Email transporter
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createEmailTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Live MART - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>OTP Verification</h2>
          <p>Your OTP for Live MART registration is:</p>
          <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send OTP via SMS (Twilio)
const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('Twilio not configured. OTP:', otp);
      return true; // For development
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Your Live MART OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

// Store OTP
const storeOTP = (identifier, otp) => {
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
};

// Verify OTP
const verifyOTP = (identifier, otp) => {
  const stored = otpStore.get(identifier);
  if (!stored) {
    return false;
  }
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return false;
  }
  if (stored.otp === otp) {
    otpStore.delete(identifier);
    return true;
  }
  return false;
};

// Send notification email
const sendNotificationEmail = async (email, subject, message) => {
  try {
    const transporter = createEmailTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Live MART - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>${subject}</h2>
          <p>${message}</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendOTPSMS,
  storeOTP,
  verifyOTP,
  sendNotificationEmail
};

