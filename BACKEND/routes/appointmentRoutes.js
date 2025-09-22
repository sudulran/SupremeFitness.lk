const express = require("express");
const {
  bookAppointment,
  getAllAppointments,
  cancelAppointment,
  clearCanceledAppointments
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/", authMiddleware, bookAppointment);
router.get("/", authMiddleware, isAdmin, getAllAppointments);
router.delete("/:id", authMiddleware, isAdmin, cancelAppointment);
router.delete("/clear/canceled", authMiddleware, isAdmin, clearCanceledAppointments);

// Get appointments for logged in user
router.get("/user", authMiddleware, async (req, res) => {
  const Appointment = require("../models/appointmentModel");
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("trainer", "name expertise")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
