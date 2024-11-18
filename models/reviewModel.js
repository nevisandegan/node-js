const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: { type: String, required: [true, "poresh kon"] },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "inam poresh kon"],
  },
  createdAt: { type: Date, default: Date.now },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
