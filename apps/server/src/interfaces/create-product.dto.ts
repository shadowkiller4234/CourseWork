export interface CreateProductDTO {
  name: string;
  slug: string;
  description: string;

  price: number;
  oldPrice?: number;

  category: string;
  brand: string;

  stock: number;
  images: string[];

  attributes?: {
  key: string;
  value: any;
  }[];
}