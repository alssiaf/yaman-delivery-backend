# README – اليمان دلفري | Yaman Delivery Backend

منصة توصيل محلية داخل مدينة الرقة  
واجهة خلفية (Backend API) مبنية باستخدام Node.js و Express و MongoDB

---

## 🧭 وصف المشروع
اليمان دلفري هو نظام توصيل محلي داخل مدينة الرقة، يهدف إلى جمع المتاجر والمطاعم والمولات ضمن منصة واحدة، بحيث يستطيع العميل تصفح المنتجات وإجراء طلب توصيل دون الحاجة لإنشاء حساب.

يتكون النظام من:
- تطبيق العميل
- تطبيق المتجر
- تطبيق الدليفري
- لوحة تحكم الإدارة
- واجهة خلفية (هذا المستودع)

---

## 🛠 التقنيات المستخدمة
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT للمصادقة
- Multer لرفع الصور
- GeoJSON لحساب المسافات
- RESTful API Architecture

---

## 📦 هيكل المشروع
yaman-delivery-backend/
│
├── app.js
├── package.json
│
├── /models
│   ├── Category.js
│   ├── Store.js
│   ├── Product.js
│   ├── DeliveryWorker.js
│   └── Order.js
│
├── /routes
│   ├── categories.js
│   ├── stores.js
│   ├── products.js
│   ├── orders.js
│   └── delivery.js
│
├── /uploads
│   └── product-images/
│
└── /config
    └── db.js

---

## 🧩 الكيانات الأساسية (Models)

### الأقسام (Categories)
- name
- isActive

### المتاجر (Stores)
- name
- categoryId
- location (lat, lng)
- phone
- isActive
- username / passwordHash

### المنتجات (Products)
- storeId
- name
- price
- imageUrl
- description
- isAvailable

### الدليفري (Delivery Workers)
- name
- phone
- status (Online / Offline / Busy)
- currentLocation
- username / passwordHash

### الطلبات (Orders)
- customerName
- customerPhone
- customerLocation
- items[]
- mainStoreId
- deliveryFeeMain
- deliveryFeeExtra
- totalProductsPrice
- totalDeliveryFee
- totalAmount
- paymentProofImageUrl
- paymentStatus
- deliveryWorkerId
- orderStatus

---

## 🔌 الـ APIs الأساسية

### العميل
GET /api/categories  
GET /api/stores?categoryId=  
GET /api/products?storeId=  
POST /api/orders  
POST /api/orders/:id/payment-proof  

### صاحب المتجر
POST /api/store/login  
GET /api/store/products  
POST /api/store/products  
PUT /api/store/products/:id  
DELETE /api/store/products/:id  

### الدليفري
POST /api/delivery/login  
PUT /api/delivery/status  
GET /api/delivery/orders/available  
POST /api/delivery/orders/:id/accept  
POST /api/delivery/orders/:id/reject  
POST /api/delivery/orders/:id/confirm-payment  

### لوحة التحكم
- إدارة الأقسام
- إدارة المتاجر
- إدارة المنتجات
- إدارة الدليفري
- إدارة الطلبات
- التقارير

---

## ⚙️ التشغيل المحلي

### تثبيت الحزم
npm install

### تشغيل السيرفر
npm start

### ملف البيئة .env
PORT=3000  
MONGO_URI=your_mongodb_connection  
JWT_SECRET=your_secret_key  

---

## 🌍 النشر
يمكن نشر المشروع على:
- Render
- Railway
- VPS
- Docker

---

## 📞 الدعم
30 يوماً دعم فني بعد التسليم لمعالجة الأخطاء البرمجية.

---

## 🎯 جاهز للنسخ واللصق
ضع هذا الملف داخل README.md في مستودع GitHub الخاص بك.
