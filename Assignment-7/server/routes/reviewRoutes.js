const express = require("express");
const {
  createReview,
  getReviews,
  deleteReview,
  getReviewStats
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);
router.get("/", getReviews);
router.get("/stats", getReviewStats);
router.delete("/:id", deleteReview);

module.exports = router;
