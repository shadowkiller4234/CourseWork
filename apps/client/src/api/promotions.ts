import { api } from "./axios";

export const getPromotions = async () => {
  const res = await api.get("/promotions");
  return res.data;
};

export const deletePromotion = async (id: string) => {
  const res = await api.delete(`/promotions/${id}`);
  return res.data;
};

export const updatePromotion = async (id: string, data: any) => {
  const res = await api.patch(`/promotions/${id}`, data);
  return res.data;
};

export const createPromotion = async (data: FormData) => {
  const res = await api.post("/promotions", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};