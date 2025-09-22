import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Grid, Typography, Snackbar, Alert } from "@mui/material";
import TrainerCard from "../components/Trainer/TrainerCard";
import TrainerReviewDialog from "../components/Trainer/TrainerReviewDialog";
import TrainerBookingDialog from "../components/Trainer/TrainerBookingDialog";
import NotificationsMenu from "../components/NotificationsMenu";
import SearchFilter from "../components/Trainer/SearchFilter";

function TrainerBrowse() {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [status, setStatus] = useState(""); // ✅ Added status filter

  const [openReview, setOpenReview] = useState(false);
  const [reviewData, setReviewData] = useState({ comment: "", rating: 0 });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openNotifMenu = Boolean(anchorEl);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  let currentUserId = null;
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    currentUserId = stored?._id || stored?.id || null;
  } catch (e) { currentUserId = null; }

  const formatTime12 = (time24) => {
    const [hourStr, min] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${min} ${ampm}`;
  };

  // Fetch trainers
  const fetchTrainers = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      if (filterDay) params.availabilityDay = filterDay;
      if (status) params.status = status; // ✅ include status
      const res = await axiosInstance.get("/trainers", { params });
      setTrainers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUserAppointments = async () => {
    try { 
      const res = await axiosInstance.get("/appointments/user"); 
      setUserAppointments(res.data); 
    } catch (err) { console.error(err); }
  };

  const fetchNotifications = async () => {
    try { 
      const res = await axiosInstance.get("/notifications"); 
      setNotifications(res.data); 
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTrainers(); fetchUserAppointments(); }, [search, sortBy, filterDay, status]);
  useEffect(() => { 
    fetchNotifications(); 
    const interval = setInterval(fetchNotifications, 2000); 
    return () => clearInterval(interval); 
  }, []);

  // Review handlers
  const handleOpenReview = (trainer, review = null) => {
    setSelectedTrainer(trainer);
    if (review) { 
      setReviewData({ comment: review.comment || "", rating: review.rating || 0 }); 
      setEditingReviewId(review._id); 
    } else { 
      setReviewData({ comment: "", rating: 0 }); 
      setEditingReviewId(null); 
    }
    setOpenReview(true);
  };
  const handleCloseReview = () => { 
    setOpenReview(false); 
    setEditingReviewId(null); 
    setSelectedTrainer(null); 
    setReviewData({ comment: "", rating: 0 }); 
  };
  const handleSubmitReview = async () => {
    try {
      if (editingReviewId) {
        await axiosInstance.put(`/trainers/review/${selectedTrainer._id}/${editingReviewId}`, { ...reviewData });
      } else {
        await axiosInstance.post("/trainers/review", { trainerId: selectedTrainer._id, ...reviewData });
      }
      await fetchTrainers();
      handleCloseReview();
      setSnackbar({ open: true, message: "Review saved successfully!", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to save review", severity: "error" });
    }
  };
  const handleDeleteReview = async (trainerId, reviewId) => {
    try { 
      await axiosInstance.delete(`/trainers/review/${trainerId}/${reviewId}`); 
      await fetchTrainers(); 
      setSnackbar({ open: true, message: "Review deleted", severity: "success" });
    } catch (err) { 
      console.error(err); 
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to delete review", severity: "error" });
    }
  };

  // Booking handlers
  const handleOpenBooking = (trainer) => { setSelectedTrainer(trainer); setSelectedSlot(null); setBookingOpen(true); };
  const handleCloseBooking = () => { setBookingOpen(false); setSelectedTrainer(null); setSelectedSlot(null); };
  const handleBookTrainer = async () => {
    if (!selectedSlot) { 
      setSnackbar({ open: true, message: "Please select a slot", severity: "warning" });
      return; 
    }
    try { 
      await axiosInstance.post("/appointments", { trainerId: selectedTrainer._id, slot: selectedSlot });
      setSnackbar({ open: true, message: "Trainer booked successfully!", severity: "success" });
      fetchUserAppointments();
      handleCloseBooking();
    } catch (err) { 
      console.error(err); 
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to book trainer", severity: "error" });
    }
  };

  // Notifications handlers
  const handleNotifClick = (event) => setAnchorEl(event.currentTarget);
  const handleNotifClose = () => setAnchorEl(null);
  const markNotificationRead = async (notifId) => { try { await axiosInstance.put(`/notifications/${notifId}/read`); fetchNotifications(); } catch (err) { console.error(err); } };
  const clearNotifications = async () => { try { await axiosInstance.delete("/notifications/clear"); setNotifications([]); } catch (err) { console.error(err); } };

  return (
    <div style={{ padding: 20 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Trainers</Typography>
        <NotificationsMenu
          notifications={notifications}
          anchorEl={anchorEl}
          openNotifMenu={openNotifMenu}
          handleNotifClick={handleNotifClick}
          handleNotifClose={handleNotifClose}
          markNotificationRead={markNotificationRead}
          clearNotifications={clearNotifications}
        />
      </Grid>

      {/* Search / Sort / Day / Status Filters */}
      <SearchFilter 
        search={search} 
        setSearch={setSearch} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
        filterDay={filterDay} 
        setFilterDay={setFilterDay} 
        status={status} 
        setStatus={setStatus} 
      />

      <Grid container spacing={2} mt={2}>
        {trainers.map((trainer) => (
          <Grid item xs={12} md={4} key={trainer._id}>
            <TrainerCard
              trainer={trainer}
              currentUserId={currentUserId}
              onOpenReview={handleOpenReview}
              onOpenBooking={handleOpenBooking}
              onDeleteReview={handleDeleteReview}
              formatTime12={formatTime12}
            />
          </Grid>
        ))}
      </Grid>

      <TrainerReviewDialog
        open={openReview}
        onClose={handleCloseReview}
        reviewData={reviewData}
        setReviewData={setReviewData}
        onSubmit={handleSubmitReview}
        editingReviewId={editingReviewId}
      />

      <TrainerBookingDialog
        open={bookingOpen}
        onClose={handleCloseBooking}
        selectedTrainer={selectedTrainer}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        userAppointments={userAppointments}
        formatTime12={formatTime12}
        onConfirm={handleBookTrainer}
      />

      {/* Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default TrainerBrowse;
