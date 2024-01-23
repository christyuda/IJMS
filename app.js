// app.js or index.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database/db");
const authenticateToken = require("./config/middleware/auth");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authenticateToken);

// Routes Jurnal
const jurnalRoutes = require("./src/routes/jurnalRoutes");
app.use("/jurnal", jurnalRoutes);
// Routes Auth
const authRoutes = require("./src/routes/authRoutes");
app.use("/auth", authRoutes);

// Routes Welcome
const welcomeRoutes = require("./src/routes/welcomeRoutes");
app.use("/welcome", welcomeRoutes);
// Handle 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

// Koneksi ke MongoDB
connectDB();
