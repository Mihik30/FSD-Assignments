const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travel_agency_db";

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = connectDB;
