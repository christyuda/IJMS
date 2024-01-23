// src/routes/jurnalRoutes.js
const express = require("express");
const router = express.Router();
const jurnalController = require("../controllers/jurnalController");

// Middleware otentikasi token
const authenticateToken = require("../../config/middleware/auth");

// Routes
router.get("/", authenticateToken, jurnalController.getAllJurnals);
router.get("/:id", authenticateToken, jurnalController.getJurnalById);
router.post("/", authenticateToken, jurnalController.createJurnal);
router.put("/:id", authenticateToken, jurnalController.updateJurnal);
router.delete("/:id", authenticateToken, jurnalController.deleteJurnal);

module.exports = router;
