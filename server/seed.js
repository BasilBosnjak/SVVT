import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import databaseConnection from "./db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Order from "./models/Order.js";

const categories = [
  { name: "Laptops", description: "Portable computers for work and play." },
  { name: "Headphones", description: "Wired and wireless audio gear." },
  { name: "Smartphones", description: "Mobile phones and accessories." },
  { name: "Cameras", description: "Digital cameras and lenses." },
];

const products = [
  {
    name: "Aurora 14 Laptop",
    price: 999.99,
    brand: "Aurora",
    subtitle: "Light. Fast. Reliable.",
    description:
      "A 14-inch ultrabook with all-day battery life, perfect for work and travel.",
    productIsNew: true,
    images: [
      "https://picsum.photos/seed/laptop1/600/600",
      "https://picsum.photos/seed/laptop1b/600/600",
    ],
    category: "Laptops",
  },
  {
    name: "Nimbus Pro 16",
    price: 1499.0,
    brand: "Nimbus",
    subtitle: "Power for creators.",
    description:
      "A 16-inch powerhouse laptop with a high-refresh display and discrete graphics.",
    productIsNew: false,
    images: [
      "https://picsum.photos/seed/laptop2/600/600",
      "https://picsum.photos/seed/laptop2b/600/600",
    ],
    category: "Laptops",
  },
  {
    name: "EchoWave ANC Headphones",
    price: 199.99,
    brand: "EchoWave",
    subtitle: "Silence the world.",
    description:
      "Over-ear wireless headphones with active noise cancellation and 30-hour battery.",
    productIsNew: true,
    images: [
      "https://picsum.photos/seed/headphones1/600/600",
      "https://picsum.photos/seed/headphones1b/600/600",
    ],
    category: "Headphones",
  },
  {
    name: "PulseBuds Lite",
    price: 59.99,
    brand: "Pulse",
    subtitle: "True wireless, true value.",
    description:
      "Compact true wireless earbuds with a compact charging case and IPX4 rating.",
    productIsNew: false,
    images: [
      "https://picsum.photos/seed/headphones2/600/600",
      "https://picsum.photos/seed/headphones2b/600/600",
    ],
    category: "Headphones",
  },
  {
    name: "Vertex X12",
    price: 799.0,
    brand: "Vertex",
    subtitle: "Flagship performance.",
    description:
      "A flagship smartphone with a triple-camera system and 120Hz display.",
    productIsNew: true,
    images: [
      "https://picsum.photos/seed/phone1/600/600",
      "https://picsum.photos/seed/phone1b/600/600",
    ],
    category: "Smartphones",
  },
  {
    name: "Vertex Lite",
    price: 399.0,
    brand: "Vertex",
    subtitle: "Everyday essentials.",
    description:
      "A budget-friendly smartphone with a large battery and solid daily performance.",
    productIsNew: false,
    images: [
      "https://picsum.photos/seed/phone2/600/600",
      "https://picsum.photos/seed/phone2b/600/600",
    ],
    category: "Smartphones",
  },
  {
    name: "Lumina Mirrorless Camera",
    price: 1199.0,
    brand: "Lumina",
    subtitle: "Capture every detail.",
    description:
      "A mirrorless camera with a 24MP sensor and interchangeable lens mount.",
    productIsNew: true,
    images: [
      "https://picsum.photos/seed/camera1/600/600",
      "https://picsum.photos/seed/camera1b/600/600",
    ],
    category: "Cameras",
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    isAdmin: true,
    active: true,
    firstLogin: false,
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    isAdmin: false,
    active: true,
    firstLogin: false,
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    isAdmin: false,
    active: true,
    firstLogin: false,
  },
];

const destroyData = async () => {
  await Order.deleteMany();
  await Product.deleteMany();
  await Category.deleteMany();
  await User.deleteMany();
  console.log("Data destroyed.");
  process.exit();
};

const importData = async () => {
  await Order.deleteMany();
  await Product.deleteMany();
  await Category.deleteMany();
  await User.deleteMany();

  await Category.insertMany(categories);
  const createdProducts = await Product.create(products);
  const createdUsers = await User.create(users);

  const buyer = createdUsers.find((u) => u.email === "jane@example.com");
  const sampleProduct = createdProducts[0];

  await Order.create({
    user: buyer._id,
    username: buyer.name,
    email: buyer.email,
    orderItems: [
      {
        name: sampleProduct.name,
        qty: 1,
        image: sampleProduct.images[0],
        price: sampleProduct.price,
        id: sampleProduct._id,
      },
    ],
    shippingAddress: {
      address: "123 Main St",
      city: "Springfield",
      postalCode: "12345",
      country: "USA",
    },
    shippingPrice: 5.99,
    subtotal: sampleProduct.price,
    totalPrice: sampleProduct.price + 5.99,
    isDelivered: false,
  });

  console.log("Data imported.");
  process.exit();
};

await databaseConnection();

if (process.argv[2] === "-d") {
  await destroyData();
} else {
  await importData();
}
