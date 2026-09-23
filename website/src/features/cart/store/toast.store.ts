"use client";

import { create } from "zustand";

export type Toast = {
  id: string;
  message: string;
};

type ToastStore = {
  toasts: Toast[];
  show: (message: string) => void;
  dismiss: (id: string) => void;
};

const TOAST_DURATION_MS = 3000;
const timers = new Map<string, number>();

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (message) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts.slice(-2), { id, message }],
    }));
    timers.set(
      id,
      window.setTimeout(() => {
        get().dismiss(id);
      }, TOAST_DURATION_MS),
    );
  },
  dismiss: (id) => {
    const timer = timers.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.delete(id);
    }
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
