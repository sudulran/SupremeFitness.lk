// models/trainerModel.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

const availabilitySchema = new mongoose.Schema({
  day: { type: Date, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  ratePerHour: { type: Number, required: true },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String },
  availability: [availabilitySchema],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Trainer", trainerSchema);
