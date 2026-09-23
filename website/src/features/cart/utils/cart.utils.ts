import type { CartLine } from "@/features/cart/types/cart.types";

export function getCartLineId(
  productId: string,
  selectedOptions: Record<string, string>,
): string {
  const optionsKey = Object.entries(selectedOptions)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");

  return optionsKey ? `${productId}__${optionsKey}` : productId;
}

export function getCartTotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.price * line.quantity, 0);
}

export function getCartQuantity(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export const CART_DELIVERY_FEE = 10;

export function getCartDelivery(lines: CartLine[]): number {
  return lines.some((line) => line.quantity > 0) ? CART_DELIVERY_FEE : 0;
}

export function formatCartAmount(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2);

  return `${text} USD`;
}
