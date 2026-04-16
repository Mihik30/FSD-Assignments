const express = require("express");
const {
  renderHome,
  renderPackages,
  renderPackageDetails,
  renderContact,
  submitInquiry
} = require("../controllers/siteController");

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", asyncHandler(renderHome));
router.get("/packages", asyncHandler(renderPackages));
router.get("/packages/:id", asyncHandler(renderPackageDetails));
router.get("/contact", asyncHandler(renderContact));
router.post("/contact", asyncHandler(submitInquiry));

module.exports = router;
