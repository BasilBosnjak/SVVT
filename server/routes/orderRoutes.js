import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();

const getOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

const getOrderById = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).send("Order not found.");
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
    res.status(400).send("Order could not be deleted.");
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
    res.status(400).send("Order could not be updated");
    throw new Error("Order could not be updated");
  }
});

orderRoutes.route("/").get(protectRoute, isAdmin, getOrders);
orderRoutes.route("/:id").put(protectRoute, isAdmin, setDelivered);
orderRoutes.route("/:id").delete(protectRoute, isAdmin, deleteOrderById);
orderRoutes.route("/:id").get(protectRoute, isAdmin, getOrderById);

export default orderRoutes;
