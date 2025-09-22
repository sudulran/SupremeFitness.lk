const Review = require("../models/reviewModel");
const Trainer = require("../models/trainerModel");

exports.addReview = async (req, res) => {
  try {
    const { trainerId, rating, comment } = req.body;
    const review = new Review({ user: req.user._id, trainer: trainerId, rating, comment });
    await review.save();

    // Update average rating
    const reviews = await Review.find({ trainer: trainerId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Trainer.findByIdAndUpdate(trainerId, { averageRating: avgRating });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
