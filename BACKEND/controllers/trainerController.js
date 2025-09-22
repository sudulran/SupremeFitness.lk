const Trainer = require("../models/trainerModel");
const fs = require("fs");
const path = require("path");

// Parse availability array & remove past dates
const parseAvailability = (availabilityArray) => {
  if (!availabilityArray) return [];
  try {
    const parsed = JSON.parse(availabilityArray);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // only compare date
    return parsed
      .map((a) => ({
        day: a.day ? new Date(a.day) : null,
        start: a.start || "",
        end: a.end || "",
      }))
      .filter((a) => a.day && a.day >= today); // remove past dates
  } catch {
    return [];
  }
};

// Get All Trainers 
exports.getAllTrainers = async (req, res) => {
  try {
    const { search, sortBy, availabilityDay, status, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (availabilityDay) query["availability.day"] = { $eq: new Date(availabilityDay) };

    if (status === "active") query.isActive = true;
    else if (status === "inactive") query.isActive = false;

    let trainers = Trainer.find(query);

    // Sorting
    if (sortBy === "rateAsc") trainers = trainers.sort({ ratePerHour: 1 });
    else if (sortBy === "rateDesc") trainers = trainers.sort({ ratePerHour: -1 });
    else if (sortBy === "ratingDesc") trainers = trainers.sort({ averageRating: -1 });

    trainers = await trainers.skip((page - 1) * limit).limit(parseInt(limit));
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Add Trainer
exports.addTrainer = async (req, res) => {
  try {
    const { name, expertise, ratePerHour, phone, isActive, availability } = req.body;
    if (!name || !expertise || !ratePerHour) {
      return res.status(400).json({ message: "Name, expertise, rate required" });
    }

    const parsedAvailability = parseAvailability(availability);

    const trainer = new Trainer({
      name,
      expertise,
      ratePerHour,
      phone,
      isActive,
      availability: parsedAvailability,
      profileImage: req.file ? `uploads/${req.file.filename}` : null,
    });

    await trainer.save();
    res.json({ message: "Trainer added successfully", trainer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Fixed Update Trainer
exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findById(id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    // Only parse & filter availability if it's provided
    if (req.body.availability) {
      trainer.availability = parseAvailability(req.body.availability);
    }

    // Update other fields
    const allowedFields = ["name", "expertise", "ratePerHour", "phone", "isActive"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) trainer[field] = req.body[field];
    });

    // Handle profile image update
    if (req.file) {
      if (trainer.profileImage) {
        const oldPath = path.join(__dirname, "..", trainer.profileImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      trainer.profileImage = `uploads/${req.file.filename}`;
    }

    await trainer.save();
    res.json({ message: "Trainer updated successfully", trainer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    if (trainer.profileImage) {
      const imgPath = path.join(__dirname, "..", trainer.profileImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await trainer.deleteOne();
    res.json({ message: "Trainer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { trainerId, comment, rating } = req.body;
    if (!trainerId) return res.status(400).json({ message: "trainerId required" });

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    trainer.reviews.push({ user: req.user._id, comment, rating });
    trainer.averageRating =
      trainer.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / trainer.reviews.length;

    await trainer.save();
    res.json({ message: "Review added successfully", trainer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const { trainerId, reviewId } = req.params;
    const { comment, rating } = req.body;

    if (!trainerId || !reviewId)
      return res.status(400).json({ message: "trainerId and reviewId are required in params" });

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const review = trainer.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden - not review owner" });
    }

    if (typeof comment !== "undefined") review.comment = comment;
    if (typeof rating !== "undefined") review.rating = rating;

    trainer.averageRating =
      trainer.reviews.length > 0
        ? trainer.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / trainer.reviews.length
        : 0;

    await trainer.save();
    res.json({ message: "Review updated successfully", trainer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const { trainerId, reviewId } = req.params;
    if (!trainerId || !reviewId)
      return res.status(400).json({ message: "trainerId and reviewId are required in params" });

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const review = trainer.reviews.find((r) => r._id.toString() === reviewId.toString());
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this review" });

    trainer.reviews = trainer.reviews.filter((r) => r._id.toString() !== reviewId.toString());
    trainer.averageRating =
      trainer.reviews.length > 0
        ? trainer.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / trainer.reviews.length
        : 0;

    await trainer.save();
    res.json({ message: "Review deleted successfully", trainer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
