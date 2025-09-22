import React, { useEffect, useState } from "react";
import { Typography, Grid, Button } from "@mui/material";
import StoreAdminSidebar from "../components/StoreAdminSidebar";
import axiosInstance from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import AdminCard from "../components/adminTrainer/AdminCard"; // <-- Uppercase
import TrainerFormDialog from "../components/adminTrainer/TrainerFormDialog";
import AppointmentButtons from "../components/adminTrainer/AppointmentButtons";
import AppointmentList from "../components/adminTrainer/AppointmentList";

function AdminTrainerManagement() {
  const [trainers, setTrainers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [canceledAppointments, setCanceledAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", expertise: "", ratePerHour: "", phone: "",
    isActive: true, availability: [], profileImage: null
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
    background: "#f7f7f8"
  };

  const tomorrowStr = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];

  const formatTime12 = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    let hh = parseInt(h) % 12 || 12;
    const ampm = parseInt(h) >= 12 ? "PM" : "AM";
    return `${hh}:${m} ${ampm}`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getPreviewSrc = (image) => {
    if (!image) return "";
    if (image instanceof File) return URL.createObjectURL(image);
    if (typeof image === "string") return image.startsWith("http") ? image : `http://localhost:5000/${image.replace(/\\/g, "/")}`;
    return "";
  };

  // Fetch trainers & appointments
  const fetchTrainers = async () => {
    try {
      const res = await axiosInstance.get("/trainers");
      setTrainers(res.data);
    } catch {
      toast.error("Failed to fetch trainers");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointments");
      setAppointments(res.data.filter(a => !a.isCanceled));
      setCanceledAppointments(res.data.filter(a => a.isCanceled));
    } catch {
      toast.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    fetchTrainers();
    fetchAppointments();
  }, []);

  // Trainer modal handlers
  const handleOpen = (trainer = null) => {
    if (trainer) {
      setFormData({ ...trainer, availability: trainer.availability || [], profileImage: trainer.profileImage || null });
      setEditId(trainer._id);
    } else {
      setFormData({ name: "", expertise: "", ratePerHour: "", phone: "", isActive: true, availability: [], profileImage: null });
      setEditId(null);
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Save trainer
  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "availability") data.append(key, JSON.stringify(val));
        else if (key === "profileImage" && val instanceof File) data.append(key, val);
        else data.append(key, val);
      });
      if (editId) await axiosInstance.put(`/trainers/${editId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      else await axiosInstance.post("/trainers", data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(editId ? "Trainer updated" : "Trainer added");
      fetchTrainers();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // Delete trainer
  const handleDeleteTrainer = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/trainers/${id}`);
        setTrainers(prev => prev.filter(t => t._id !== id));
        Swal.fire("Deleted!", "Trainer has been deleted.", "success");
      } catch {
        Swal.fire("Error", "Failed to delete trainer.", "error");
      }
    }
  };

  // Appointments handlers
  const handleCancelAppointment = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Appointment?",
      text: "This will mark the appointment as canceled!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!"
    });
    if (result.isConfirmed) {
      try {
        const canceled = appointments.find(a => a._id === id);
        await axiosInstance.delete(`/appointments/${id}`);
        setAppointments(prev => prev.filter(a => a._id !== id));
        setCanceledAppointments(prev => [...prev, { ...canceled, isCanceled: true }]);
        Swal.fire("Cancelled!", "Appointment has been canceled.", "success");
      } catch {
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
      confirmButtonText: "Yes, clear all!"
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete("/appointments/clear/canceled");
        setCanceledAppointments([]);
        Swal.fire("Cleared!", "All canceled appointments have been removed.", "success");
      } catch {
        Swal.fire("Error", "Failed to clear canceled appointments.", "error");
      }
    }
  };

  // Availability handlers
  const handleAvailabilityChange = (i, field, val) => {
    const updated = [...formData.availability];
    updated[i] = { ...updated[i], [field]: val };
    setFormData({ ...formData, availability: updated });
  };
  const addAvailability = () => setFormData({ ...formData, availability: [...formData.availability, { day: "", start: "", end: "" }] });
  const removeAvailability = (i) => setFormData({ ...formData, availability: formData.availability.filter((_, idx) => idx !== i) });

  // PDF & Excel downloads
  const downloadPDF = (data, type) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(type === "booked" ? "Booked Appointments" : "Canceled Appointments", 14, 20);
    const tableColumn = ["Trainer", "User", "Email", "Date", "Time", "Status"];
    const tableRows = data.map(a => [
      a.trainer?.name || "N/A",
      a.user?.name || "N/A",
      a.user?.email || "N/A",
      a.slot?.day ? formatDateDisplay(a.slot.day) : "N/A",
      a.slot?.start && a.slot?.end ? `${formatTime12(a.slot.start)} - ${formatTime12(a.slot.end)}` : "N/A",
      a.isCanceled ? "Canceled" : "Booked"
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save(`${type}-appointments.pdf`);
  };

  const downloadExcel = (data, type) => {
    const wsData = data.map(a => ({
      Trainer: a.trainer?.name || "N/A",
      User: a.user?.name || "N/A",
      Email: a.user?.email || "N/A",
      Date: a.slot?.day ? formatDateDisplay(a.slot.day) : "N/A",
      Time: a.slot?.start && a.slot?.end ? `${formatTime12(a.slot.start)} - ${formatTime12(a.slot.end)}` : "N/A",
      Status: a.isCanceled ? "Canceled" : "Booked"
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === "booked" ? "Booked" : "Canceled");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${type}-appointments.xlsx`);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <StoreAdminSidebar />
      <div style={dashboardContentStyle}>
        <Typography variant="h5" gutterBottom>Trainer Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginBottom: 20 }}>Add Trainer</Button>

        <Grid container spacing={2}>
          {trainers.length > 0 ? trainers.map(t => (
            <Grid item xs={12} sm={6} md={4} key={t._id}>
              <AdminCard
                trainer={t}
                onEdit={handleOpen}
                onDelete={handleDeleteTrainer}
                getPreviewSrc={getPreviewSrc}
                formatDateDisplay={formatDateDisplay}
                formatTime12={formatTime12}
              />
            </Grid>
          )) : (
            <Grid item xs={12}><Typography>No trainers found.</Typography></Grid>
          )}
        </Grid>

        <AppointmentButtons appointments={appointments} canceledAppointments={canceledAppointments} downloadPDF={downloadPDF} downloadExcel={downloadExcel} />

        <AppointmentList appointments={appointments} canceledAppointments={canceledAppointments} handleCancelAppointment={handleCancelAppointment} handleClearCanceled={handleClearCanceled} formatDateDisplay={formatDateDisplay} formatTime12={formatTime12} />

        <TrainerFormDialog
          open={open}
          onClose={handleClose}
          formData={formData}
          setFormData={setFormData}
          editId={editId}
          handleSave={handleSave}
          addAvailability={addAvailability}
          removeAvailability={removeAvailability}
          handleAvailabilityChange={handleAvailabilityChange}
          getPreviewSrc={getPreviewSrc}
          tomorrowStr={tomorrowStr}
        />

        <ToastContainer position="top-right" autoClose={3000} newestOnTop />
      </div>
    </div>
  );
}

export default AdminTrainerManagement;
