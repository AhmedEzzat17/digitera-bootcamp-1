"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";
import type { Product } from "@/features/products/types/product.types";
import { resolveProductImages } from "@/features/products/utils/product.utils";
import { cn } from "@/lib/utils/cn";

type ProductImagesProps = {
  product: Product;
};

/** US-04: product image gallery. */
function ProductImagesComponent({ product }: ProductImagesProps) {
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
        {images.map((src, index) => (
          <Image
            key={`${src}-${index}`}
            src={src}
            alt={index === selected ? product.name : ""}
            fill
            priority
            unoptimized={src.startsWith("/")}
            className={cn(
              "object-cover",
              index === selected ? "z-10 opacity-100" : "z-0 opacity-0",
            )}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        ))}
      </div>
      {images.length > 1 ? (
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
                  unoptimized={src.startsWith("/")}
                  className="object-cover"
                  sizes="160px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export const ProductImages = memo(ProductImagesComponent);
