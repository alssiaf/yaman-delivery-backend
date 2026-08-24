const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerLocation: {
    lat: Number,
    lng: Number
  },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],

  mainStoreId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

  deliveryFeeMain: Number,
  deliveryFeeExtra: Number,

  totalProductsPrice: Number,
  totalDeliveryFee: Number,
  totalAmount: Number,

  paymentProofImageUrl: String,
  paymentStatus: { type: String, default: "pending" },

  deliveryWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryWorker" },

  orderStatus: {
    type: String,
    default: "waiting", // waiting, accepted, delivering, completed, cancelled
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
