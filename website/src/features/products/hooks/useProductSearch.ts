"use client";

import { useRouter } from "next/navigation";
import { productPaths } from "@/features/products/paths";

export function useProductSearch(search = "") {
  const router = useRouter();

  return {
    search,
    setSearch: (value: string) => {
      const next = value.trim();
      router.push(
        next
          ? `${productPaths.list}?search=${encodeURIComponent(next)}`
          : productPaths.list,
      );
    },
  };
}
