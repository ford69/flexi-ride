const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Car = require("../models/Car");
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

    const newCar = await Car.create({
      ...req.body,
      images: imagePaths,
      ownerId: req.user._id, // 🔐 Set ownerId from authenticated user
    });

    res.status(201).json(newCar);
  } catch (err) {
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

// ❌ Public: Get cars by any owner ID (if needed for admin or public views)
router.get("/", async (req, res) => {
  const { ownerId } = req.query;
  try {
    const filter = ownerId ? { ownerId } : {}; // ← ✅ this line is key
    const cars = await Car.find(filter);
    res.json(cars);
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

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single car by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
