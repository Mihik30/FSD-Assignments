const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    monthlyPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },
    items: { type: [orderItemSchema], required: true },
    totalMonthly: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["requested", "processing", "completed"],
      default: "requested"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
