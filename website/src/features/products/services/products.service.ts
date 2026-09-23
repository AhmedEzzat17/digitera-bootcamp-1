import { env } from "@/config/env";
import { mockProductsService } from "@/features/products/services/products.mock";
import { sanityProductsService } from "@/features/products/services/products.sanity";
import type {
  Product,
  ProductId,
  ProductListQuery,
  ProductListResult,
} from "@/features/products/types/product.types";

export type ProductsService = {
  list(query: ProductListQuery): Promise<ProductListResult>;
  getById(id: ProductId): Promise<Product | null>;
};

export function createProductsService(): ProductsService {
  return env.useMockApi ? mockProductsService : sanityProductsService;
}

export const productsService = createProductsService();
