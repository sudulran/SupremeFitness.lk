const Appointment = require("../models/appointmentModel");
const Trainer = require("../models/trainerModel");
const Notification = require("../models/notificationModel");
const { scheduleReminders } = require("../utils/scheduler");

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { trainerId, slot } = req.body;
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const existing = await Appointment.findOne({
      user: req.user._id,
      "slot.day": slot.day,
      "slot.start": slot.start,
      "slot.end": slot.end,
      isCanceled: false,
    });
    if (existing) return res.status(400).json({ message: "You have already booked this slot" });

    const now = new Date();
    const dayMap = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
    const dayDiff = (dayMap[slot.day] + 7 - now.getDay()) % 7;
    const [hour, minute] = slot.start.split(":").map(Number);
    const appointmentDate = new Date(now);
    appointmentDate.setDate(now.getDate() + dayDiff);
    appointmentDate.setHours(hour, minute, 0, 0);

    const appointment = new Appointment({
      user: req.user._id,
      trainer: trainerId,
      slot,
      appointmentDate,
    });
    await appointment.save();

    await Notification.create({
      user: req.user._id,
      appointment: appointment._id,
      message: `You booked an appointment with ${trainer.name} on ${slot.day} (${slot.start} - ${slot.end}).`,
    });

    scheduleReminders(appointment);

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Booking failed" });
  }
};

// Get all appointments (admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email")
      .populate("trainer", "name expertise");
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Cancel appointment (mark as canceled)
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("user trainer");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.isCanceled = true;
    await appointment.save();

    await Notification.create({
      user: appointment.user._id,
      message: `Your appointment with ${appointment.trainer.name} on ${appointment.slot.day} (${appointment.slot.start} - ${appointment.slot.end}) has been cancelled.`,
    });

    res.json({ message: "Appointment canceled and notification sent.", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel appointment." });
  }
};

// Clear all canceled appointments (admin)
exports.clearCanceledAppointments = async (req, res) => {
  try {
    await Appointment.deleteMany({ isCanceled: true });
    res.json({ message: "All canceled appointments cleared." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear canceled appointments." });
  }
};
