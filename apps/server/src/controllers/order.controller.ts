import { Request, Response } from 'express';

import * as orderService from '../services/order.service';

import { CreateOrderDTO } from '../interfaces/create-order.dto';
import { UpdateOrderDTO } from '../interfaces/update-order.dto';

import { AuthRequest } from '../middleware/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await orderService.createOrder(req.body, userId);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateOrder = async (
    req: Request<{ id: string }, {}, UpdateOrderDTO>, res: Response ) => {
    try {
        const updatedOrder = await orderService.UpdateOrder(
            req.body,
            req.params.id
        );

        return res.status(200).json(
            updatedOrder
        );

  } catch (error: unknown) {

    if (error instanceof Error) {
        return res.status(400).json({
            message: error.message
        });
    }

    return res.status(500).json({
        message: 'Server error'
    });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await orderService.getMyOrders(userId);

    return res.json(orders);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};