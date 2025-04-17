const express = require("express");
const jwt = require("jsonwebtoken");
const { getCart, addToCart, updateQuantity, removeItem } = require("../controllers/cart.controller");

const router = express.Router();

// Middleware to verify token
function authToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
}

// Get cart items
router.get("/", authToken, getCart);

// Add item to cart
router.post("/add", authToken, addToCart);

// Update item quantity
router.put("/update/:productId", authToken, updateQuantity);

// Remove item from cart
router.delete("/remove/:productId", authToken, removeItem);


module.exports = router;
