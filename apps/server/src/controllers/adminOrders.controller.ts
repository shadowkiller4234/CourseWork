import { Request, Response } from "express";
import Order from "../models/orders.models";

// GET ALL ORDERS
export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product"); // ✅ FIX

    return res.json(orders);
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

// GET ORDER BY ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product")

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

// UPDATE ORDER (status, etc.)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("user", "name email")
      .populate("items.product")

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

// DELETE ORDER
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ message: "Order deleted successfully" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};