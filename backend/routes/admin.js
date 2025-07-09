const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authmiddleware');
const Booking = require('../models/Booking');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Get all users (admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status (admin only)
router.patch('/users/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper to group bookings by date
function groupByDate(docs, valueField) {
  return docs.reduce((acc, doc) => {
    const date = doc.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
    acc[date] = (acc[date] || 0) + (valueField ? doc[valueField] : 1);
    return acc;
  }, {});
}

// Get daily booking counts
router.get('/stats/bookings', protect, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({}).select('createdAt');
    const grouped = groupByDate(bookings);
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get daily revenue
router.get('/stats/revenue', protect, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'completed' }).select('createdAt totalPrice');
    const grouped = groupByDate(bookings, 'totalPrice');
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 