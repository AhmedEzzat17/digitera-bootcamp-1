"use client";

import Link from "next/link";
import {useCart} from "@/features/cart/hooks/useCart";

type HomeProductCardProps = {
  id: string;
  name: string;
  notes: string;
  price: number;
  image: string;
};

export function HomeProductCard({
  id,
  name,
  notes,
  price,
  image,
}: HomeProductCardProps) {
  const {addItem} = useCart();

  return (
    <article className="flex min-w-0 flex-1 flex-col gap-4 rounded-lg bg-white p-4">
      <Link href={`/products/${id}`} className="relative h-[320px] overflow-hidden rounded">
        <img src={image} alt={name} className="absolute inset-0 size-full object-cover" />
      </Link>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <Link
              href={`/products/${id}`}
              className="truncate font-[family-name:var(--font-instrument-serif)] text-[22px] text-[#1a1a1a]"
            >
              {name}
            </Link>
            <p className="truncate text-[11px] font-normal text-[#c5a880] uppercase">{notes}</p>
          </div>
          <p className="shrink-0 text-[15px] font-semibold text-[#1a1a1a]">${price}</p>
        </div>
        <button
          type="button"
          className="w-full rounded border border-[#ebe6de] py-3 text-[11px] font-semibold text-[#1a1a1a] uppercase"
          onClick={() =>
            addItem({
              productId: id,
              name,
              price,
              image,
              selectedOptions: {},
              quantity: 1,
            })
          }
        >
          Add to Cart +
        </button>
      </div>
    </article>
  );
}
