import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export const useCategoriesCrud = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/categories");
    setItems(data);
    setLoading(false);
  };

  const createItem = async (payload: any) => {
    await api.post("/admin/categories", payload);
    fetch();
  };

  const updateItem = async (id: string, payload: any) => {
    await api.patch(`/admin/categories/${id}`, payload);
    fetch();
  };

  const deleteItem = async (id: string) => {
    await api.delete(`/admin/categories/${id}`);
    fetch();
  };

  useEffect(() => {
    fetch();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refresh: fetch,
  };
};