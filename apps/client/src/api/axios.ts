import axios from "axios";

export const api = axios.create({
  baseURL: "https://coursework-1-pqt7.onrender.com",
  withCredentials: true
});
