require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const pantryRoutes = require("./routes/pantry");



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://pantry-ai-recipes-1.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api/pantry", pantryRoutes);


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models
const Pantry = require("./models/Pantry");
const Recipe = require("./models/Recipe");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "FocusTools API",
    status: "Running",
    endpoints: {
      pantry: "/api/pantry",
      recipes: "/api/recipes",
    },
  });
});

// TODO: Add your Task routes here
// POST /api/tasks



// TODO: Add your Session routes here
// POST /api/sessions


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
