import type {
  Product,
  ProductListQuery,
  ProductSearchParams,
  ProductSort,
} from "@/features/products/types/product.types";

const IMAGE_FALLBACKS: Record<string, string[]> = {
  "fleur-de-lune": ["/images/products/fleur-de-lune.png"],
  "santal-parchment": [
    "/images/products/santal-parchment.png",
    "/images/products/santal-parchment-2.png",
    "/images/products/santal-parchment-3.png",
    "/images/products/santal-parchment-4.png",
  ],
  "noir-cocoon": ["/images/products/noir-cocoon.png"],
  "sol-dor": ["/images/products/sol-dor.png"],
  "atelier-oud": ["/images/products/atelier-oud.png"],
  "rose-absolute": ["/images/products/rose-absolute.png"],
};

export function resolveProductImages(product: Product): string[] {
  if (product.images.length > 0) {
    return product.images;
  }

  return IMAGE_FALLBACKS[product.id] ?? [];
}

const SORT_VALUES: ProductSort[] = [
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
];

function firstValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatWholePrice(amount: number): string {
  return `$${amount}`;
}

export function formatTaxonomyLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseProductListQuery(
  searchParams: ProductSearchParams,
): ProductListQuery {
  const search = firstValue(searchParams.search)?.trim();
  const category = firstValue(searchParams.category)?.trim();
  const sortValue = firstValue(searchParams.sort);
  const pageValue = Number(firstValue(searchParams.page));
  const pageSizeValue = Number(firstValue(searchParams.pageSize));

  return {
    search: search || undefined,
    category: category || undefined,
    sort: SORT_VALUES.includes(sortValue as ProductSort)
      ? (sortValue as ProductSort)
      : undefined,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
    pageSize:
      Number.isFinite(pageSizeValue) && pageSizeValue > 0
        ? pageSizeValue
        : 6,
  };
}
