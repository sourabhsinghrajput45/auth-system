const express = require("express");
const router = express.Router();
const quarkus = require("../services/quarkus.service");


router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    await quarkus.signup(email, password);

    // ✅ Always return predictable JSON
    return res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      email,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err.response?.data || err.message);

    return res.status(400).json({
      success: false,
      message:
        typeof err.response?.data === "string"
          ? err.response.data
          : "Signup failed",
    });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await quarkus.login(email, password);

    res
      .cookie("accessToken", data.accessToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("refreshToken", data.refreshToken ?? "", {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: data.message,
        emailVerified: data.emailVerified === true, // 👈 ADD THIS
      });
  } catch (err) {
    res.status(401).json({ message: err.response?.data || "Login failed" });
  }
});


router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const data = await quarkus.refresh(refreshToken);

    res
      .cookie("accessToken", data.accessToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Token refreshed" });
  } catch {
    res.status(401).json({ message: "Refresh failed" });
  }
});
router.post("/resend-verification", async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    await quarkus.resendVerification(accessToken);

    res.json({ message: "Verification email sent" });
  } catch {
    res.status(400).json({ message: "Failed to resend verification" });
  }
});

router.post("/logout", async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (accessToken) {
    await quarkus.logout(accessToken);
  }

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "Logged out" });
});

module.exports = router;
