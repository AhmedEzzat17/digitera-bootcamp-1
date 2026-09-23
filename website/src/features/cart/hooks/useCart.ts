"use client";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useToastStore } from "@/features/cart/store/toast.store";
import type { AddToCartInput } from "@/features/cart/types/cart.types";
import {
  getCartQuantity,
  getCartTotal,
} from "@/features/cart/utils/cart.utils";

export function useCart() {
  const lines = useCartStore((state) => state.lines);
  const addToCart = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const showToast = useToastStore((state) => state.show);

  const addItem = (input: AddToCartInput) => {
    addToCart(input);
    const amount = Math.max(1, Math.floor(input.quantity ?? 1));
    const message =
      amount > 1
        ? `${amount} × ${input.name} added to cart`
        : `${input.name} added to cart`;
    showToast(message);
  };

  return {
    lines,
    addItem,
    removeItem,
    increment,
    decrement,
    total: getCartTotal(lines),
    quantity: getCartQuantity(lines),
  };
}
