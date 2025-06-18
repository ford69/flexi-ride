const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const { protect } = require('../middleware/authmiddleware'); // your auth middleware

// Create a booking
router.post('/', protect, async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const booking = await Booking.create({
      userId: req.user._id, // from auth middleware
      carId,
      startDate,
      endDate,
      totalPrice,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings for a user
router.get('/', protect, async (req, res) => {
  try {
    const { userId, carIds, includeUser } = req.query;
    let query = {};

    // If userId is provided, filter by user's bookings
    if (userId) {
      query.userId = userId;
    }

    // If carIds is provided, filter by those cars
    if (carIds) {
      const carIdArray = carIds.split(',');
      query.carId = { $in: carIdArray };
    }

    let bookings;
    if (includeUser === 'true') {
      // Populate user details if requested
      bookings = await Booking.find(query)
        .populate({
          path: 'userId',
          select: 'name email',
          model: User
        })
        .sort({ createdAt: -1 });

      // Transform the response to match the expected format
      bookings = bookings.map(booking => {
        const bookingObj = booking.toObject();
        return {
          ...bookingObj,
          id: bookingObj._id, // Ensure we have an id field
          user: bookingObj.userId ? {
            id: bookingObj.userId._id,
            name: bookingObj.userId.name,
            email: bookingObj.userId.email
          } : null,
          userId: bookingObj.userId?._id // Keep the userId field as is
        };
      });
    } else {
      bookings = await Booking.find(query).sort({ createdAt: -1 });
      // Transform _id to id for consistency
      bookings = bookings.map(booking => {
        const bookingObj = booking.toObject();
        return {
          ...bookingObj,
          id: bookingObj._id
        };
      });
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status (confirm/cancel/payment)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, paymentStatus, paymentReference } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If updating payment status
    if (paymentStatus && paymentReference) {
      booking.paymentStatus = paymentStatus;
      booking.paymentReference = paymentReference;
      // Automatically confirm booking when payment is received
      booking.status = 'confirmed';
    } 
    // If updating booking status
    else if (status) {
      // Get the car to check ownership for status updates
      const car = await Car.findById(booking.carId);
      
      // Only allow the car owner or the booking user to update the status
      if (car.ownerId.toString() !== req.user._id.toString() && 
          booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
      booking.status = status;
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking (optional, you might want to just cancel instead)
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow the booking user to delete
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
