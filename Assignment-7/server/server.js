const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const clubRoutes = require("./routes/clubRoutes");
const eventRoutes = require("./routes/eventRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "assignment-7-api" });
});

app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error.message);
  res.status(500).json({ message: "Something went wrong on server." });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Assignment-7 API running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
