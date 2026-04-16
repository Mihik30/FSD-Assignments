const express = require("express");
const {
  renderHome,
  renderProducts,
  renderProductDetails,
  addToCart,
  updateCartItem,
  renderCart,
  renderCheckout,
  submitCheckout,
  renderOrderSuccess
} = require("../controllers/storeController");

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", asyncHandler(renderHome));
router.get("/products", asyncHandler(renderProducts));
router.get("/products/:slug", asyncHandler(renderProductDetails));
router.post("/cart/add/:id", asyncHandler(addToCart));
router.post("/cart/update/:id", asyncHandler(updateCartItem));
router.get("/cart", asyncHandler(renderCart));
router.get("/checkout", asyncHandler(renderCheckout));
router.post("/checkout", asyncHandler(submitCheckout));
router.get("/order-success/:id", asyncHandler(renderOrderSuccess));

module.exports = router;
