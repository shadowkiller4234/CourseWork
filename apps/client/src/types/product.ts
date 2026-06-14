export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;

  brand:
    | string
    | {
        _id: string;
        name: string;
      };

  category:
    | string
    | {
        _id: string;
        name: string;
      };

  stock: number;
  images: string[];

  attributes?: Record<string, any>;

  createdAt?: string;
  updatedAt?: string;
}