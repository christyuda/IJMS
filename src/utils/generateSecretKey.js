// config/utils/generateSecretKey.js
const crypto = require("crypto");

// Fungsi untuk menghasilkan secret key secara acak
const generateRandomSecretKey = () => {
  const keySize = 32;
  const buffer = crypto.randomBytes(keySize);
  const secretKey = buffer.toString("hex");

  return secretKey;
};

module.exports = generateRandomSecretKey;
