const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  description: { type: String },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model("Product", ProductSchema);
