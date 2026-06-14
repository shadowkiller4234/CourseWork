export type CartItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

export type Cart = {
  _id: string;
  items: CartItem[];
};