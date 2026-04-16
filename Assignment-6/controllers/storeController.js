const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

function buildCatalogQuery(search, category) {
  const query = { inStock: true };

  if (category && ["local", "api", "bundle"].includes(category)) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { provider: { $regex: search, $options: "i" } },
      { modelFamily: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }

  return query;
}

function getSortOptions(sort) {
  if (sort === "price-asc") {
    return { priceMonthly: 1 };
  }

  if (sort === "price-desc") {
    return { priceMonthly: -1 };
  }

  if (sort === "rating") {
    return { rating: -1, priceMonthly: 1 };
  }

  return { featured: -1, rating: -1, priceMonthly: 1 };
}

async function getCartDetails(req) {
  const cartItems = req.session.cart || [];
  if (cartItems.length === 0) {
    return { items: [], totalMonthly: 0 };
  }

  const ids = cartItems
    .map((item) => item.productId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  const products = await Product.find({ _id: { $in: ids } }).lean();
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const items = [];
  let totalMonthly = 0;

  for (const cartItem of cartItems) {
    const product = productMap.get(String(cartItem.productId));
    if (!product) {
      continue;
    }

    const quantity = Math.max(1, Number(cartItem.quantity) || 1);
    const itemTotal = product.priceMonthly * quantity;
    totalMonthly += itemTotal;

    items.push({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      category: product.category,
      provider: product.provider,
      priceMonthly: product.priceMonthly,
      quantity,
      itemTotal
    });
  }

  return { items, totalMonthly };
}

async function renderHome(req, res) {
  const [featuredProducts, totalProducts, providers, localCount, apiCount, bundleCount] = await Promise.all([
    Product.find({ featured: true, inStock: true }).sort({ rating: -1 }).limit(8).lean(),
    Product.countDocuments({ inStock: true }),
    Product.distinct("provider", { inStock: true }),
    Product.countDocuments({ inStock: true, category: "local" }),
    Product.countDocuments({ inStock: true, category: "api" }),
    Product.countDocuments({ inStock: true, category: "bundle" })
  ]);

  res.render("home", {
    title: "AI Commerce Hub | Ecommerce for AI Models",
    featuredProducts,
    stats: {
      totalProducts,
      totalProviders: providers.length,
      localCount,
      apiCount,
      bundleCount
    }
  });
}

async function renderProducts(req, res) {
  const search = (req.query.search || "").trim();
  const category = (req.query.category || "all").trim();
  const sort = (req.query.sort || "featured").trim();

  const query = buildCatalogQuery(search, category === "all" ? "" : category);
  const products = await Product.find(query).sort(getSortOptions(sort)).lean();

  res.render("products", {
    title: "Model Catalog | AI Commerce Hub",
    products,
    filters: { search, category, sort },
    resultCount: products.length
  });
}

async function renderProductDetails(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, inStock: true }).lean();

  if (!product) {
    return res.status(404).render("error", {
      title: "Product Not Found",
      message: "This model is not available in the catalog.",
      actionText: "Browse Catalog",
      actionHref: "/products"
    });
  }

  const relatedProducts = await Product.find({
    inStock: true,
    _id: { $ne: product._id },
    category: product.category
  })
    .sort({ rating: -1 })
    .limit(3)
    .lean();

  return res.render("product-details", {
    title: `${product.name} | AI Commerce Hub`,
    product,
    relatedProducts
  });
}

async function addToCart(req, res) {
  const productId = req.params.id;
  const quantity = Math.max(1, Number(req.body.quantity) || 1);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.redirect("/products");
  }

  const product = await Product.findOne({ _id: productId, inStock: true }).lean();
  if (!product) {
    return res.redirect("/products");
  }

  const currentCart = req.session.cart || [];
  const existingIndex = currentCart.findIndex((item) => String(item.productId) === String(productId));

  if (existingIndex >= 0) {
    currentCart[existingIndex].quantity += quantity;
  } else {
    currentCart.push({ productId, quantity });
  }

  req.session.cart = currentCart;

  const backTo = req.body.redirectTo || "/cart";
  return res.redirect(backTo);
}

async function updateCartItem(req, res) {
  const productId = req.params.id;
  const action = req.body.action;

  const currentCart = req.session.cart || [];
  const index = currentCart.findIndex((item) => String(item.productId) === String(productId));

  if (index >= 0) {
    if (action === "remove") {
      currentCart.splice(index, 1);
    } else if (action === "decrease") {
      currentCart[index].quantity = Math.max(1, currentCart[index].quantity - 1);
    } else {
      currentCart[index].quantity += 1;
    }
  }

  req.session.cart = currentCart;
  return res.redirect("/cart");
}

async function renderCart(req, res) {
  const cart = await getCartDetails(req);

  return res.render("cart", {
    title: "Your Cart | AI Commerce Hub",
    cart
  });
}

async function renderCheckout(req, res) {
  const cart = await getCartDetails(req);

  if (cart.items.length === 0) {
    return res.redirect("/products");
  }

  return res.render("checkout", {
    title: "Checkout | AI Commerce Hub",
    cart,
    errors: [],
    formData: {}
  });
}

function validateCheckout(formData) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.customerName || formData.customerName.trim().length < 2) {
    errors.push("Enter a valid full name.");
  }

  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.push("Enter a valid email address.");
  }

  return errors;
}

async function submitCheckout(req, res) {
  const cart = await getCartDetails(req);
  if (cart.items.length === 0) {
    return res.redirect("/products");
  }

  const formData = {
    customerName: req.body.customerName || "",
    email: req.body.email || "",
    company: req.body.company || "",
    notes: req.body.notes || ""
  };

  const errors = validateCheckout(formData);
  if (errors.length > 0) {
    return res.status(400).render("checkout", {
      title: "Checkout | AI Commerce Hub",
      cart,
      errors,
      formData
    });
  }

  const order = await Order.create({
    customerName: formData.customerName,
    email: formData.email,
    company: formData.company,
    notes: formData.notes,
    items: cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      category: item.category,
      monthlyPrice: item.priceMonthly,
      quantity: item.quantity
    })),
    totalMonthly: cart.totalMonthly
  });

  req.session.cart = [];
  return res.redirect(`/order-success/${order._id}`);
}

async function renderOrderSuccess(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.redirect("/");
  }

  const order = await Order.findById(req.params.id).lean();
  if (!order) {
    return res.redirect("/");
  }

  return res.render("order-success", {
    title: "Order Request Submitted | AI Commerce Hub",
    order
  });
}

module.exports = {
  renderHome,
  renderProducts,
  renderProductDetails,
  addToCart,
  updateCartItem,
  renderCart,
  renderCheckout,
  submitCheckout,
  renderOrderSuccess
};
