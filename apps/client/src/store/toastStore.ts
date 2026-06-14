import { create } from "zustand";


type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

type ToastState = {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type = "success") => {
    const id = Date.now();

    set({
      toasts: [...get().toasts, { id, message, type }],
    });

    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => {
    set({
      toasts: get().toasts.filter((t) => t.id !== id),
    });
  },
}));