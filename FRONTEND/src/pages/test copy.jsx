import React, { useEffect, useState } from "react";
import {
  Typography,
  IconButton,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Avatar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import StoreAdminSidebar from "../components/StoreAdminSidebar";
import axiosInstance from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function AdminTrainerManagement() {
  const [trainers, setTrainers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    ratePerHour: "",
    phone: "",
    isActive: true,
    availability: [],
    profileImage: null,
  });
  const [editId, setEditId] = useState(null);

  const sidebarWidth = 200;
  const dashboardContentStyle = {
    flex: 1,
    padding: "20px",
    marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : "0",
    transition: "margin-left 0.3s",
    overflowX: "auto",
    minHeight: "100vh",
    background: "#f7f7f8",
  };

  // ---------- Helpers ----------
  const formatTime12 = (time24) => {
    if (!time24) return "";
    const [hourStr, min] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${min} ${ampm}`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}-${dd}`;
  };

  // ---------- Fetch ----------
  const fetchTrainers = async () => {
    try {
      const response = await axiosInstance.get("/trainers");
      setTrainers(response.data);
    } catch (err) {
      toast.error("Failed to fetch trainers");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get("/appointments");
      setAppointments(response.data.filter((a) => !a.isCanceled));
      setCanceledAppointments(response.data.filter((a) => a.isCanceled));
    } catch (err) {
      toast.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    fetchTrainers();
    fetchAppointments();
  }, []);

  // ---------- Trainer Modal ----------
  const handleOpen = (trainer = null) => {
    if (trainer) {
      setFormData({
        name: trainer.name || "",
        expertise: trainer.expertise || "",
        ratePerHour: trainer.ratePerHour || "",
        phone: trainer.phone || "",
        isActive: trainer.isActive ?? true,
        availability: trainer.availability || [],
        profileImage: trainer.profileImage || null,
      });
      setEditId(trainer._id);
    } else {
      setFormData({
        name: "",
        expertise: "",
        ratePerHour: "",
        phone: "",
        isActive: true,
        availability: [],
        profileImage: null,
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("expertise", formData.expertise);
      data.append("ratePerHour", formData.ratePerHour);
      data.append("phone", formData.phone);
      data.append("isActive", formData.isActive);
      data.append("availability", JSON.stringify(formData.availability));

      if (formData.profileImage instanceof File) {
        data.append("profileImage", formData.profileImage);
      }

      if (editId) {
        await axiosInstance.put(`/trainers/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Trainer updated successfully!");
      } else {
        await axiosInstance.post("/trainers", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Trainer added successfully!");
      }

      fetchTrainers();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteTrainer = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/trainers/${id}`);
        setTrainers((prev) => prev.filter((t) => t._id !== id));
        Swal.fire("Deleted!", "Trainer has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete trainer.", "error");
      }
    }
  };

  // ---------- Appointments ----------
  const handleCancelAppointment = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Appointment?",
      text: "This will mark the appointment as canceled!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const canceled = appointments.find((a) => a._id === id);
        await axiosInstance.delete(`/appointments/${id}`);
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        setCanceledAppointments((prev) => [
          ...prev,
          { ...canceled, isCanceled: true },
        ]);
        Swal.fire("Cancelled!", "Appointment has been canceled.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to cancel appointment.", "error");
      }
    }
  };

  const handleClearCanceled = async () => {
    const result = await Swal.fire({
      title: "Clear all canceled appointments?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear all!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete("/appointments/clear/canceled");
        setCanceledAppointments([]);
        Swal.fire(
          "Cleared!",
          "All canceled appointments have been removed.",
          "success"
        );
      } catch (err) {
        Swal.fire("Error", "Failed to clear canceled appointments.", "error");
      }
    }
  };

  // ---------- Availability ----------
  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...formData.availability];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, availability: updated });
  };

  const addAvailability = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, { day: "", start: "", end: "" }],
    });
  };

  const removeAvailability = (index) => {
    const updated = formData.availability.filter((_, i) => i !== index);
    setFormData({ ...formData, availability: updated });
  };

  const getPreviewSrc = (image) => {
    if (!image) return "";
    if (image instanceof File) return URL.createObjectURL(image);
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return `http://localhost:5000/${image.replace(/\\/g, "/")}`;
    }
    return "";
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

