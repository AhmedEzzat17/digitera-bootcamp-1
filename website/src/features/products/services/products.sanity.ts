import { urlFor } from "@/sanity/image";
import { client } from "@/sanity/client";
import { PRODUCT_QUERY, PRODUCTS_QUERY } from "@/sanity/queries";
import type { ProductsService } from "@/features/products/services/products.service";
import type {
  Product,
  ProductOption,
} from "@/features/products/types/product.types";

type SanityImage = {
  alt?: string | null;
  asset?: {_ref?: string} | null;
  crop?: unknown;
  hotspot?: unknown;
} | null;

type SanityOption = {
  _key?: string | null;
  name?: string | null;
  values?: Array<string | null> | null;
} | null;

type SanityProduct = {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  notes?: string | null;
  price?: number | null;
  images?: SanityImage[] | null;
  category?: string | null;
  scentFamily?: string | null;
  occasion?: string | null;
  options?: SanityOption[] | null;
};

function imageUrl(image: SanityImage): string | null {
  if (!image?.asset) return null;
  return urlFor(image).width(1200).auto("format").url();
}

function toOption(option: SanityOption): ProductOption | null {
  if (!option?._key || !option.name) return null;
  return {
    id: option._key,
    name: option.name,
    values: (option.values ?? []).filter((value): value is string => Boolean(value)),
  };
}

function toProduct(document: SanityProduct | null): Product | null {
  if (!document?.slug || !document.name || typeof document.price !== "number") {
    return null;
  }

  return {
    id: document.slug,
    name: document.name,
    description: document.description ?? "",
    notes: document.notes ?? "",
    price: document.price,
    images: (document.images ?? [])
      .map((image) => imageUrl(image))
      .filter((url): url is string => Boolean(url)),
    category: document.category ?? "",
    scentFamily: document.scentFamily ?? "",
    occasion: document.occasion ?? "",
    options: (document.options ?? [])
      .map((option) => toOption(option))
      .filter((option): option is ProductOption => option !== null),
  };
}

export const sanityProductsService: ProductsService = {
  async list(query) {
    const documents = await client.fetch(PRODUCTS_QUERY);
    const items = documents.map((document) => toProduct(document)).filter(
      (product): product is Product => product !== null,
    );

    return {
      items,
      total: items.length,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 8,
    };
  },

  async getById(id) {
    const document = await client.fetch(PRODUCT_QUERY, { slug: id });
    return toProduct(document);
  },
};
