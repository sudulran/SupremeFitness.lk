const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoute");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const connectDB = require("./configs/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.use("/api/trainers", trainerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/appointments", require("./routes/appointmentRoutes"));

app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
