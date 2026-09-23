"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AddToCartInput,
  CartLine,
} from "@/features/cart/types/cart.types";
import { getCartLineId } from "@/features/cart/utils/cart.utils";

type CartStore = {
  lines: CartLine[];
  addItem: (input: AddToCartInput) => void;
  removeItem: (lineId: string) => void;
  increment: (lineId: string) => void;
  decrement: (lineId: string) => void;
};

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") {
    return false;
  }

  const line = value as CartLine;
  const options = line.selectedOptions;

  return (
    typeof line.id === "string" &&
    typeof line.productId === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.quantity === "number" &&
    line.quantity >= 1 &&
    !!options &&
    typeof options === "object" &&
    Object.values(options).every((option) => typeof option === "string")
  );
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (input) =>
        set((state) => {
          const id = getCartLineId(input.productId, input.selectedOptions);
          const amount = Math.max(1, Math.floor(input.quantity ?? 1));
          const existing = state.lines.find((line) => line.id === id);

          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.id === id
                  ? { ...line, quantity: line.quantity + amount }
                  : line,
              ),
            };
          }

          return {
            lines: [...state.lines, { ...input, id, quantity: amount }],
          };
        }),
      removeItem: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.id !== lineId),
        })),
      increment: (lineId) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.id === lineId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          ),
        })),
      decrement: (lineId) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.id === lineId
              ? { ...line, quantity: Math.max(1, line.quantity - 1) }
              : line,
          ),
        })),
    }),
    {
      name: "odoratus-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      skipHydration: true,
      merge: (persisted, current) => {
        const stored = persisted as { lines?: unknown } | undefined;
        const lines = Array.isArray(stored?.lines)
          ? stored.lines.filter(isCartLine)
          : [];

        return { ...current, lines };
      },
    },
  ),
);
