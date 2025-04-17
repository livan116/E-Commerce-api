const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { signup, login } = require("../controllers/auth.controller");

// Signup
router.post("/signup", signup);
// Login
router.post("/login", login);

module.exports = router;
