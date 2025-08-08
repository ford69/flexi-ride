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

      // Apply service charge (25%) to each service type
      serviceTypes = serviceTypes.map(st => ({
        ...st,
        basePrice: st.price || st.basePrice || 0,
        totalPrice: Math.round((st.price || st.basePrice || 0) * 1.25), // Add 25% service charge
        isActive: st.isActive !== false
      }));
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

// ✅ Get cars for the authenticated owner (shows base prices only)
router.get("/my-cars", protect, async (req, res) => {
  try {
    const cars = await Car.find({ ownerId: req.user._id }).populate({
      path: 'serviceTypes.serviceTypeId',
      model: 'ServiceType',
      match: { isActive: true }
    });
    
    // For owners, show base prices (without service charge)
    const carsWithBasePrices = cars.map(car => {
      const carObj = car.toObject();
      return {
        ...carObj,
        serviceTypes: carObj.serviceTypes.map(st => ({
          ...st,
          serviceTypeId: st.serviceTypeId ? {
            _id: st.serviceTypeId._id,
            name: st.serviceTypeId.name,
            code: st.serviceTypeId.code,
            description: st.serviceTypeId.description,
            isActive: st.serviceTypeId.isActive,
            defaultPrice: st.serviceTypeId.defaultPrice,
            pricingType: st.serviceTypeId.pricingType,
            icon: st.serviceTypeId.icon,
            sortOrder: st.serviceTypeId.sortOrder
          } : null,
          displayPrice: st.basePrice, // Show base price to owners
          priceBreakdown: {
            basePrice: st.basePrice,
            serviceCharge: st.totalPrice - st.basePrice,
            totalPrice: st.totalPrice
          }
        }))
      };
    });
    
    res.json(carsWithBasePrices);
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
    
    // For customers, show total prices (including service charge)
    const carsWithTotalPrices = filteredCars.map(car => {
      const carObj = car.toObject();
      return {
        ...carObj,
        serviceTypes: carObj.serviceTypes.map(st => ({
          ...st,
          serviceTypeId: st.serviceTypeId ? {
            _id: st.serviceTypeId._id,
            name: st.serviceTypeId.name,
            code: st.serviceTypeId.code,
            description: st.serviceTypeId.description,
            isActive: st.serviceTypeId.isActive,
            defaultPrice: st.serviceTypeId.defaultPrice,
            pricingType: st.serviceTypeId.pricingType,
            icon: st.serviceTypeId.icon,
            sortOrder: st.serviceTypeId.sortOrder
          } : null,
          displayPrice: st.totalPrice, // Show total price to customers
          priceBreakdown: {
            basePrice: st.basePrice,
            serviceCharge: st.totalPrice - st.basePrice,
            totalPrice: st.totalPrice
          }
        }))
      };
    });
    
    res.json(carsWithTotalPrices);
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

      // Apply service charge (25%) to each service type
      updateData.serviceTypes = updateData.serviceTypes.map(st => ({
        ...st,
        basePrice: st.price || st.basePrice || 0,
        totalPrice: Math.round((st.price || st.basePrice || 0) * 1.25), // Add 25% service charge
        isActive: st.isActive !== false
      }));
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
    
    // Check if the request is from the owner
    const isOwner = req.user && req.user._id.toString() === car.ownerId.toString();
    
    // For customers, show total prices (including service charge)
    // For owners, show base prices (without service charge)
    const carObj = car.toObject();
    const carWithPricing = {
      ...carObj,
      serviceTypes: carObj.serviceTypes.map(st => ({
        ...st,
        serviceTypeId: st.serviceTypeId ? {
          _id: st.serviceTypeId._id,
          name: st.serviceTypeId.name,
          code: st.serviceTypeId.code,
          description: st.serviceTypeId.description,
          isActive: st.serviceTypeId.isActive,
          defaultPrice: st.serviceTypeId.defaultPrice,
          pricingType: st.serviceTypeId.pricingType,
          icon: st.serviceTypeId.icon,
          sortOrder: st.serviceTypeId.sortOrder
        } : null,
        displayPrice: isOwner ? st.basePrice : st.totalPrice,
        priceBreakdown: {
          basePrice: st.basePrice,
          serviceCharge: st.totalPrice - st.basePrice,
          totalPrice: st.totalPrice
        }
      }))
    };
    
    res.json(carWithPricing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
