import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const TrainerBookingDialog = ({
  open,
  onClose,
  selectedTrainer,
  selectedSlot,
  setSelectedSlot,
  userAppointments,
  formatTime12,
}) => {
  const [notif, setNotif] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  // Helper to format date as MM-DD
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}-${dd}`;
  };

  // Helper to check if slot is in the past
  const isPastSlot = (slot) => {
    if (!slot || !slot.day) return false;
    const slotDate = new Date(slot.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time
    return slotDate < today; // cannot select past dates
  };

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedTrainer) {
      setNotif({ open: true, message: "Please select a slot first!", severity: "warning" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          trainerId: selectedTrainer._id,
          slot: selectedSlot,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setNotif({ open: true, message: data.message, severity: "success" });
        setSelectedSlot(null);
        onClose();
      } else {
        setNotif({ open: true, message: data.message || "Booking failed", severity: "error" });
      }
    } catch (err) {
      setNotif({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>Book Your Trainer</DialogTitle>

        <DialogContent>
          <p style={{ marginBottom: 16, fontWeight: 600, color: "#555" }}>
            Select an available time slot
          </p>

          {selectedTrainer?.availability?.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "14px",
              }}
            >
              {selectedTrainer.availability.map((slot, i) => {
                const alreadyBooked = userAppointments.some(
                  (a) =>
                    a.slot.day === slot.day &&
                    a.slot.start === slot.start &&
                    a.slot.end === slot.end
                );

                const pastSlot = isPastSlot(slot);
                const isSelected = selectedSlot === slot;

                return (
                  <div
                    key={i}
                    onClick={() => !alreadyBooked && !pastSlot && setSelectedSlot(slot)}
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      cursor: alreadyBooked || pastSlot ? "not-allowed" : "pointer",
                      backgroundColor: isSelected
                        ? "#3f51b5"
                        : alreadyBooked || pastSlot
                        ? "#f8f8f8"
                        : "#fff",
                      color: isSelected ? "#fff" : alreadyBooked || pastSlot ? "#aaa" : "#333",
                      textAlign: "center",
                      boxShadow: isSelected
                        ? "0 6px 20px rgba(63,81,181,0.3)"
                        : "0 2px 6px rgba(0,0,0,0.08)",
                      transition: "all 0.25s ease-in-out",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!alreadyBooked && !pastSlot && !isSelected)
                        e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {formatDateDisplay(slot.day)}
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      {formatTime12(slot.start)} - {formatTime12(slot.end)}
                    </div>
                    {(alreadyBooked || pastSlot) && (
                      <div
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          fontSize: 11,
                          color: "#e53935",
                          fontWeight: 600,
                        }}
                      >
                        {alreadyBooked ? "Booked" : "Unavailable"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
              No available slots
            </p>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={loading}
            sx={{ fontWeight: 600 }}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notif.open}
        autoHideDuration={3000}
        onClose={() => setNotif({ ...notif, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotif({ ...notif, open: false })}
          severity={notif.severity}
          variant="filled"
        >
          {notif.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TrainerBookingDialog;
