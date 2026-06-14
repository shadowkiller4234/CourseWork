import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export const useAdminCrud = (endpoint: string) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await api.get(`/admin/${endpoint}`);
    setItems(data);
    setLoading(false);
  };

  const createItem = async (payload: any) => {
    await api.post(`/admin/${endpoint}`, payload);
    fetchItems();
  };

  const updateItem = async (id: string, payload: any) => {
    await api.patch(`/admin/${endpoint}/${id}`, payload);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await api.delete(`/admin/${endpoint}/${id}`);
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refresh: fetchItems,
  };
};