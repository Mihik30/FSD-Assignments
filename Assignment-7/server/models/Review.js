const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    eventTitle: { type: String, required: true, trim: true },
    clubName: { type: String, required: true, trim: true },
    reviewerName: { type: String, default: "Anonymous", trim: true },
    studentYear: { type: String, enum: ["FY", "SY", "TY", "Final Year", "PG", "Other"], default: "Other" },
    department: { type: String, default: "", trim: true },
    ratings: {
      overall: { type: Number, required: true, min: 1, max: 5 },
      contentQuality: { type: Number, required: true, min: 1, max: 5 },
      organization: { type: Number, required: true, min: 1, max: 5 },
      engagement: { type: Number, required: true, min: 1, max: 5 }
    },
    wouldRecommend: { type: Boolean, required: true },
    comment: { type: String, required: true, trim: true, minlength: 10, maxlength: 700 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
