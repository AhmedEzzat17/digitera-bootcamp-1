"use client";

import { useRouter } from "next/navigation";
import type { ProductListQuery } from "@/features/products/types/product.types";
import {
  PRODUCT_PAGE_SIZE,
  toProductListHref,
} from "@/features/products/utils/product.utils";

export function useUpdateProductListQuery(current: ProductListQuery = {}) {
  const router = useRouter();

  return (updates: Partial<ProductListQuery>, resetPage = true) => {
    const next: ProductListQuery = {
      ...current,
      ...updates,
      pageSize: PRODUCT_PAGE_SIZE,
    };

    if (resetPage) {
      next.page = 1;
    }

    router.push(toProductListHref(next), { scroll: false });
  };
}
