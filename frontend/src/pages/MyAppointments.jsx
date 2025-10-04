import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Stack,
  Paper,
  Divider,
  Badge,
  Container,
  alpha,
  Zoom,
  Fade,
  Tooltip,
  ListItemAvatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  DeleteOutline as DeleteOutlineIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  FitnessCenter as FitnessCenterIcon,
  Star as StarIcon,
  Alarm as AlarmIcon,
  EventNote as EventNoteIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

import axiosInstance from '../api/axiosInstance';
import Footer from '../components/Footer';

// AppointmentCard with edit and delete - SMALLER VERSION
function AppointmentCard({ appointment, onDelete, onEdit, index }) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await onDelete(appointment._id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusDetails = (status) => {
    const statusMap = {
      pending: {
        color: '#ff9800',
        bgColor: alpha('#ff9800', 0.1),
        icon: <PendingIcon fontSize="small" />,
        label: 'Pending',
      },
      confirmed: {
        color: '#4caf50',
        bgColor: alpha('#4caf50', 0.1),
        icon: <CheckCircleIcon fontSize="small" />,
        label: 'Confirmed',
      },
      cancelled: {
        color: '#f44336',
        bgColor: alpha('#f44336', 0.1),
        icon: <CancelIcon fontSize="small" />,
        label: 'Cancelled',
      },
      completed: {
        color: '#2196f3',
        bgColor: alpha('#2196f3', 0.1),
        icon: <CheckCircleIcon fontSize="small" />,
        label: 'Completed',
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  // FIXED: Proper date handling without timezone shifting
  const getAppointmentDate = (dateString) => {
    if (!dateString) return null;
    
    // Parse the date string directly without timezone adjustments
    const date = new Date(dateString);
    
    // If the date is invalid, return null
    if (isNaN(date.getTime())) return null;
    
    return date;
  };

  const appointmentDate = getAppointmentDate(appointment.date);
  const statusDetails = getStatusDetails(appointment.status);
  const isUpcoming = appointmentDate && appointmentDate > new Date();

  return (
    <Zoom in={true} timeout={300 + index * 100}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
          border: '1px solid',
          borderColor: alpha('#1976d2', 0.12),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'visible',
          height: '100%',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)',
            transform: 'translateY(-4px)',
            borderColor: 'primary.main',
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${statusDetails.color}, ${alpha(statusDetails.color, 0.7)})`,
            borderRadius: '12px 12px 0 0',
          },
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header with Trainer and Status */}
          <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                fontSize: '1.2rem',
                fontWeight: 600,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              }}
            >
              {appointment.trainerId?.name?.[0] || 'T'}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 0.5,
                  fontSize: '1rem',
                  lineHeight: 1.2,
                }}
              >
                {appointment.trainerId?.name || 'Unknown Trainer'}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip
                  icon={statusDetails.icon}
                  label={statusDetails.label}
                  size="small"
                  sx={{
                    bgcolor: statusDetails.bgColor,
                    color: statusDetails.color,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    border: `1px solid ${alpha(statusDetails.color, 0.3)}`,
                    '& .MuiChip-icon': { 
                      color: statusDetails.color,
                      fontSize: '16px'
                    },
                  }}
                />
                {isUpcoming && (
                  <Chip
                    icon={<AlarmIcon />}
                    label="Upcoming"
                    size="small"
                    sx={{
                      bgcolor: alpha('#ff9800', 0.1),
                      color: '#ff9800',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 24,
                      border: `1px solid ${alpha('#ff9800', 0.3)}`,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.7 },
                        '100%': { opacity: 1 },
                      },
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Compact Details */}
          <Stack spacing={1.5}>
            {/* Trainer Specialization & Experience */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <FitnessCenterIcon color="primary" sx={{ fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {appointment.trainerId?.specialization || 'General Training'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <StarIcon color="warning" sx={{ fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {appointment.trainerId?.experience ?? 'N/A'} yrs exp
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            {/* Date & Time */}
            <Box>
              <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                <CalendarTodayIcon color="primary" sx={{ fontSize: 14 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Date
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight={600} color="primary.dark" sx={{ lineHeight: 1.2 }}>
                {appointmentDate
                  ? appointmentDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Date N/A'}
              </Typography>
            </Box>

            {appointment.slotId && (
              <Box>
                <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                  <AccessTimeIcon color="primary" sx={{ fontSize: 14 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Time
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={600} color="primary.dark" sx={{ lineHeight: 1.2 }}>
                  {appointment.slotId.startTime} - {appointment.slotId.endTime}
                </Typography>
              </Box>
            )}

            {/* Add 1 Day Duration */}
            <Box>
              <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                <ScheduleIcon color="primary" sx={{ fontSize: 14 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Duration
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight={600} color="primary.dark" sx={{ lineHeight: 1.2 }}>
                1 Day
              </Typography>
            </Box>

            {/* Contact Information - Compact */}
            {(appointment.contactNumber || appointment.email || appointment.clientName) && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom>
                    Contact Info
                  </Typography>
                  <Stack spacing={0.5}>
                    {appointment.clientName && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PersonIcon color="success" sx={{ fontSize: 14 }} />
                        <Typography variant="caption" fontWeight={500}>
                          {appointment.clientName}
                        </Typography>
                      </Stack>
                    )}
                    {appointment.contactNumber && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PhoneIcon color="success" sx={{ fontSize: 14 }} />
                        <Typography variant="caption" fontWeight={500}>
                          {appointment.contactNumber}
                        </Typography>
                      </Stack>
                    )}
                    {appointment.email && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <EmailIcon color="success" sx={{ fontSize: 14 }} />
                        <Typography variant="caption" fontWeight={500} sx={{ 
                          wordBreak: 'break-all',
                          fontSize: '0.7rem'
                        }}>
                          {appointment.email}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
          <Tooltip title="Edit Appointment">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              onClick={() => onEdit(appointment)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                },
              }}
            >
              Edit
            </Button>
          </Tooltip>

          <Tooltip title="Delete Appointment">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={deleteLoading ? <CircularProgress size={12} /> : <DeleteOutlineIcon sx={{ fontSize: 16 }} />}
              disabled={deleteLoading}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this appointment?')) {
                  handleDelete();
                }
              }}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                borderWidth: 1.5,
                '&:hover': {
                  borderWidth: 1.5,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
                },
              }}
            >
              {deleteLoading ? '...' : 'Delete'}
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    </Zoom>
  );
}

// Loading skeleton for card - SMALLER VERSION
function AppointmentSkeleton({ index }) {
  return (
    <Zoom in={true} timeout={300 + index * 100}>
      <Card sx={{ borderRadius: 3, p: 2, height: '100%' }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Box sx={{ width: 48, height: 48 }}>
            <CircularProgress size={20} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ height: 20, width: '70%', backgroundColor: '#eee', mb: 1, borderRadius: 1 }} />
            <Box sx={{ height: 16, width: '50%', backgroundColor: '#eee', borderRadius: 1 }} />
          </Box>
        </Stack>
        <Box sx={{ height: 80, backgroundColor: '#eee', borderRadius: 2, mb: 1.5 }} />
        <Box sx={{ height: 16, width: '80%', backgroundColor: '#eee', mb: 0.5, borderRadius: 1 }} />
        <Box sx={{ height: 16, width: '60%', backgroundColor: '#eee', borderRadius: 1 }} />
      </Card>
    </Zoom>
  );
}

// Enhanced EditAppointmentDialog with contact number, username, and email fields
function EditAppointmentDialog({ open, onClose, appointment, onUpdated }) {
  const [form, setForm] = useState({
    date: '',
    slotId: '',
    contactNumber: '',
    email: '',
    clientName: '',
    ...appointment
  });
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (appointment) {
      if (appointment.status !== 'pending') {
        alert('Only pending appointments can be edited.');
        onClose();
        return;
      }
      
      // Get user data from localStorage for fallback
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      
      // Format date for input field (YYYY-MM-DD) and include contact info
      const formattedAppointment = {
        ...appointment,
        date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
        contactNumber: appointment.contactNumber || parsedUser.contactNumber || '',
        email: appointment.email || parsedUser.email || '',
        clientName: appointment.clientName || parsedUser.name || ''
      };
      
      setForm(formattedAppointment);
      console.log('Editing appointment:', formattedAppointment);
      
      // Fetch slots
      if (appointment.trainerId?._id) {
        fetchSlots(appointment.trainerId._id);
      }
    }
  }, [appointment]);

  const fetchSlots = async (trainerId) => {
    setLoadingSlots(true);
    try {
      const res = await axiosInstance.get(`/timeslots/${trainerId}`);
      setSlots(res.data || []);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSave = async () => {
    if (!form._id) return;
    setUpdating(true);

    try {
      const payload = {
        slotId: form.slotId?._id || form.slotId,
        date: form.date,
        contactNumber: form.contactNumber,
        email: form.email,
        //clientName: form.clientName,
      };

      console.log('Sending update payload:', payload);

      const response = await axiosInstance.put(`/bookings/reschedule/${form._id}`, payload);
      
      console.log('Update response:', response.data);

      // Transform the response to match frontend structure
      const updatedAppointment = {
        ...response.data.booking,
        // Flatten the clientContact for frontend use
        contactNumber: response.data.booking.clientContact?.phone || form.contactNumber,
        email: response.data.booking.clientContact?.email || form.email,
        // Ensure slotId is preserved
        slotId: form.slotId || response.data.booking.slotId,
      };

      onUpdated(updatedAppointment);
      
      // Show success message
      alert('Appointment updated successfully!');

    } catch (err) {
      console.error('Update failed:', err);
      console.error('Error details:', err.response?.data);
      alert(`Failed to update the appointment: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Validate email format
  const isValidEmail = (email) => {
    if (!email) return true; // Empty email is allowed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number format
  const isValidPhone = (phone) => {
    if (!phone) return true; // Empty phone is allowed
    
    // Remove all spaces, hyphens, and parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if phone starts with 0 and has exactly 10 digits
    const phoneRegex = /^0\d{9}$/;
    
    return phoneRegex.test(cleanPhone);
  };

  const isFormValid = form.date && form.slotId && 
    isValidEmail(form.email) && 
    isValidPhone(form.contactNumber) &&
    form.clientName;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Edit Appointment
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Current Booking Details - Left Side */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'primary.main' }}>
              Current Booking Details
            </Typography>
            
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Stack spacing={2}>
                {/* Trainer Info */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Trainer
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        fontSize: '1rem',
                      }}
                    >
                      {appointment?.trainerId?.name?.[0] || 'T'}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {appointment?.trainerId?.name || 'Unknown Trainer'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointment?.trainerId?.specialization || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Current Date & Time */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Date & Time
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayIcon color="primary" fontSize="small" />
                      <Typography variant="body1" fontWeight={600}>
                        {formatDisplayDate(appointment?.date)}
                      </Typography>
                    </Stack>
                    {appointment?.slotId && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon color="primary" fontSize="small" />
                        <Typography variant="body1" fontWeight={600}>
                          {appointment.slotId.day} • {appointment.slotId.startTime} - {appointment.slotId.endTime}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                <Divider />

                {/* Current Contact Information */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Contact Information
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Name: {appointment?.clientName || 'Not provided'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Phone: {appointment?.contactNumber || 'Not provided'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Email: {appointment?.email || 'Not provided'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                {/* Status & Client Info */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status & Client
                  </Typography>
                  <Stack spacing={1}>
                    <Chip
                      label={appointment?.status?.toUpperCase() || 'PENDING'}
                      color={
                        appointment?.status === 'confirmed' ? 'success' :
                        appointment?.status === 'cancelled' ? 'error' :
                        appointment?.status === 'completed' ? 'info' : 'warning'
                      }
                      size="small"
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {appointment?.clientName || 'N/A'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Edit Form - Right Side */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'primary.main' }}>
              Update Appointment Details
            </Typography>
            
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Stack spacing={3}>
                {/* Date Selection */}
                <TextField
                  label="Select New Date"
                  type="date"
                  fullWidth
                  value={form.date || ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputProps: { 
                      min: new Date().toISOString().split('T')[0] // Prevent past dates
                    }
                  }}
                />

                {/* Time Slot Selection */}
                <FormControl fullWidth disabled={loadingSlots}>
                  <InputLabel>Select New Time Slot</InputLabel>
                  <Select
                    value={form.slotId?._id || form.slotId || ''}
                    label="Select New Time Slot"
                    onChange={(e) => {
                      const selected = slots.find((s) => s._id === e.target.value);
                      setForm((prev) => ({ ...prev, slotId: selected }));
                    }}
                  >
                    {slots.map((slot) => (
                      <MenuItem key={slot._id} value={slot._id}>
                        {slot.day} • {slot.startTime} - {slot.endTime}
                        {slot.isBooked && (
                          <Chip label="Booked" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Username Field */}
                <TextField
                  label="Username"
                  fullWidth
                  value={form.clientName || ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, clientName: e.target.value }))
                  }
                  placeholder="Enter your name"
                  disabled  
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                  }}
                />

                {/* Contact Number */}
                <TextField
                  label="Contact Number"
                  type="tel"
                  fullWidth
                  value={form.contactNumber || ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contactNumber: e.target.value }))
                  }
                  placeholder="Enter your phone number"
                  error={!isValidPhone(form.contactNumber)}
                  helperText={!isValidPhone(form.contactNumber) ? "Please enter a valid phone number (0XXXXXXXXX)" : ""}
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                  }}
                />

                {/* Email */}
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={form.email || ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email address"
                  error={!isValidEmail(form.email)}
                  helperText={!isValidEmail(form.email) ? "Please enter a valid email address" : ""}
                  InputProps={{
                    startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                  }}
                />

                {loadingSlots && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Update Summary */}
            {(form.date || form.slotId || form.contactNumber || form.email || form.clientName) && (
              <Paper elevation={1} sx={{ p: 2, mt: 2, borderRadius: 2, bgcolor: 'success.light', color: 'white' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Update Summary:
                </Typography>
                <Stack spacing={0.5}>
                  {form.clientName && (
                    <Typography variant="body2">
                      👤 Name: {form.clientName}
                    </Typography>
                  )}
                  {form.date && (
                    <Typography variant="body2">
                      📅 Date: {formatDisplayDate(form.date)}
                    </Typography>
                  )}
                  {form.slotId && (
                    <Typography variant="body2">
                      ⏰ Time: {form.slotId.day} • {form.slotId.startTime} - {form.slotId.endTime}
                    </Typography>
                  )}
                  {form.contactNumber && (
                    <Typography variant="body2">
                      📞 Phone: {form.contactNumber}
                    </Typography>
                  )}
                  {form.email && (
                    <Typography variant="body2">
                      ✉️ Email: {form.email}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updating || loadingSlots || !isFormValid}
          sx={{ borderRadius: 2 }}
        >
          {updating ? <CircularProgress size={18} /> : 'Update Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Notification System Component
function NotificationSystem({ appointments }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Check for upcoming notifications
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const newNotifications = [];

      appointments.forEach(appointment => {
        if (!appointment.date || appointment.status === 'cancelled' || appointment.status === 'completed') {
          return;
        }

        const appointmentDate = new Date(appointment.date);
        if (isNaN(appointmentDate.getTime())) return;

        // Set time for the appointment
        if (appointment.slotId?.startTime) {
          const [hours, minutes] = appointment.slotId.startTime.split(':');
          appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        }

        // Calculate time differences
        const timeDiff = appointmentDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));

        // Check for 1-day before notification
        if (daysDiff === 1 && timeDiff > 0) {
          newNotifications.push({
            id: `${appointment._id}-day-before`,
            type: 'day_before',
            appointment,
            message: `Reminder: You have an appointment with ${appointment.trainerId?.name || 'your trainer'} tomorrow at ${appointment.slotId?.startTime || 'scheduled time'}`,
            timestamp: now
          });
        }

        // Check for 1-hour before notification
        if (hoursDiff === 1 && timeDiff > 0) {
          newNotifications.push({
            id: `${appointment._id}-hour-before`,
            type: 'hour_before',
            appointment,
            message: `Reminder: Your appointment with ${appointment.trainerId?.name || 'your trainer'} starts in 1 hour!`,
            timestamp: now
          });
        }
      });

      // Filter out duplicates and already shown notifications
      const storedNotifications = JSON.parse(localStorage.getItem('shownNotifications') || '[]');
      const filteredNotifications = newNotifications.filter(notification => 
        !storedNotifications.includes(notification.id)
      );

      if (filteredNotifications.length > 0) {
        // Store shown notifications
        const updatedStoredNotifications = [...storedNotifications, ...filteredNotifications.map(n => n.id)];
        localStorage.setItem('shownNotifications', JSON.stringify(updatedStoredNotifications));
        
        setNotifications(prev => [...prev, ...filteredNotifications]);
        
        // Show the first notification
        setCurrentNotification(filteredNotifications[0]);
        setShowNotification(true);
      }
    };

    // Check immediately
    checkNotifications();

    // Set up interval to check every minute
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [appointments]);

  const handleCloseNotification = () => {
    setShowNotification(false);
    setCurrentNotification(null);
    
    // If there are more notifications, show the next one after a delay
    if (notifications.length > 1) {
      setTimeout(() => {
        setNotifications(prev => prev.slice(1));
        setCurrentNotification(notifications[1]);
        setShowNotification(true);
      }, 2000);
    } else {
      setNotifications([]);
    }
  };

  return (
    <Snackbar
      open={showNotification}
      autoHideDuration={6000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          borderRadius: 3,
          minWidth: 300,
        },
      }}
    >
      <Alert
        onClose={handleCloseNotification}
        severity="info"
        sx={{
          width: '100%',
          bgcolor: 'transparent',
          color: 'white',
          '& .MuiAlert-icon': { color: 'white' },
        }}
        icon={<AlarmIcon />}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          🎯 Appointment Reminder
        </Typography>
        <Typography variant="body2">
          {currentNotification?.message}
        </Typography>
        {currentNotification?.appointment && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={currentNotification.appointment.trainerId?.specialization || 'Training'}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '0.7rem',
              }}
            />
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
}

// The main MyAppointments component
function MyAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
  }, []);

  const fetchAppointments = async () => {
    if (!user?.name) {
      setLoading(false);
      setAppointments([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/bookings');
      
      // Enhanced filtering - check both original and updated client names
      const filtered = res.data.filter((b) => 
        b.clientName === user.name || 
        (b.originalClientName === user.name) ||
        (b.userId && b.userId.name === user.name)
      );
      
      // Enhance appointments with user contact information
      const enhancedAppointments = filtered.map(appointment => ({
        ...appointment,
        // Flatten clientContact for frontend use
        contactNumber: appointment.clientContact?.phone || user.contactNumber || '',
        email: appointment.clientContact?.email || user.email || '',
        clientName: appointment.clientName || user.name || '',
        // Keep original client name for filtering
        originalClientName: user.name
      }));
      
      console.log('Fetched appointments:', enhancedAppointments);
      setAppointments(enhancedAppointments);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleDelete = async (bookingId) => {
    try {
      await axiosInstance.delete(`/bookings/${bookingId}`);
      setAppointments((prev) => prev.filter((a) => a._id !== bookingId));
    } catch (err) {
      console.error('Delete error', err);
      throw err;
    }
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    setEditDialogOpen(true);
  };

  const handleUpdated = (updatedAppt) => {
    console.log('Appointment updated:', updatedAppt);
    
    // Update the appointment in state without removing it
    setAppointments((prev) =>
      prev.map((a) => 
        a._id === updatedAppt._id ? { ...a, ...updatedAppt } : a
      )
    );
    
    // Close the dialog
    setEditDialogOpen(false);
    
    // Show success message without reloading
    alert('Appointment updated successfully!');
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter((appt) => {
      if (!appt.date || !appt.slotId?.startTime) return false;
      
      // Create appointment datetime properly
      const appointmentDate = new Date(appt.date);
      if (isNaN(appointmentDate.getTime())) return false;
      
      const [hours, minutes] = appt.slotId.startTime.split(':');
      appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      // Check if it's the same date
      const isSameDate = appointmentDate.toDateString() === now.toDateString();
      
      // Check if it's within the next hour
      const diff = appointmentDate.getTime() - now.getTime();
      return isSameDate && diff > 0 && diff <= 60 * 60 * 1000; // Same date and within next hour
    });
  };

  const upcomingAppointments = getUpcomingAppointments();
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
  const upcomingCount = appointments.filter((a) => {
    if (!a.date) return false;
    const appointmentDate = new Date(a.date);
    if (isNaN(appointmentDate.getTime())) return false;
    return appointmentDate > new Date() && a.status !== 'cancelled';
  }).length;

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 300,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.1,
            zIndex: 0,
          }}
        />

        {/* Notification System */}
        <NotificationSystem appointments={appointments} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          <Fade in timeout={600}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  mb: 2,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5, #1e88e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textAlign: 'center',
                }}
              >
                📅 My Fitness Journey
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 4, maxWidth: 600, mx: 'auto' }}
              >
                Track your appointments, monitor progress, and stay on top of your fitness schedule
              </Typography>

              {!loading && totalAppointments > 0 && (
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #4caf50, #81c784)',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-2px)' },
                      }}
                    >
                      <EventNoteIcon sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h5" fontWeight={700}>
                        {totalAppointments}
                      </Typography>
                      <Typography variant="body2">Total Sessions</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #2196f3, #64b5f6)',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-2px)' },
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h5" fontWeight={700}>
                        {completedAppointments}
                      </Typography>
                      <Typography variant="body2">Completed</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ff9800, #ffb74d)',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-2px)' },
                      }}
                    >
                      <ScheduleIcon sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h5" fontWeight={700}>
                        {upcomingCount}
                      </Typography>
                      <Typography variant="body2">Upcoming</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Fade>

          {loading && (
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <AppointmentSkeleton index={i} />
                </Grid>
              ))}
            </Grid>
          )}

          {error && (
            <Fade in>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: alpha('#f44336', 0.04),
                  border: '1px solid',
                  borderColor: alpha('#f44336', 0.2),
                  borderRadius: 3,
                }}
              >
                <Typography color="error" variant="h6" gutterBottom>
                  ❌ Oops! Something went wrong
                </Typography>
                <Typography color="text.secondary">{error}</Typography>
                <Button 
                  onClick={fetchAppointments} 
                  variant="contained" 
                  sx={{ mt: 2 }}
                >
                  Try Again
                </Button>
              </Paper>
            </Fade>
          )}

          {!loading && !error && appointments.length === 0 && (
            <Fade in>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: alpha('#2196f3', 0.04),
                  border: '1px solid',
                  borderColor: alpha('#2196f3', 0.2),
                  borderRadius: 3,
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  🌟 Start Your Fitness Journey!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, fontSize: '1rem' }}>
                  You haven't booked any appointments yet. Ready to take the first step?
                </Typography>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                    },
                  }}
                >
                  Book Your First Session
                </Button>
              </Paper>
            </Fade>
          )}

          {!loading && !error && appointments.length > 0 && (
            <Grid container spacing={2}>
              {appointments.map((appointment, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={appointment._id}>
                  <AppointmentCard
                    appointment={appointment}
                    onDelete={handleDelete}
                    onEdit={handleEditClick}
                    index={index}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {(upcomingAppointments.length > 0) && (
            <Tooltip title="View Upcoming Notifications" arrow>
              <Badge badgeContent={upcomingAppointments.length} color="error">
                <Fab
                  color="primary"
                  sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1300,
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                    width: 56,
                    height: 56,
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.5)',
                    },
                  }}
                >
                  <NotificationsIcon />
                </Fab>
              </Badge>
            </Tooltip>
          )}
        </Container>

        {/* Edit Appointment Dialog */}
        <EditAppointmentDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          appointment={editingAppointment}
          onUpdated={handleUpdated}
        />
      </Box>
      <Footer />
    </>
  );
}

export default MyAppointments;