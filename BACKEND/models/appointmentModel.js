const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
  slot: {
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  isCanceled: { type: Boolean, default: false }, // <-- persist canceled
});

module.exports = mongoose.model("Appointment", appointmentSchema);
