import { create } from "zustand";
import { api } from "../api/axios";

type User = {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user";
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthChecked: boolean;

  setUser: (user: User | null) => void;

  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    name: string;
    password: string;
    role: string;
  }) => Promise<void>;

  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthChecked: false,

  setUser: (user) => set({ user }),

  // 🔐 LOGIN
  login: async (data) => {
    set({ isLoading: true });

    try {
      await api.post("/auth/login", data);

      // всегда берем пользователя из /me (единый источник истины)
      const res = await api.get("/auth/me");
      
      set({ user: res.data });
    } finally {
      set({ isLoading: false });
    }
  },

  // 📝 REGISTER
  register: async (data) => {
    set({ isLoading: true });

    try {
      await api.post("/auth/register", data);

      const res = await api.get("/auth/me");

      set({ user: res.data });
    } finally {
      set({ isLoading: false });
    }
  },

  // 🚪 LOGOUT
  logout: async () => {
  set({ isLoading: true });

  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
    set({ user: null });
  } finally {
    set({ isLoading: false });
  }
},

  // 🔄 CHECK AUTH (при перезагрузке)
  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const res = await api.get("/auth/me");

      set({
        user: res.data,
        isAuthChecked: true,
      });
    } catch {
      set({
        user: null,
        isAuthChecked: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));