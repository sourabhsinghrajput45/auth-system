module.exports = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  req.accessToken = accessToken;
  next();
};
