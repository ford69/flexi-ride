const express = require('express');
const router = express.Router();
const ServiceType = require('../models/ServiceType');
const { protect } = require('../middleware/authmiddleware');

// Get all active service types
router.get('/', async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });
    res.json(serviceTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service types', error: error.message });
  }
});

// Get all service types (admin only)
router.get('/all', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const serviceTypes = await ServiceType.find()
      .sort({ sortOrder: 1, name: 1 });
    res.json(serviceTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service types', error: error.message });
  }
});

// Create new service type (admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, code, description, defaultPrice, pricingType, icon, sortOrder } = req.body;
    
    const serviceType = new ServiceType({
      name,
      code,
      description,
      defaultPrice,
      pricingType,
      icon,
      sortOrder
    });

    await serviceType.save();
    res.status(201).json(serviceType);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service type', error: error.message });
  }
});

// Update service type (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, code, description, defaultPrice, pricingType, icon, sortOrder, isActive } = req.body;
    
    const serviceType = await ServiceType.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        description,
        defaultPrice,
        pricingType,
        icon,
        sortOrder,
        isActive
      },
      { new: true }
    );

    if (!serviceType) {
      return res.status(404).json({ message: 'Service type not found' });
    }

    res.json(serviceType);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service type', error: error.message });
  }
});

// Delete service type (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const serviceType = await ServiceType.findByIdAndDelete(req.params.id);
    
    if (!serviceType) {
      return res.status(404).json({ message: 'Service type not found' });
    }

    res.json({ message: 'Service type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service type', error: error.message });
  }
});

module.exports = router; 