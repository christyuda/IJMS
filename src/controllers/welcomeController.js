const getWelcomePage = (req, res) => {
  res.status(200).json({ message: "Welcome to IJMS Backend!" });
};

module.exports = {
  getWelcomePage,
};
