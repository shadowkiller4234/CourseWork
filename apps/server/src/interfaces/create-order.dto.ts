export interface CreateOrderItemDTO {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderDTO {
  items: CreateOrderItemDTO[];
  phone: string;
  address: string;
  totalPrice: number;
}