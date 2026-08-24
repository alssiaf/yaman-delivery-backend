const express = require("express");
const router = express.Router();
const Store = require("../models/Store");

// عرض المتاجر حسب القسم
router.get("/", async (req, res) => {
  const { categoryId } = req.query;
  const stores = await Store.find({ categoryId, isActive: true });
  res.json(stores);
});

// تسجيل دخول صاحب المتجر
router.post("/login", async (req, res) => {
  const { username, passwordHash } = req.body;
  const store = await Store.findOne({ username, passwordHash });

  if (!store) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", store });
});

// إضافة متجر (لوحة التحكم)
router.post("/", async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  res.json({ message: "Store created", store });
});

// تعديل متجر
router.put("/:id", async (req, res) => {
  await Store.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Store updated" });
});

// حذف متجر
router.delete("/:id", async (req, res) => {
  await Store.findByIdAndDelete(req.params.id);
  res.json({ message: "Store deleted" });
});

module.exports = router;
