const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const {
  initDb,
  Store,
  Product,
  DeliveryMan,
  Order,
  OrderItem,
  calculateDistanceKm,
  calculateDeliveryFee,
} = require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// إعداد رفع صورة إيصال شام كاش
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// إنشاء متجر
app.post('/api/stores', async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: 'Error creating store' });
  }
});

// جلب المتاجر
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.findAll({ where: { isActive: true } });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching stores' });
  }
});

// إنشاء منتج
app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// تحديث منتج
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// حذف منتج
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// جلب منتجات متجر
app.get('/api/stores/:storeId/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { storeId: req.params.storeId, isAvailable: true },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// إضافة سائق
app.post('/api/delivery-men', async (req, res) => {
  try {
    const deliveryMan = await DeliveryMan.create(req.body);
    res.status(201).json(deliveryMan);
  } catch (err) {
    res.status(500).json({ error: 'Error creating delivery man' });
  }
});

// تحديث موقع السائق
app.put('/api/delivery-men/:id/location', async (req, res) => {
  try {
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);
    if (!deliveryMan) return res.status(404).json({ error: 'Delivery man not found' });

    await deliveryMan.update(req.body);
    res.json(deliveryMan);
  } catch (err) {
    res.status(500).json({ error: 'Error updating location' });
  }
});

// إنشاء طلب جديد
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      customerLatitude,
      customerLongitude,
      items,
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ error: 'Items required' });

    let totalProductsPrice = 0;
    const storeIds = new Set();
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      const store = await Store.findByPk(item.storeId);

      if (!product || !store)
        return res.status(400).json({ error: 'Invalid product/store' });

      const quantity = item.quantity || 1;
      const totalPrice = product.price * quantity;

      totalProductsPrice += totalPrice;
      storeIds.add(store.id);

      orderItemsData.push({
        storeId: store.id,
        productId: product.id,
        quantity,
        unitPrice: product.price,
        totalPrice,
      });
    }

    let maxDistance = 0;
    for (const storeId of storeIds) {
      const store = await Store.findByPk(storeId);
      const distance = calculateDistanceKm(
        customerLatitude,
        customerLongitude,
        store.latitude,
        store.longitude
      );
      if (distance > maxDistance) maxDistance = distance;
    }

    const deliveryFee = calculateDeliveryFee(maxDistance, storeIds.size);
    const totalPrice = totalProductsPrice + deliveryFee;

    const order = await Order.create({
      customerName,
      customerPhone,
      customerAddress,
      customerLatitude,
      customerLongitude,
      totalProductsPrice,
      deliveryFee,
      totalPrice,
    });

    for (const item of orderItemsData) {
      await OrderItem.create({ orderId: order.id, ...item });
    }

    res.status(201).json(await Order.findByPk(order.id, { include: OrderItem }));
  } catch (err) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

// تحديث حالة الطلب
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await order.update(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error updating order' });
  }
});

// رفع إيصال شام كاش
app.post('/api/orders/:id/sham-cash', upload.single('receipt'), async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.shamCashReceiptUrl = `/uploads/${req.file.filename}`;
    await order.save();

    res.json({ message: 'Receipt uploaded', order });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading receipt' });
  }
});

// جلب الطلبات النشطة
app.get('/api/admin/active-orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        status: ['pending', 'accepted', 'heading_to_store', 'picked_up', 'on_the_way'],
      },
      include: [OrderItem, DeliveryMan],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching active orders' });
  }
});

// تقارير مالية
app.get('/api/admin/reports', async (req, res) => {
  try {
    const type = req.query.type;
    const now = new Date();
    let fromDate;

    if (type === 'daily') fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    else if (type === 'weekly') fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    else if (type === 'monthly') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else return res.status(400).json({ error: 'Invalid type' });

    const orders = await Order.findAll({
      where: {
        status: 'delivered',
        updatedAt: { [require('sequelize').Op.gte]: fromDate },
      },
    });

    res.json({
      type,
      completedCount: orders.length,
      totalEarnings: orders.reduce((sum, o) => sum + o.deliveryFee, 0),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error generating report' });
  }
});

// تشغيل السيرفر
initDb().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});
const categoriesRoutes = require("./routes/categories");
app.use("/api/categories", categoriesRoutes);
const storesRoutes = require("./routes/stores");
app.use("/api/stores", storesRoutes);
const productsRoutes = require("./routes/products");
app.use("/api/products", productsRoutes);
