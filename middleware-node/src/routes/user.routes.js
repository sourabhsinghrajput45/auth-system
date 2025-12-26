const express = require("express");
const router = express.Router();
const auth = require("../middleware/sessionAuth");
const quarkus = require("../services/quarkus.service");

router.get("/me", auth, async (req, res) => {
  try {
    const user = await quarkus.getMe(req.accessToken);
    res.json(user);
  } catch {
    res.status(401).json({ message: "Session expired" });
  }
});

router.post("/auth-status", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    //  no refresh token → not logged in
    if (!refreshToken) {
      return res.status(200).json({
        authenticated: false,
        emailVerified: false,
      });
    }

    //  use refresh token to check user state
    const status = await quarkus.getAuthStatusByRefresh(refreshToken);

    return res.status(200).json({
      authenticated: true,
      emailVerified: status.emailVerified,
      email: status.email,
    });
  } catch (err) {
    // NEVER 401 here
    return res.status(200).json({
      authenticated: false,
      emailVerified: false,
    });
  }
});




module.exports = router;
