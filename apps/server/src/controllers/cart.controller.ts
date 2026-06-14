import { Response } from "express";
import * as cartService from "../services/cart.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const getCartController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await cartService.getCart(req.user!.userId);

    res.json(cart);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка отримання кошика",
    });
  }
};

export const addToCartController = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;

    const cart = await cartService.addToCart(
      req.user!.userId,
      productId
    );

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка додавання товару" });
  }
};

export const removeFromCartController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await cartService.removeFromCart(
      req.user!.userId,
      req.params.productId
    );

    res.json(cart);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка видалення товару",
    });
  }
};

export const updateQtyController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await cartService.updateQuantity(
      req.user!.userId,
      req.params.productId,
      Number(req.body.quantity)
    );

    res.json(cart);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка оновлення кількості",
    });
  }
};

export const clearCartController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await cartService.clearCart(
      req.user!.userId
    );

    res.json(cart);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Помилка очищення кошика",
    });
  }
};