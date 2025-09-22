import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const TrainerReviewDialog = ({
  open,
  onClose,
  reviewData = { rating: 0, comment: "" },
  setReviewData,
  onSubmit,
  editingReviewId,
}) => {
  const [notif, setNotif] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = () => {
    // Check if review is empty
    if (reviewData.rating === 0 && reviewData.comment.trim() === "") {
      setNotif({ open: true, message: "Please provide a rating or comment!", severity: "warning" });
      return;
    }

    // Call parent submit handler
    onSubmit();

    // Show success message
    setNotif({ open: true, message: editingReviewId ? "Review updated!" : "Review submitted!", severity: "success" });

    // Close dialog after short delay
    setTimeout(onClose, 500);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 1, boxShadow: 6 } }}
      >
        {/* Title */}
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem", textAlign: "center", pb: 0 }}>
          {editingReviewId ? "Edit Your Review" : "Add a Review"}
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ mt: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Rate your experience
            </Typography>
            <Rating
              size="large"
              value={reviewData.rating || 0}
              onChange={(e, val) => setReviewData({ ...reviewData, rating: val || 0 })}
            />
            <TextField
              label="Write your comment"
              placeholder="Share your feedback..."
              fullWidth
              multiline
              rows={3}
              margin="dense"
              value={reviewData.comment || ""}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ borderRadius: 2, textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ borderRadius: 2, textTransform: "none", px: 3 }}>
            {editingReviewId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notification */}
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

export default TrainerReviewDialog;
