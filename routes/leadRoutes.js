const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");

// CREATE
router.post("/", async (req, res) => {
  console.log("POST /api/leads body:", req.body);
  try {
    let { name, phone, email, platform, message } = req.body;

    name = typeof name === "string" ? name.trim() : "";
    phone = typeof phone === "string" ? phone.trim() : "";
    email = typeof email === "string" ? email.trim() : "";
    platform = typeof platform === "string" ? platform.trim() : "";
    message = typeof message === "string" ? message.trim() : "";

    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Name, phone, and email are required." });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email must be valid." });
    }

    const lead = new Lead({ name, phone, email, platform, message });
    await lead.save();
    console.log("New lead created:", lead._id);
    res.status(201).json({ message: "Success ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.platform) {
      filter.platform = req.query.platform;
    }
    const leads = await Lead.find(filter);
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
router.patch("/:id/status", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;