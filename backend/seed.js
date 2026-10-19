const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const connectDB = require('./config/db');

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation",
    category: "Electronics",
    price: 2999,
    discount: 20,
    stock: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 120 },
    coupon: { code: "HEAD20", discountType: "percentage", discountValue: 20 }
  },
  {
    name: "Smartphone 5G",
    description: "Latest 5G smartphone with 128GB storage",
    category: "Electronics",
    price: 15999,
    discount: 10,
    stock: 30,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop",
    rating: { rate: 4.8, count: 350 },
    coupon: { code: "PHONE10", discountType: "percentage", discountValue: 10 }
  },
  {
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt",
    category: "Clothing",
    price: 799,
    discount: 0,
    stock: 100,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop",
    rating: { rate: 4.2, count: 85 }
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes for men",
    category: "Footwear",
    price: 2499,
    discount: 15,
    stock: 45,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    rating: { rate: 4.6, count: 210 },
    coupon: { code: "RUN15", discountType: "percentage", discountValue: 15 }
  },
  {
    name: "Gaming Mouse",
    description: "Ergonomic gaming mouse with RGB",
    category: "Electronics",
    price: 1299,
    discount: 5,
    stock: 75,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop",
    rating: { rate: 4.3, count: 150 }
  },
  {
    name: "Backpack",
    description: "Durable travel backpack with laptop compartment",
    category: "Accessories",
    price: 1799,
    discount: 0,
    stock: 60,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop",
    rating: { rate: 4.7, count: 320 }
  },
  {
    name: "Smart Watch",
    description: "Fitness tracker and smart watch",
    category: "Electronics",
    price: 3499,
    discount: 25,
    stock: 40,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 180 },
    coupon: { code: "WATCH25", discountType: "percentage", discountValue: 25 }
  },
  {
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness",
    category: "Home",
    price: 1299,
    discount: 0,
    stock: 80,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop",
    rating: { rate: 4.1, count: 95 }
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat with carrying strap",
    category: "Sports",
    price: 999,
    discount: 10,
    stock: 120,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop",
    rating: { rate: 4.8, count: 410 },
    coupon: { code: "YOGA10", discountType: "percentage", discountValue: 10 }
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof bluetooth speaker",
    category: "Electronics",
    price: 1999,
    discount: 20,
    stock: 55,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 260 },
    coupon: { code: "BASS20", discountType: "percentage", discountValue: 20 }
  },
  {
    name: "Laptop 15.6-inch",
    description: "Everyday laptop with 16GB RAM and 512GB SSD",
    category: "Electronics",
    price: 54990,
    discount: 8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop",
    rating: { rate: 4.6, count: 180 }
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with tactile switches",
    category: "Electronics",
    price: 3499,
    discount: 10,
    stock: 65,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 230 }
  },
  {
    name: "Men's Casual Shirt",
    description: "Regular-fit cotton casual shirt",
    category: "Clothing",
    price: 1299,
    discount: 15,
    stock: 90,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop",
    rating: { rate: 4.2, count: 140 }
  },
  {
    name: "Women's Handbag",
    description: "Structured vegan leather handbag for daily use",
    category: "Accessories",
    price: 2199,
    discount: 12,
    stock: 45,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 175 }
  },
  {
    name: "Stainless Steel Bottle",
    description: "Insulated 1-litre stainless steel water bottle",
    category: "Sports",
    price: 799,
    discount: 10,
    stock: 150,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop",
    rating: { rate: 4.7, count: 520 }
  },
  {
    name: "Air Fryer 4.2L",
    description: "Digital air fryer with adjustable temperature control",
    category: "Home",
    price: 4999,
    discount: 14,
    stock: 35,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 310 }
  },
  {
    name: "LED Monitor 24-inch",
    description: "Full HD IPS monitor for work and entertainment",
    category: "Electronics",
    price: 8999,
    discount: 10,
    stock: 30,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
    rating: { rate: 4.3, count: 160 }
  },
  {
    name: "Women's Running Shoes",
    description: "Cushioned lightweight shoes for daily training",
    category: "Footwear",
    price: 2799,
    discount: 18,
    stock: 55,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
    rating: { rate: 4.6, count: 290 }
  },
  {
    name: "Wireless Earbuds",
    description: "True wireless earbuds with charging case",
    category: "Electronics",
    price: 2299,
    discount: 15,
    stock: 100,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 380 }
  },
  {
    name: "Tablet 10-inch",
    description: "Portable tablet with 128GB storage and vivid display",
    category: "Electronics",
    price: 18999,
    discount: 10,
    stock: 35,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 205 }
  },
  {
    name: "Power Bank 20000mAh",
    description: "Fast-charging power bank with dual USB outputs",
    category: "Electronics",
    price: 1699,
    discount: 12,
    stock: 85,
    image: "https://images.unsplash.com/photo-1609592424855-9d7f5e1f0a42?w=600&auto=format&fit=crop",
    rating: { rate: 4.3, count: 275 }
  },
  {
    name: "Smart LED TV 43-inch",
    description: "4K Android smart television with streaming apps",
    category: "Electronics",
    price: 28990,
    discount: 15,
    stock: 18,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 190 }
  },
  {
    name: "Wi-Fi Router",
    description: "Dual-band gigabit router for homes and small offices",
    category: "Electronics",
    price: 2499,
    discount: 8,
    stock: 50,
    image: "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=600&auto=format&fit=crop",
    rating: { rate: 4.2, count: 125 }
  },
  {
    name: "External SSD 1TB",
    description: "High-speed portable solid-state drive",
    category: "Electronics",
    price: 7499,
    discount: 10,
    stock: 42,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop",
    rating: { rate: 4.7, count: 340 }
  },
  {
    name: "Digital Camera",
    description: "Mirrorless camera for travel and everyday photography",
    category: "Electronics",
    price: 42990,
    discount: 7,
    stock: 12,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop",
    rating: { rate: 4.6, count: 155 }
  },
  {
    name: "Men's Jeans",
    description: "Stretch denim jeans with a regular tapered fit",
    category: "Clothing",
    price: 1799,
    discount: 20,
    stock: 100,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop",
    rating: { rate: 4.3, count: 215 }
  },
  {
    name: "Women's Cotton Kurta",
    description: "Printed cotton kurta for everyday comfort",
    category: "Clothing",
    price: 999,
    discount: 15,
    stock: 75,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 185 }
  },
  {
    name: "Hooded Sweatshirt",
    description: "Warm brushed-fleece hoodie for casual wear",
    category: "Clothing",
    price: 1599,
    discount: 18,
    stock: 65,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 260 }
  },
  {
    name: "Formal Trousers",
    description: "Slim-fit wrinkle-resistant formal trousers",
    category: "Clothing",
    price: 1899,
    discount: 10,
    stock: 55,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop",
    rating: { rate: 4.1, count: 90 }
  },
  {
    name: "Women's Denim Jacket",
    description: "Classic denim jacket with relaxed fit",
    category: "Clothing",
    price: 2299,
    discount: 12,
    stock: 48,
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&auto=format&fit=crop",
    rating: { rate: 4.3, count: 115 }
  },
  {
    name: "Leather Wallet",
    description: "Compact genuine leather wallet with RFID protection",
    category: "Accessories",
    price: 899,
    discount: 10,
    stock: 110,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 315 }
  },
  {
    name: "Sunglasses",
    description: "UV-protected polarized sunglasses with classic frame",
    category: "Accessories",
    price: 1299,
    discount: 15,
    stock: 80,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop",
    rating: { rate: 4.2, count: 145 }
  },
  {
    name: "Analog Wrist Watch",
    description: "Minimal stainless-steel watch for everyday wear",
    category: "Accessories",
    price: 2499,
    discount: 10,
    stock: 40,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 225 }
  },
  {
    name: "Travel Trolley Bag",
    description: "Medium hard-shell trolley with 360-degree wheels",
    category: "Accessories",
    price: 3499,
    discount: 18,
    stock: 32,
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop",
    rating: { rate: 4.6, count: 170 }
  },
  {
    name: "Casual Sneakers",
    description: "Comfortable everyday sneakers with cushioned sole",
    category: "Footwear",
    price: 1999,
    discount: 15,
    stock: 85,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 240 }
  },
  {
    name: "Leather Loafers",
    description: "Classic formal loafers with cushioned insole",
    category: "Footwear",
    price: 2999,
    discount: 12,
    stock: 45,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop",
    rating: { rate: 4.2, count: 130 }
  },
  {
    name: "Women's Sandals",
    description: "Comfortable everyday sandals with soft footbed",
    category: "Footwear",
    price: 1299,
    discount: 10,
    stock: 70,
    image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600&auto=format&fit=crop",
    rating: { rate: 4.1, count: 105 }
  },
  {
    name: "Hiking Boots",
    description: "Water-resistant ankle boots for outdoor trails",
    category: "Footwear",
    price: 3999,
    discount: 15,
    stock: 28,
    image: "https://images.unsplash.com/photo-1542840410-3092f99611a3?w=600&auto=format&fit=crop",
    rating: { rate: 4.6, count: 190 }
  },
  {
    name: "Bedsheet Set",
    description: "King-size cotton bedsheet with two pillow covers",
    category: "Home",
    price: 1499,
    discount: 20,
    stock: 90,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop",
    rating: { rate: 4.3, count: 280 }
  },
  {
    name: "Non-stick Cookware Set",
    description: "Three-piece induction-compatible cookware set",
    category: "Home",
    price: 3299,
    discount: 15,
    stock: 38,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 205 }
  },
  {
    name: "Vacuum Cleaner",
    description: "Bagless vacuum cleaner for daily home cleaning",
    category: "Home",
    price: 5999,
    discount: 12,
    stock: 22,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop",
    rating: { rate: 4.2, count: 145 }
  },
  {
    name: "Table Fan",
    description: "High-speed oscillating fan with three settings",
    category: "Home",
    price: 1799,
    discount: 10,
    stock: 60,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop",
    rating: { rate: 4.1, count: 115 }
  },
  {
    name: "LED Bulb Pack",
    description: "Pack of four energy-efficient warm-white LED bulbs",
    category: "Home",
    price: 499,
    discount: 5,
    stock: 200,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 340 }
  },
  {
    name: "Resistance Bands Set",
    description: "Five-level resistance bands for home workouts",
    category: "Sports",
    price: 699,
    discount: 10,
    stock: 120,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 290 }
  },
  {
    name: "Cricket Bat",
    description: "English willow-style bat for recreational cricket",
    category: "Sports",
    price: 2499,
    discount: 8,
    stock: 35,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop",
    rating: { rate: 4.4, count: 180 }
  },
  {
    name: "Football",
    description: "Machine-stitched training football with durable outer",
    category: "Sports",
    price: 899,
    discount: 10,
    stock: 75,
    image: "https://images.unsplash.com/photo-1579952363873-27f3badec3f0?w=600&auto=format&fit=crop",
    rating: { rate: 4.6, count: 250 }
  },
  {
    name: "Dumbbell Pair 5kg",
    description: "Hexagonal cast-iron dumbbells with vinyl coating",
    category: "Sports",
    price: 1999,
    discount: 12,
    stock: 50,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop",
    rating: { rate: 4.7, count: 370 }
  },
  {
    name: "Camping Backpack",
    description: "40-litre water-resistant hiking backpack",
    category: "Sports",
    price: 2499,
    discount: 15,
    stock: 42,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop",
    rating: { rate: 4.5, count: 210 }
  },
  {
    name: "Smart Plug",
    description: "Wi-Fi smart plug with app and voice control",
    category: "Electronics",
    price: 899,
    discount: 10,
    stock: 70,
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600&auto=format&fit=crop",
    rating: { rate: 4.2, count: 135 }
  }
];

const importData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    const createdUsers = await User.create([
      {
        name: process.env.SEED_ADMIN_NAME || 'Admin User',
        email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
        password: process.env.SEED_ADMIN_PASSWORD || '123456',
        role: 'admin',
      },
      {
        name: 'Test User',
        email: 'user@example.com',
        password: 'password',
        role: 'user',
      }
    ]);

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
