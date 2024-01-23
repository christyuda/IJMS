// githubRoutes.js
const express = require("express");
const router = express.Router();
const { uploadFileToGitHub } = require("../controllers/githubController");

// Define a route for file upload to GitHub
router.put("/upload", uploadFileToGitHub);

module.exports = router;
