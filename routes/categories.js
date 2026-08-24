const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// عرض الأقسام للعميل
router.get("/", async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
});

// إضافة قسم (لوحة التحكم)
router.post("/", async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json({ message: "Category created", category });
});

// تعديل قسم
router.put("/:id", async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Category updated" });
});

// حذف قسم
router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

module.exports = router;
