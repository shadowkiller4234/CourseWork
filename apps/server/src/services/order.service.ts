import mongoose from 'mongoose';
import Order from '../models/orders.models';

import { CreateOrderDTO } from '../interfaces/create-order.dto';
import { UpdateOrderDTO } from '../interfaces/update-order.dto';

export const createOrder = async (data: CreateOrderDTO, userId: string) => {
  const order = await Order.create({
    user: new mongoose.Types.ObjectId(userId),

    phone: data.phone,
    address: data.address,

    items: data.items.map(item => ({
      product: new mongoose.Types.ObjectId(item.productId),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    })),

    totalPrice: Number(data.totalPrice),
  });

  return order;
};

export const UpdateOrder = async (data: UpdateOrderDTO, orderId: string) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order id');
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return updatedOrder;
}

export const getMyOrders = async (userId: string) => {
  return await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });
};