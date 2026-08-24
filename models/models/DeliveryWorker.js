const mongoose = require("mongoose");

const DeliveryWorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("DeliveryWorker", DeliveryWorkerSchema);
