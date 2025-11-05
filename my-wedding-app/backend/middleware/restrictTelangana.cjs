module.exports = (req, res, next) => {
  const { address } = req.body;
  if (!address?.toLowerCase().includes("telangana")) {
    return res.status(403).json({ message: "Service only available in Telangana." });
  }
  next();
};
