import { mockProducts } from "@/features/products/services/products.mock-data";
import type { ProductsService } from "@/features/products/services/products.service";
import { selectProducts } from "@/features/products/utils/product.utils";

/**
 * In-memory catalog used while no backend exists.
 * Search, filter, sort, and pagination are intentionally left for user stories.
 */
export const mockProductsService: ProductsService = {
  async list(query) {
    return selectProducts(mockProducts, query);
  },

  async getById(id) {
    return mockProducts.find((product) => product.id === id) ?? null;
  },
};
