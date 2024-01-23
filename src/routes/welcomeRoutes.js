// src/routes/welcomeRoutes.js

const express = require("express");
const router = express.Router();
const welcomeController = require("../controllers/welcomeController");

// Endpoint untuk halaman selamat datang
router.get("/", welcomeController.getWelcomePage);

module.exports = router;
