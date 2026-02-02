const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const mineRoutes = require("./routes/mineRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const app = express();

//middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mines", mineRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
// health check
app.get("/", (req, res) => {
  res.send("GreenMine API is running");
});

module.exports = app;
