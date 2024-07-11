import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();

const getOrders = async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
};

const getOrderById = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  } else {
    res.json(order);
  }
});

const deleteOrderById = expressAsyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(400);
    throw new Error("Order could not be deleted.");
  }
});

const setDelivered = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(400);
    throw new Error("Order could not be updated");
  }
});

orderRoutes.route("/").get(getOrders, protectRoute, isAdmin);
orderRoutes.route("/:id").put(setDelivered, protectRoute, isAdmin);
orderRoutes.route("/:id").delete(deleteOrderById, protectRoute, isAdmin);
orderRoutes.route("/:id").get(getOrderById, protectRoute, isAdmin);

export default orderRoutes;
