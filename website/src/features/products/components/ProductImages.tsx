"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/features/products/types/product.types";
import { resolveProductImages } from "@/features/products/utils/product.utils";
import { cn } from "@/lib/utils/cn";

type ProductImagesProps = {
  product: Product;
};

/** US-04: product image gallery. */
export function ProductImages({ product }: ProductImagesProps) {
  const [selected, setSelected] = useState(0);
  const images = resolveProductImages(product);
  const image = images[selected] ?? images[0];

  useEffect(() => {
    setSelected(0);
  }, [product.id]);

  if (!image) {
    return (
      <div className="flex h-[360px] w-full items-center justify-center rounded-lg bg-[#ebe6de] text-[#605a54] sm:h-[480px] lg:h-[600px]">
        No product images yet
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-4">
      <div className="relative h-[360px] w-full overflow-hidden rounded-lg sm:h-[480px] lg:h-[600px]">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      <div className="flex w-full items-start gap-4">
        {images.map((src, index) => {
          const isSelected = index === selected;

          return (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`Show ${product.name} image ${index + 1}`}
              aria-current={isSelected ? "true" : undefined}
              className={cn(
                "relative h-[88px] min-w-0 flex-1 overflow-hidden rounded sm:h-[120px]",
                isSelected && "border-2 border-[#c5a880]",
              )}
              onClick={() => setSelected(index)}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="160px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
