const path = require("path");
const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const storeRoutes = require("./routes/storeRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;

connectDB().catch(() => {
  process.exit(1);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }

  const count = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.cartCount = count;
  res.locals.currentPath = req.path;
  res.locals.formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value || 0);
  next();
});

app.use("/", storeRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "This page does not exist in AI Commerce Hub.",
    actionText: "Go to Home",
    actionHref: "/"
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(500).render("error", {
    title: "Something Went Wrong",
    message: "We could not process your request. Please try again.",
    actionText: "Back to Store",
    actionHref: "/products"
  });
});

app.listen(PORT, () => {
  console.log(`AI Commerce Hub running at http://localhost:${PORT}`);
});
