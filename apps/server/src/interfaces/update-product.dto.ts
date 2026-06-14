export interface UpdateProductDTO {
  name?: string;
  slug?: string;
  description?: string;

  price?: number;
  oldPrice?: number | null;

  category?: string;
  brand?: string;

  stock?: number;
  images?: string[];

  attributes?: {
  key: string;
  value: any;
  }[];
}