"use client";

import { useUpdateProductListQuery } from "@/features/products/hooks/useUpdateProductListQuery";
import type { ProductListQuery } from "@/features/products/types/product.types";
import {
  PRICE_FILTER_MAX,
  PRICE_FILTER_MIN,
} from "@/features/products/utils/product.utils";

function toggle(values: string[] | undefined, id: string) {
  const current = values ?? [];
  const next = current.includes(id)
    ? current.filter((value) => value !== id)
    : [...current, id];

  return next.length > 0 ? next : undefined;
}

export function useProductFilters(query: ProductListQuery = {}) {
  const update = useUpdateProductListQuery(query);

  return {
    categories: query.categories ?? [],
    scentFamilies: query.scentFamilies ?? [],
    occasions: query.occasions ?? [],
    minPrice: query.minPrice ?? PRICE_FILTER_MIN,
    maxPrice: query.maxPrice ?? PRICE_FILTER_MAX,
    search: query.search ?? "",
    setSearch: (search: string) =>
      update({ search: search.trim() || undefined }),
    setPriceRange: (minPrice: number, maxPrice: number) =>
      update({
        minPrice: minPrice > PRICE_FILTER_MIN ? minPrice : undefined,
        maxPrice: maxPrice < PRICE_FILTER_MAX ? maxPrice : undefined,
      }),
    toggleCategory: (id: string) =>
      update({ categories: toggle(query.categories, id) }),
    toggleScentFamily: (id: string) =>
      update({ scentFamilies: toggle(query.scentFamilies, id) }),
    toggleOccasion: (id: string) =>
      update({ occasions: toggle(query.occasions, id) }),
  };
}
