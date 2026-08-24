const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// عرض منتجات متجر معيّن
router.get("/", async (req, res) => {
  const { storeId } = req.query;
  const products = await Product.find({ storeId, isAvailable: true });
  res.json(products);
});

// إضافة منتج جديد
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ message: "Product created", product });
});

// تعديل منتج
router.put("/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Product updated" });
});

// حذف منتج
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
