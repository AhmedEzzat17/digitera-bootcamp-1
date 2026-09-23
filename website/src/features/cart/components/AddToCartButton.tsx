"use client";

import { useCart } from "@/features/cart/hooks/useCart";
import type { AddToCartInput } from "@/features/cart/types/cart.types";

type AddToCartButtonProps = AddToCartInput & {
  className?: string;
  label?: string;
};

export function AddToCartButton({
  className,
  label = "Add to cart",
  quantity,
  ...input
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className={
        className ??
        "inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      }
      onClick={() => addItem({ ...input, quantity })}
    >
      {label}
    </button>
  );
}
