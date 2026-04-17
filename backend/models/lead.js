const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  platform: String,
  message: String,
  status: { type: String, default: "New" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lead", leadSchema);