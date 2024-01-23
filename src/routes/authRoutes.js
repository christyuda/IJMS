// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register user
router.post("/register", authController.registerUser);

// Login user
router.post("/login", authController.loginUser);

// Authenticated routes
router.use(require("../../config/middleware/auth"));
router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getUserById);
router.put("/users/:id", authController.updateUser);
router.delete("/users/:id", authController.deleteUser);

module.exports = router;
