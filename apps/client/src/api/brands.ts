import { api } from "./axios";

export type Brand = {
  _id: string;
  name: string;
  slug?: string;
};

export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const { data } = await api.get("/brand"); // или "/brands" — проверь свой backend

    return data;
  } catch (error) {
    console.error("Ошибка загрузки брендов:", error);
    return [];
  }
};