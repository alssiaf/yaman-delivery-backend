const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  location: {
    lat: Number,
    lng: Number
  },
  phone: String,
  isActive: { type: Boolean, default: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true }
});

module.exports = mongoose.model("Store", StoreSchema);
