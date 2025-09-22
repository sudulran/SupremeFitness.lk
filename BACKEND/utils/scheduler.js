const cron = require("node-cron");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

// Schedule reminders when a new appointment is created
const scheduleReminders = (appointment) => {
  const { _id, user, appointmentDate } = appointment;
  const time = new Date(appointmentDate).getTime();

  // reminder times in ms before appointment
  const reminders = [
    { offset: 15 * 60 * 1000, message: "Reminder: Your appointment is in 15 minutes!" },
    { offset: 5 * 60 * 1000, message: "Reminder: Your appointment is in 5 minutes!" },
    { offset: 1 * 60 * 1000, message: "Reminder: Your appointment is in 1 minute!" },
  ];

  reminders.forEach(({ offset, message }) => {
    const reminderTime = new Date(time - offset);

    if (reminderTime > new Date()) {
      cron.schedule(
        `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`,
        async () => {
          await Notification.create({
            user,
            appointment: _id,
            message,
          });
          console.log("Reminder sent:", message);
        }
      );
    }
  });
};

module.exports = { scheduleReminders };
