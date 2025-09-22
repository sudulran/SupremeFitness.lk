const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const {
  getAllTrainers,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/trainerController");

const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

// Multer config for profileImage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// User routes
router.get("/", getAllTrainers);
router.post("/review", authMiddleware, addReview);
router.put("/review/:trainerId/:reviewId", authMiddleware, updateReview);
router.delete("/review/:trainerId/:reviewId", authMiddleware, deleteReview);

// Admin routes
router.post("/", authMiddleware, isAdmin, upload.single("profileImage"), addTrainer);
router.put("/:id", authMiddleware, isAdmin, upload.single("profileImage"), updateTrainer);
router.delete("/:id", authMiddleware, isAdmin, deleteTrainer);

module.exports = router;
