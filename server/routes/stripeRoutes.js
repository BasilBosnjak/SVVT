import dotenv from "dotenv";
dotenv.config();
import e from "express";
import Stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

const stripeRoute = e.Router();

const stripePayment = async (req, res) => {
  const data = req.body;
  console.log(req.body);

  let lineItems = [];

  if (data.shipping == 9.99) {
    lineItems.push({
      price: process.env.STANDARD_SHIPPING_ID,
      quantity: 1,
    });
  } else {
    lineItems.push({
      price: process.env.EXPRESS_SHIPPING_ID,
      quantity: 1,
    });
  }

  data.cartItems.forEach((element) => {
    lineItems.push({
      price: element.stripeId,
      quantity: element.qty,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/cancel`,
  });

  const order = new Order({
    orderItems: data.cartItems,
    user: data.userInfo._id,
    username: data.userInfo.name,
    email: data.userInfo.email,
    shippingAddress: data.shippingAddress,
    shippingPrice: data.shipping,
    subtotal: data.subtotal,
    totalPrice: Number(data.subtotal + data.shipping).toFixed(2),
  });

  const newOrder = await order.save();

  data.cartItems.forEach(async (item) => {
    let product = await Product.findById(item.id);
    product.stock = product.stock - item.qty;
    product.save();
  });

  res.send(
    JSON.stringify({ orderId: newOrder._id.toString(), url: session.url })
  );
};

stripeRoute.route("/").post(protectRoute, stripePayment);

export default stripeRoute;
