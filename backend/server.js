const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const leadRoutes = require("../routes/leadRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

if (!mongoUri) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}
require("dotenv").config(); // optional locally

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));
mongoose.connect(mongoUri)
  .then(() => console.log("DB Connected"))
  .catch(err => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

app.use("/api/leads", leadRoutes);

app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);