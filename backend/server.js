const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// CORS - allow all origins for Vercel deployment
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options("*", cors());

// Routes
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/alerts",    require("./routes/alertRoutes"));
app.use("/api/incidents", require("./routes/incidentRoutes"));
app.use("/api/users",     require("./routes/userRoutes"));

// Health check
app.get("/", (req, res) => res.json({ message: "PLASU SafeApp API is running" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

module.exports = app;
