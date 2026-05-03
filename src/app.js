const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-commerce Backend API is running");
});

app.use("/users", userRoutes);

module.exports = app;