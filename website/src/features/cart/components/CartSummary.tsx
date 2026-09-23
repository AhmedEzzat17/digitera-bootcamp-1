import Link from "next/link";
import { cartPaths } from "@/features/cart/paths";
import { productPaths } from "@/features/products/paths";
import { formatCartAmount } from "@/features/cart/utils/cart.utils";

type CartSummaryProps = {
  subtotal: number;
  delivery: number;
};

export function CartSummary({ subtotal, delivery }: CartSummaryProps) {
  const total = subtotal + delivery;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-7 lg:w-[400px] lg:gap-6">
      <div className="flex flex-col gap-4 lg:gap-6">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-[32px] leading-[normal] text-[#1a1a1a] lg:text-[36px]">
          Order Summary
        </h2>
        <div className="flex flex-col gap-5 rounded-lg bg-[#f4f0eb] p-6">
          <div className="flex items-start justify-between text-[12px] leading-[normal]">
            <p className="font-normal text-[#605a54]">Subtotal</p>
            <p className="font-semibold text-black">
              {formatCartAmount(subtotal)}
            </p>
          </div>
          <div className="flex items-start justify-between text-[12px] leading-[normal]">
            <p className="font-normal text-[#605a54]">Delivery</p>
            <p className="font-semibold text-black">
              {formatCartAmount(delivery)}
            </p>
          </div>
          <div className="h-px w-full bg-[#ebe6de]" />
          <div className="flex items-start justify-between leading-[normal] font-bold text-black">
            <p className="text-[12px]">Total</p>
            <p className="text-[20px]">{formatCartAmount(total)}</p>
          </div>
          {subtotal === 0 ? (
            <button
              type="button"
              className="w-full rounded bg-[#1a1a1a] py-4 text-[12px] leading-[normal] font-bold text-white uppercase disabled:cursor-not-allowed disabled:opacity-40"
              disabled
            >
              Proceed to checkout
            </button>
          ) : (
            <Link
              href={cartPaths.checkout}
              className="flex w-full items-center justify-center rounded bg-[#1a1a1a] py-4 text-[12px] leading-[normal] font-bold text-white uppercase"
            >
              Proceed to checkout
            </Link>
          )}
          <p className="text-center text-[10px] leading-[normal] font-normal text-[#605a54] uppercase">
            Secure checkout · Visa · Mastercard · Amex
          </p>
        </div>
      </div>
      <Link
        href={productPaths.list}
        className="text-center text-[12px] leading-[normal] font-normal text-[#605a54] uppercase underline"
      >
        Continue shopping
      </Link>
    </aside>
  );
}
