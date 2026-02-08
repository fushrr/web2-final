const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const petRoutes = require("./routes/pet.routes");
const adminRoutes = require("./routes/admin.routes");


const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);

// global error handler
app.use(errorHandler);

module.exports = app;
