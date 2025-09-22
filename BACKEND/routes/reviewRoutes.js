const express = require("express");
const { addReview } = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addReview);

module.exports = router;
