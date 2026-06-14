import { api } from "./axios";

export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const addToCart = async (productId: string) => {
  const { data } = await api.post("/cart/add", {
    productId,
  });

  return data;
};

export const removeFromCart = async (productId: string) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

export const updateCartQty = async (
  productId: string,
  quantity: number
) => {
  const { data } = await api.patch(`/cart/${productId}`, {
    quantity,
  });

  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/cart");
  return data;
};