const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const mineRoutes = require("./routes/mineRoutes");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/mines", mineRoutes);

// health check
app.get("/", (req, res) => {
  res.send("GreenMine API is running");
});

module.exports = app;