const downloadPDF = (data, type) => {
  const doc = new jsPDF();
  const title = type === "booked" ? "Booked Appointments" : "Canceled Appointments";

  doc.setFontSize(16);
  doc.text(title, 14, 20);

  const tableColumn = ["Trainer", "User", "Email", "Date", "Time", "Status"];
  const tableRows = [];

  data.forEach((a) => {
    tableRows.push([
      a.trainer?.name || "N/A",
      a.user?.name || "N/A",
      a.user?.email || "N/A",
      a.slot?.day ? formatDateDisplay(a.slot.day) : "N/A",
      a.slot?.start && a.slot?.end
        ? `${formatTime12(a.slot.start)} - ${formatTime12(a.slot.end)}`
        : "N/A",
      a.isCanceled ? "Canceled" : "Booked",
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });

  doc.save(`${title}.pdf`);
};

  // ---------- Excel ----------
  const downloadExcel = (data, type) => {
    const wsData = data.map((a) => ({
      Trainer: a.trainer?.name || "N/A",
      User: a.user?.name || "N/A",
      Email: a.user?.email || "N/A",
      Date: a.slot?.day ? formatDateDisplay(a.slot.day) : "N/A",
      Time:
        a.slot?.start && a.slot?.end
          ? `${formatTime12(a.slot.start)} - ${formatTime12(a.slot.end)}`
          : "N/A",
      Status: a.isCanceled ? "Canceled" : "Booked",
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === "booked" ? "Booked" : "Canceled");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `${type}-appointments.xlsx`
    );
  };

  // ---------- Render ----------
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <StoreAdminSidebar />
      <div style={dashboardContentStyle}>
        <Typography variant="h5" gutterBottom>
          Trainer Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          style={{ marginBottom: 20 }}
        >
          Add Trainer
        </Button>

        {/* Trainers */}
        <Grid container spacing={2}>
          {trainers.length > 0 ? (
            trainers.map((trainer) => (
              <Grid item xs={12} sm={6} md={4} key={trainer._id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar
                          src={getPreviewSrc(trainer.profileImage)}
                          sx={{ width: 64, height: 64 }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6">{trainer.name}</Typography>
                        <Typography>{trainer.expertise}</Typography>
                        <Typography>Rate: ${trainer.ratePerHour}/hr</Typography>
                        <Typography>📞 {trainer.phone}</Typography>
                        <Typography
                          style={{ color: trainer.isActive ? "green" : "red" }}
                        >
                          {trainer.isActive ? "Active" : "Inactive"}
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: 6 }}>
                          {trainer.availability
                            ?.map(
                              (a) =>
                                `${formatDateDisplay(a.day)} (${formatTime12(
                                  a.start
                                )} - ${formatTime12(a.end)})`
                            )
                            .join(", ")}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => handleOpen(trainer)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteTrainer(trainer._id)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>No trainers found.</Typography>
            </Grid>
          )}
        </Grid>

        {/* Appointments Download Buttons */}
        <Grid container justifyContent="flex-end" spacing={1} style={{ marginBottom: 10, marginTop: 20 }}>
          <Grid item>
            <Button variant="outlined" color="primary" onClick={() => downloadPDF(appointments, "booked")}>
              Download Booked PDF
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary" onClick={() => downloadExcel(appointments, "booked")}>
              Download Booked Excel
            </Button>
          </Grid>
          {canceledAppointments.length > 0 && (
            <>
              <Grid item>
                <Button variant="outlined" color="secondary" onClick={() => downloadPDF(canceledAppointments, "canceled")}>
                  Download Canceled PDF
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="secondary" onClick={() => downloadExcel(canceledAppointments, "canceled")}>
                  Download Canceled Excel
                </Button>
              </Grid>
            </>
          )}
        </Grid>

        {/* Appointments list */}
        <Typography variant="h5" style={{ marginTop: 30 }}>Booked Trainers</Typography>
        {appointments.length > 0 ? (
          appointments.map((a) => (
            <Card key={a._id} style={{ marginBottom: 10 }}>
              <CardContent>
                <Typography>Trainer: {a.trainer?.name}</Typography>
                <Typography>User: {a.user?.name} ({a.user?.email})</Typography>
                <Typography>
                  Slot: {formatDateDisplay(a.slot?.day)} (
                  {formatTime12(a.slot?.start)} - {formatTime12(a.slot?.end)})
                </Typography>
                <Button variant="outlined" color="error" onClick={() => handleCancelAppointment(a._id)} style={{ marginTop: 10 }}>
                  Cancel
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No appointments booked.</Typography>
        )}

        {/* Canceled Appointments */}
        {canceledAppointments.length > 0 && (
          <>
            <Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: 30 }}>
              <Typography variant="h5">Canceled Appointments</Typography>
              <Button variant="outlined" color="secondary" onClick={handleClearCanceled}>
                Clear Canceled Appointments
              </Button>
            </Grid>
            {canceledAppointments.map((a) => (
              <Card key={a._id} style={{ marginBottom: 10, backgroundColor: "#f8d7da" }}>
                <CardContent>
                  <Typography>Trainer: {a.trainer?.name}</Typography>
                  <Typography>User: {a.user?.name} ({a.user?.email})</Typography>
                  <Typography>
                    Slot: {formatDateDisplay(a.slot?.day)} (
                    {formatTime12(a.slot?.start)} - {formatTime12(a.slot?.end)})
                  </Typography>
                  <Typography color="error" style={{ marginTop: 6 }}>
                    Canceled
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Add/Edit Trainer Modal */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editId ? "Edit Trainer" : "Add Trainer"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Expertise"
              fullWidth
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Rate Per Hour"
              type="number"
              fullWidth
              value={formData.ratePerHour}
              onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <FormControlLabel
              control={<Switch checked={!!formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />}
              label={formData.isActive ? "Active" : "Inactive"}
              style={{ marginTop: 10 }}
            />

            {/* Profile Image Upload */}
            <div style={{ marginTop: 15 }}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
                />
              </Button>
              {formData.profileImage && (
                <div style={{ marginTop: 8, textAlign: "center" }}>
                  <img
                    src={getPreviewSrc(formData.profileImage)}
                    alt="preview"
                    style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }}
                  />
                  <Typography variant="body2" style={{ marginTop: 6 }}>
                    {formData.profileImage instanceof File
                      ? formData.profileImage.name
                      : formData.profileImage}
                  </Typography>
                </div>
              )}
            </div>

            {/* Availability */}
            <Typography variant="subtitle1" style={{ marginTop: 16 }}>Availability</Typography>
            {formData.availability.map((a, index) => (
              <Grid container spacing={1} alignItems="center" key={index} style={{ marginTop: 6 }}>
                <Grid item xs={4}>
                  <TextField
                    label="Day"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={a.day ? new Date(a.day).toISOString().split("T")[0] : ""}
                    inputProps={{ min: tomorrowStr }}
                    fullWidth
                    onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    type="time"
                    label="Start"
                    InputLabelProps={{ shrink: true }}
                    value={a.start}
                    fullWidth
                    onChange={(e) => handleAvailabilityChange(index, "start", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    type="time"
                    label="End"
                    InputLabelProps={{ shrink: true }}
                    value={a.end}
                    fullWidth
                    onChange={(e) => handleAvailabilityChange(index, "end", e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => removeAvailability(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<Add />} onClick={addAvailability} style={{ marginTop: 10 }}>
              Add Availability
            </Button>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              {editId ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="top-right" autoClose={3000} newestOnTop />
      </div>
    </div>
  );
}

export default AdminTrainerManagement;
