const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    provider: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["local", "api", "bundle"],
      required: true
    },
    modelFamily: { type: String, required: true, trim: true },
    priceMonthly: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    inStock: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    badges: { type: [String], default: [] },
    image: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    highlights: { type: [String], default: [] },
    releasePeriod: { type: String, required: true, trim: true },
    contextWindow: { type: String, required: true, trim: true },
    modalities: { type: [String], default: [] },
    bestFor: { type: [String], default: [] },
    latencyTier: { type: String, required: true, trim: true },
    deploymentType: { type: String, required: true, trim: true },
    pricingNote: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
