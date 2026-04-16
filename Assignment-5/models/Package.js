const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    tags: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    availableSlots: {
      type: Number,
      default: 20,
      min: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
