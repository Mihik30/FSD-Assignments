const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true
    },
    travelers: {
      type: Number,
      required: true,
      min: 1,
      max: 20
    },
    travelDate: {
      type: Date,
      required: true
    },
    message: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
