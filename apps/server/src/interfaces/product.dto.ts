export interface ProductDTO {
  _id: string;

  name: string;
  slug: string;
  description: string;

  price: number;
  oldPrice?: number | null;

  brand: {
    _id: string;
    name: string;
  };

  category: {
    _id: string;
    name: string;
  };

  stock: number;
  images: string[];

  attributes?: {
    key: string;
    value: any;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}