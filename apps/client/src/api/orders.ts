import { api } from "./axios";

export type OrderItem = {
  product?: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  address: string;
  phone: string;
  items: OrderItem[];
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Get order error:", error?.response?.data || error.message);
    throw new Error("Не вдалося завантажити замовлення");
  }
};

