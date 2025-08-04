const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Car = require("../models/Car");
const ServiceType = require("../models/ServiceType");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Create new car (authenticated owner)
router.post("/", protect, upload.array("images", 10), async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // Parse service types from form data
    let serviceTypes = [];
    if (req.body.serviceTypes) {
      // Handle both array and single string cases
      const serviceTypesData = Array.isArray(req.body.serviceTypes) 
        ? req.body.serviceTypes 
        : [req.body.serviceTypes];
      
      serviceTypes = serviceTypesData.map(st => {
        if (typeof st === 'string') {
          return JSON.parse(st);
        }
        return st;
      });
    }

    const carData = {
      ...req.body,
      images: imagePaths,
      ownerId: req.user._id,
      serviceTypes: serviceTypes
    };

    // Remove serviceTypes from req.body to avoid duplication
    delete carData.serviceTypes;
    carData.serviceTypes = serviceTypes;

    const newCar = await Car.create(carData);

    res.status(201).json(newCar);
  } catch (err) {
    console.error('Error creating car:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get cars for the authenticated owner
router.get("/my-cars", protect, async (req, res) => {
  try {
    const cars = await Car.find({ ownerId: req.user._id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get cars with optional filtering by service type
router.get("/", async (req, res) => {
  const { ownerId, serviceType } = req.query;
  try {
    let filter = ownerId ? { ownerId } : {};
    
    // Filter by service type if provided
    if (serviceType) {
      // Find service type by code
      const serviceTypeDoc = await ServiceType.findOne({ code: serviceType, isActive: true });
      if (serviceTypeDoc) {
        filter['serviceTypes.serviceTypeId'] = serviceTypeDoc._id;
        filter['serviceTypes.isActive'] = true;
      }
    }
    
    const cars = await Car.find(filter).populate({
      path: 'serviceTypes.serviceTypeId',
      model: 'ServiceType',
      match: { isActive: true }
    });
    
    // Filter out cars that don't have the requested service type populated
    const filteredCars = cars.filter(car => {
      if (serviceType) {
        return car.serviceTypes.some(st => st.serviceTypeId && st.isActive);
      }
      return true;
    });
    
    res.json(filteredCars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a car by ID (only owner should be allowed — you can add extra checks)
router.delete("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this car" });
    }

    await car.deleteOne();

    // Delete images
    if (car.images?.length) {
      car.images.forEach((path) => {
        const filePath = `.${path}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update car (only by owner)
router.put("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this car" });
    }

    // Parse service types from request body if provided
    let updateData = { ...req.body };
    if (req.body.serviceTypes) {
      const serviceTypesData = Array.isArray(req.body.serviceTypes) 
        ? req.body.serviceTypes 
        : [req.body.serviceTypes];
      
      updateData.serviceTypes = serviceTypesData.map(st => {
        if (typeof st === 'string') {
          return JSON.parse(st);
        }
        return st;
      });
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updatedCar);
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single car by ID (public) with service types
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate({
      path: 'serviceTypes.serviceTypeId',
      model: 'ServiceType',
      match: { isActive: true }
    });
    
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
