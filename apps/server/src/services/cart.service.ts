import { Cart } from "../models/cart";
import { Types } from "mongoose";

export const getCart = async (userId: string) => {
  let cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
    });
  }

  return cart;  
};

export const addToCart = async (userId: string, productId: string) => {
  const cart = await getCart(userId);

  const existing = cart.items.find(
    (i: any) => i.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({
      productId: new Types.ObjectId(productId),
      quantity: 1,
    } as any);
  }

  await cart.save();

  return await Cart.findOne({ userId })
    .populate("items.productId");
};

export const removeFromCart = async (userId: string, productId: string) => {
  return await Cart.findOneAndUpdate(
    { userId },
    {
      $pull: {
        items: { productId: new Types.ObjectId(productId) }
      }
    },
    { new: true }
  ).populate("items.productId");
};

export const updateQuantity = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  if (quantity <= 0) {
    return await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: {
          items: { productId: new Types.ObjectId(productId) }
        }
      },
      { new: true }
    ).populate("items.productId");
  }

  return await Cart.findOneAndUpdate(
    { userId, "items.productId": productId },
    {
      $set: {
        "items.$.quantity": quantity
      }
    },
    { new: true }
  ).populate("items.productId");
};

export const clearCart = async (userId: string) => {
  const cart = await getCart(userId);
  cart.items = [] as any;
  await cart.save();
  return cart;
};
