const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const siteRoutes = require("./routes/siteRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch(() => {
  process.exit(1);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value || 0);
  next();
});

app.use("/", siteRoutes);

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(500).render("error", {
    title: "Something Went Wrong",
    message: "We could not process your request right now.",
    actionText: "Return Home",
    actionHref: "/"
  });
});

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The page you requested does not exist.",
    actionText: "Back to Home",
    actionHref: "/"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
