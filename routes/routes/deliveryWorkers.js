const express = require("express");
const router = express.Router();
const DeliveryWorker = require("../models/DeliveryWorker");

// تسجيل دخول الدليفري
router.post("/login", async (req, res) => {
  const { username, passwordHash } = req.body;
  const worker = await DeliveryWorker.findOne({ username, passwordHash });

  if (!worker) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", worker });
});

// إضافة عامل دليفري (لوحة التحكم)
router.post("/", async (req, res) => {
  const worker = new DeliveryWorker(req.body);
  await worker.save();
  res.json({ message: "Delivery worker created", worker });
});

// تعديل بيانات عامل دليفري
router.put("/:id", async (req, res) => {
  await DeliveryWorker.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Delivery worker updated" });
});

// حذف عامل دليفري
router.delete("/:id", async (req, res) => {
  await DeliveryWorker.findByIdAndDelete(req.params.id);
  res.json({ message: "Delivery worker deleted" });
});

module.exports = router;
