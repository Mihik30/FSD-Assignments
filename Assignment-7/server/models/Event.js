const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    club: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Competition", "Workshop", "Conference", "Demo Day", "Institute Event", "Technical Event", "Project Milestone", "Hackathon", "Technical Camp", "Cultural Fest"],
      required: true
    },
    date: { type: Date, required: true },
    sourceType: { type: String, enum: ["official", "synthetic"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
