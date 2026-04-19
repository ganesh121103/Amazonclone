require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const Cart = require('./models/cartModel');

// ─── Sample Data ───────────────────────────────
const users = [
  {
    name: 'Admin User',
    email: 'admin@amazonclone.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'user1234',
    isAdmin: false,
  },
  {
    name: 'Priya Singh',
    email: 'priya@example.com',
    password: 'user1234',
    isAdmin: false,
  },
];

const sampleProducts = [
  {
    name: 'Apple iPhone 15 Pro Max (256GB)',
    brand: 'Apple',
    category: 'Electronics',
    description:
      'The iPhone 15 Pro Max features a titanium design, A17 Pro chip, a 48MP main camera, and USB 3 for super-fast transfers. With an advanced 5x Telephoto camera and Action button, it is the most capable iPhone ever.',
    price: 159900,
    originalPrice: 179900,
    countInStock: 50,
    rating: 4.8,
    numReviews: 3240,
    isFeatured: true,
    tags: ['iphone', 'apple', 'smartphone', '5g'],
    images: [
      {
        public_id: 'iphone15promax',
        url: 'https://images.unsplash.com/photo-1695048065948-c93791f8e3ab?w=600&q=80',
      },
    ],
  },
  {
    name: 'Samsung 65" QLED 4K Smart TV',
    brand: 'Samsung',
    category: 'Electronics',
    description:
      'Experience stunning 4K QLED picture quality with Quantum Dot technology. Smart TV with built-in Alexa and Google Assistant. 120Hz refresh rate for ultra-smooth motion.',
    price: 89990,
    originalPrice: 120000,
    countInStock: 20,
    rating: 4.5,
    numReviews: 1850,
    isFeatured: true,
    tags: ['tv', 'samsung', 'qled', '4k', 'smart tv'],
    images: [
      {
        public_id: 'samsung_tv',
        url: 'https://images.unsplash.com/photo-1593784991095-a205069474b5?w=600&q=80',
      },
    ],
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'Electronics',
    description:
      'Industry-leading noise canceling with 8 mics and Auto NC Optimizer. Crystal clear hands-free calling. Up to 30hr battery life. Multipoint connection for simultaneously connecting to 2 devices.',
    price: 26990,
    originalPrice: 34990,
    countInStock: 100,
    rating: 4.7,
    numReviews: 5600,
    isFeatured: false,
    tags: ['headphones', 'sony', 'noise canceling', 'wireless'],
    images: [
      {
        public_id: 'sony_wh1000xm5',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      },
    ],
  },
  {
    name: 'Apple MacBook Air M3 (16GB/512GB)',
    brand: 'Apple',
    category: 'Computers',
    description:
      'Supercharged by the next-generation M3 chip, MacBook Air is faster and more capable than ever. With up to 18 hours of battery life, fanless design, and stunning Liquid Retina display.',
    price: 149900,
    originalPrice: 164900,
    countInStock: 30,
    rating: 4.9,
    numReviews: 2100,
    isFeatured: true,
    tags: ['macbook', 'apple', 'laptop', 'm3'],
    images: [
      {
        public_id: 'macbook_air_m3',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      },
    ],
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    brand: 'Nike',
    category: 'Sports',
    description:
      "Nike's biggest heel Air unit yet for a super-soft ride all day long. Lightweight mesh upper for breathability. Max cushioning for maximum comfort.",
    price: 9995,
    originalPrice: 12995,
    countInStock: 200,
    rating: 4.4,
    numReviews: 8900,
    isFeatured: false,
    tags: ['nike', 'shoes', 'running', 'sports'],
    images: [
      {
        public_id: 'nike_air_max',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      },
    ],
  },
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    brand: 'Instant Pot',
    category: 'Home & Kitchen',
    description:
      '7-in-1: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, warmer. 15+ smart programs for soups, beans/chili, rice, poultry, meat, and more.',
    price: 8499,
    originalPrice: 10999,
    countInStock: 150,
    rating: 4.6,
    numReviews: 32000,
    isFeatured: false,
    tags: ['kitchen', 'pressure cooker', 'instant pot', 'cooking'],
    images: [
      {
        public_id: 'instant_pot',
        url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
      },
    ],
  },
  {
    name: "Levi's 511 Slim Fit Men's Jeans",
    brand: "Levi's",
    category: 'Fashion',
    description:
      "Levi's 511 Slim Fit Jeans sit below the waist and are slim through the thigh and leg, with a narrow leg opening. Made with stretch fabric for all-day comfort.",
    price: 2699,
    originalPrice: 3999,
    countInStock: 300,
    rating: 4.3,
    numReviews: 15600,
    isFeatured: false,
    tags: ["jeans", "levi's", "fashion", "men"],
    images: [
      {
        public_id: 'levis_jeans',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
      },
    ],
  },
  {
    name: 'Kindle Paperwhite (16GB) - Waterproof E-reader',
    brand: 'Amazon',
    category: 'Electronics',
    description:
      'The thinnest, lightest Kindle Paperwhite ever with a brilliant glare-free 6.8" display. Waterproof so you can read in the bath or at the beach. 16GB storage holds thousands of books.',
    price: 14999,
    originalPrice: 17999,
    countInStock: 80,
    rating: 4.7,
    numReviews: 42000,
    isFeatured: true,
    tags: ['kindle', 'ereader', 'amazon', 'books'],
    images: [
      {
        public_id: 'kindle_paperwhite',
        url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80',
      },
    ],
  },
  {
    name: "The Alchemist - Paulo Coelho (Paperback)",
    brand: 'HarperCollins',
    category: 'Books',
    description:
      'A global phenomenon, selling over 65 million copies in 56 languages across the world. A special 25th anniversary edition of the extraordinary international bestseller.',
    price: 299,
    originalPrice: 499,
    countInStock: 500,
    rating: 4.5,
    numReviews: 98000,
    isFeatured: false,
    tags: ['book', 'fiction', 'paulo coelho', 'bestseller'],
    images: [
      {
        public_id: 'alchemist_book',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
      },
    ],
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    brand: 'Dyson',
    category: 'Home & Kitchen',
    description:
      'Reveals hidden dust with a precisely-angled laser. Acoustically detects and counts microscopic particles. Up to 60 minutes run time. HEPA filtration captures 99.99% of particles.',
    price: 61900,
    originalPrice: 69900,
    countInStock: 40,
    rating: 4.6,
    numReviews: 3400,
    isFeatured: false,
    tags: ['dyson', 'vacuum', 'cordless', 'home'],
    images: [
      {
        public_id: 'dyson_vacuum',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      },
    ],
  },
  {
    name: 'LEGO Technic Bugatti Chiron (42083)',
    brand: 'LEGO',
    category: 'Toys & Games',
    description:
      'Celebrate the iconic Bugatti Chiron with this 3599-piece set. Featuring an 8-speed gearbox, W16 engine, working suspension, and aerodynamic spoiler. For ages 16+.',
    price: 39999,
    originalPrice: 44999,
    countInStock: 25,
    rating: 4.8,
    numReviews: 1200,
    isFeatured: false,
    tags: ['lego', 'technic', 'bugatti', 'toys'],
    images: [
      {
        public_id: 'lego_bugatti',
        url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80',
      },
    ],
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    brand: 'Logitech',
    category: 'Computers',
    description:
      'Ultra-precise 8000 DPI sensor works on any surface including glass. Quiet Clicks with 90% noise reduction. USB-C charging. Connect up to 3 devices simultaneously.',
    price: 10995,
    originalPrice: 12995,
    countInStock: 120,
    rating: 4.7,
    numReviews: 6700,
    isFeatured: false,
    tags: ['logitech', 'mouse', 'wireless', 'productivity'],
    images: [
      {
        public_id: 'logitech_mx_master',
        url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
      },
    ],
  },
];

// ─── Seeder Function ───────────────────────────
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Existing data cleared');

    // Create users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    console.log(`👤 Created ${createdUsers.length} users`);
    console.log(`   Admin: admin@amazonclone.com / admin123`);
    console.log(`   User:  rahul@example.com / user1234`);

    // Attach admin user as creator to all products
    const products = sampleProducts.map((p) => ({ ...p, user: adminUser }));
    await Product.insertMany(products);
    console.log(`📦 Created ${products.length} products`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder error: ${error.message}`);
    process.exit(1);
  }
};

// ─── Destroy Function ──────────────────────────
const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('✅ All data destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Destroy error: ${error.message}`);
    process.exit(1);
  }
};

// Run with: node seeder.js [-d]
if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
