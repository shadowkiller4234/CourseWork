import { api } from "./axios";

export const getAllCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};