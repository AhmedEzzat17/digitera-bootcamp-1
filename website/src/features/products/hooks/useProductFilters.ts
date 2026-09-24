"use client";

import { useUpdateProductListQuery } from "@/features/products/hooks/useUpdateProductListQuery";
import type { ProductListQuery } from "@/features/products/types/product.types";

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
    toggleCategory: (id: string) =>
      update({ categories: toggle(query.categories, id) }),
    toggleScentFamily: (id: string) =>
      update({ scentFamilies: toggle(query.scentFamilies, id) }),
    toggleOccasion: (id: string) =>
      update({ occasions: toggle(query.occasions, id) }),
  };
}
