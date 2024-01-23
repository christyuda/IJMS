const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

// Register new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();

    // Generate token after successful registration
    const token = generateToken(user);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully.", token });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Bad Request. User registration failed.",
    });
  }
};

// Login user and generate JWT
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Incorrect password.",
      });
    }

    // Generate token after successful login
    const token = generateToken(user);

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Bad Request. Check your request body." });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
