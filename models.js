const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('yaman_delivery_db', 'postgres', 'postgres_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

// نموذج المتاجر
const Store = sequelize.define('Store', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'الرقة',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// نموذج المنتجات
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Product.belongsTo(Store, { foreignKey: 'storeId' });
Store.hasMany(Product, { foreignKey: 'storeId' });

// نموذج السائقين
const DeliveryMan = sequelize.define('DeliveryMan', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  currentLatitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  currentLongitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

// نموذج الطلبات
const Order = sequelize.define('Order', {
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  customerLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'accepted',
      'heading_to_store',
      'picked_up',
      'on_the_way',
      'delivered',
      'cancelled'
    ),
    defaultValue: 'pending',
  },
  totalProductsPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  deliveryFee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isShamCashConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  shamCashReceiptUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Order.belongsTo(DeliveryMan, { foreignKey: 'deliveryManId', allowNull: true });
DeliveryMan.hasMany(Order, { foreignKey: 'deliveryManId' });

// عناصر الطلب
const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

OrderItem.belongsTo(Store, { foreignKey: 'storeId' });
Store.hasMany(OrderItem, { foreignKey: 'storeId' });

// دالة حساب المسافة (Haversine)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// حساب أجرة التوصيل
function calculateDeliveryFee(distanceKm, storeCount) {
  let baseFee = 0;

  if (distanceKm <= 3) baseFee = 10000;
  else if (distanceKm <= 5) baseFee = 15000;
  else if (distanceKm <= 8) baseFee = 20000;
  else baseFee = 20000;

  const extraStores = storeCount > 1 ? storeCount - 1 : 0;
  const extraFee = extraStores * 5000;

  return baseFee + extraFee;
}

async function initDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connected and models synchronized.');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

module.exports = {
  sequelize,
  initDb,
  Store,
  Product,
  DeliveryMan,
  Order,
  OrderItem,
  calculateDistanceKm,
  calculateDeliveryFee,
};
