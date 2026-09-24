import { productPaths } from "@/features/products/paths";
import type {
  Product,
  ProductListQuery,
  ProductListResult,
  ProductSearchParams,
  ProductSort,
} from "@/features/products/types/product.types";

export const PRODUCT_PAGE_SIZE = 6;
export const DEFAULT_PRODUCT_SORT: ProductSort = "price-desc";
export const PRICE_FILTER_MIN = 0;
export const PRICE_FILTER_MAX = 100000;

const FIGMA_PRODUCT_IMAGES: Record<string, string[]> = {
  "fleur-de-lune": ["/images/products/fleur-de-lune.png"],
  "santal-parchment": ["/images/products/santal-parchment.png"],
  "noir-cocoon": ["/images/products/noir-cocoon.png"],
  "sol-dor": ["/images/products/sol-dor.png"],
  "atelier-oud": ["/images/products/atelier-oud.png"],
  "rose-absolute": ["/images/products/rose-absolute.png"],
};

export function resolveProductImages(product: Product): string[] {
  return FIGMA_PRODUCT_IMAGES[product.id] ?? product.images;
}

const SORT_VALUES: ProductSort[] = [
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
];

function priceBound(value: string | string[] | undefined): number | undefined {
  const raw = firstValue(value);
  if (!raw) {
    return undefined;
  }

  const number = Number(raw);
  if (!Number.isFinite(number)) {
    return undefined;
  }

  return Math.min(PRICE_FILTER_MAX, Math.max(PRICE_FILTER_MIN, Math.round(number)));
}

function firstValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function paramList(value: string | string[] | undefined): string[] | undefined {
  const values = (Array.isArray(value) ? value : value ? [value] : [])
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
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
  const sortValue = firstValue(searchParams.sort);
  const pageValue = Number(firstValue(searchParams.page));
  const minPrice = priceBound(searchParams.minPrice);
  const maxPrice = priceBound(searchParams.maxPrice);

  return {
    search: search || undefined,
    categories: paramList(searchParams.category),
    scentFamilies: paramList(searchParams.scentFamily),
    occasions: paramList(searchParams.occasion),
    minPrice: minPrice != null && minPrice > PRICE_FILTER_MIN ? minPrice : undefined,
    maxPrice: maxPrice != null && maxPrice < PRICE_FILTER_MAX ? maxPrice : undefined,
    sort: SORT_VALUES.includes(sortValue as ProductSort)
      ? (sortValue as ProductSort)
      : undefined,
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1,
    pageSize: PRODUCT_PAGE_SIZE,
  };
}

export function toProductListHref(query: ProductListQuery): string {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  for (const value of query.categories ?? []) {
    params.append("category", value);
  }

  for (const value of query.scentFamilies ?? []) {
    params.append("scentFamily", value);
  }

  for (const value of query.occasions ?? []) {
    params.append("occasion", value);
  }

  if (query.minPrice != null && query.minPrice > PRICE_FILTER_MIN) {
    params.set("minPrice", String(query.minPrice));
  }

  if (query.maxPrice != null && query.maxPrice < PRICE_FILTER_MAX) {
    params.set("maxPrice", String(query.maxPrice));
  }

  if (query.sort && query.sort !== DEFAULT_PRODUCT_SORT) {
    params.set("sort", query.sort);
  }

  if (query.page && query.page > 1) {
    params.set("page", String(query.page));
  }

  const search = params.toString();
  return search ? `${productPaths.list}?${search}` : productPaths.list;
}

function includesAny(selected: string[] | undefined, value: string) {
  return !selected?.length || selected.includes(value);
}

export function selectProducts(
  products: Product[],
  query: ProductListQuery,
): ProductListResult {
  const terms = query.search?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  const filtered = products.filter((product) => {
    const haystack = `${product.name} ${product.notes} ${product.description}`.toLowerCase();

    const minPrice = query.minPrice ?? PRICE_FILTER_MIN;
    const maxPrice = query.maxPrice ?? PRICE_FILTER_MAX;

    return (
      terms.every((term) => haystack.includes(term)) &&
      product.price >= minPrice &&
      product.price <= maxPrice &&
      includesAny(query.categories, product.category) &&
      includesAny(query.scentFamilies, product.scentFamily) &&
      includesAny(query.occasions, product.occasion)
    );
  });
  const sort = query.sort ?? DEFAULT_PRODUCT_SORT;
  const sorted = [...filtered].sort((left, right) => {
    if (sort === "name-asc") return left.name.localeCompare(right.name);
    if (sort === "name-desc") return right.name.localeCompare(left.name);
    if (sort === "price-asc") {
      return left.price - right.price || left.name.localeCompare(right.name);
    }
    return right.price - left.price || left.name.localeCompare(right.name);
  });
  const pageSize =
    query.pageSize && query.pageSize > 0 ? Math.floor(query.pageSize) : PRODUCT_PAGE_SIZE;
  const page = query.page && query.page > 0 ? Math.floor(query.page) : 1;
  const start = (page - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
  };
}
