const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// اتصال قاعدة البيانات
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/yaman_delivery")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// المسارات
const categoriesRoutes = require("./routes/categories");
const storesRoutes = require("./routes/stores");
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const deliveryWorkersRoutes = require("./routes/deliveryWorkers");

app.use("/api/categories", categoriesRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/delivery-workers", deliveryWorkersRoutes);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
