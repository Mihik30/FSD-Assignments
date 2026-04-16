const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    isOfficial: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
