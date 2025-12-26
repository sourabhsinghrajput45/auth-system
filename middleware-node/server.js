require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Node middleware running on port ${process.env.PORT}`);
});
