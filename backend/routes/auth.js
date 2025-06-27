const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const { protect } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// ✅ Securely load secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_fallback';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 🔐 Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// ✅ REGISTER Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    console.log('📥 Received register request:', req.body); // 👈 DEBUG LOG
    if (userExists) {
         console.log('⚠️ User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Create and save user (password will be hashed by model)
    const user = await User.create({ name, email, password, role, verificationToken, verificationTokenExpires });

    // Send verification email via SendGrid
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM || 'info@flexiride.co',
      subject: 'Verify your FlexiRide account',
      html: `<h2>Welcome to FlexiRide!</h2><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a>`
    };
    await sgMail.send(msg);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// ✅ LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Respond with user and token
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// EMAIL VERIFICATION ROUTE
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Invalid or missing token.' });
  try {
    // 1. Find user by the token and check expiration
    const user = await User.findOne({ 
      verificationToken: token, 
      verificationTokenExpires: { $gt: new Date() } 
    });
    
    // 2. If no user, token is invalid or expired
    if (!user) {
      return res.status(400).json({ message: '' });
    }
    
    // 3. Mark as verified and clear token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    
    // 4. Save the user
    await user.save();
    
    // 5. Return success
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
});

// RESEND VERIFICATION EMAIL ROUTE
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified.' });
    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM || 'info@flexiride.co',
      subject: 'Verify your FlexiRide account',
      html: `<h2>Welcome to FlexiRide!</h2><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a>`
    };
    await sgMail.send(msg);
    res.json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to resend verification email', error: err.message });
  }
});

// GET /me - return current user info
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info', error: err.message });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  await sgMail.send({
    to: user.email,
    from: process.env.SENDGRID_FROM || 'no-reply@flexiride.co',
    subject: 'Reset your FlexiRide password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
  });

  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful. You can now log in.' });
});

// CHANGE PASSWORD (authenticated)
router.post('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully.' });
});

// Update user profile with avatar
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;
    
    const updateData = { name };
    
    // Handle avatar upload
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
