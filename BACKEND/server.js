// Server File
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const productRoutes = require('./routes/productRoute');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoute');
const trainerRoutes = require('./routes/trainerRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const workoutPlanRoutes = require('./routes/WorkoutPlanRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const foodRoutes = require('./routes/foodRoutes');
const progressRoutes = require('./routes/progressRoutes');
const aiPlanRoutes = require('./routes/aiPlanRoutes');

// Import the connectDB function from db.js
const connectDB = require('./configs/db');

dotenv.config();

connectDB(); // Connect to MongoDB using the connectDB function from db.js

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes); // Use the Auth Routes
app.use('/api/products', productRoutes); // Use the product routes
app.use('/api/cart', cartRoutes); // Use the Cart routes
app.use('/api/payment', paymentRoutes); // Use the Payment routes
app.use('/api/trainers', trainerRoutes); // Use the Trainer routes
app.use('/api/timeslots', timeSlotRoutes); // Use the TimeSlot routes
app.use('/api/bookings', bookingRoutes); // Use the Booking routes
app.use('/api/reviews', reviewRoutes); // Use the Review routes
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai-plans', aiPlanRoutes);

// Server Run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
