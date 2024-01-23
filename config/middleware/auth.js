// config/middleware/auth.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Jika rute adalah rute pendaftaran, lanjutkan ke middleware berikutnya tanpa memeriksa token
  if (req.path === "/auth/register") {
    return next();
  }

  const token = req.header("journality"); // Menggunakan header "journality"
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access denied. Token not provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Invalid token." });

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
