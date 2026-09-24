"use client";

import { useUpdateProductListQuery } from "@/features/products/hooks/useUpdateProductListQuery";
import type {
  ProductListQuery,
  ProductSort,
} from "@/features/products/types/product.types";
import { DEFAULT_PRODUCT_SORT } from "@/features/products/utils/product.utils";

export function useProductSort(query: ProductListQuery = {}) {
  const update = useUpdateProductListQuery(query);

  return {
    sort: query.sort ?? DEFAULT_PRODUCT_SORT,
    setSort: (value: ProductSort) => {
      update({ sort: value === DEFAULT_PRODUCT_SORT ? undefined : value });
    },
  };
}
