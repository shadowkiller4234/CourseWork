import { api } from "./axios";

export const getProductBySlug = async (slug: string) => {
  const res = await api.get(`/product/${slug}`);
  return res.data;
};

export const getAllProduct = async (page: number) => {
  const res = await api.get(`/product?page=${page}&limit=12`);
  return res.data;
};

export const searchProducts = async (query: string) => {
  const { data } = await api.get(`/product/search?q=${query}`);
  return data;
};