const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// إنشاء طلب جديد (العميل)
router.post("/", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ message: "Order created", order });
});

// رفع صورة إثبات الدفع
router.post("/:id/payment-proof", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    paymentProofImageUrl: req.body.paymentProofImageUrl,
    paymentStatus: "uploaded"
  });

  res.json({ message: "Payment proof uploaded" });
});

// عرض الطلبات المتاحة للدليفري
router.get("/available", async (req, res) => {
  const orders = await Order.find({ orderStatus: "waiting" });
  res.json(orders);
});

// قبول الطلب من الدليفري
router.post("/:id/accept", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    deliveryWorkerId: req.body.deliveryWorkerId,
    orderStatus: "accepted"
  });

  res.json({ message: "Order accepted" });
});

// تأكيد الدفع من الدليفري
router.post("/:id/confirm-payment", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    paymentStatus: "confirmed",
    orderStatus: "delivering"
  });

  res.json({ message: "Payment confirmed" });
});

// إنهاء الطلب
router.post("/:id/complete", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    orderStatus: "completed"
  });

  res.json({ message: "Order completed" });
});

module.exports = router;
