import { api } from "./axios";

export const register = async (data: {
  email: string;
  nickname: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};