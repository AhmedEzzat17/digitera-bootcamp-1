import { mockProducts } from "@/features/products/services/products.mock-data";
import {
  formatPrice,
  parseProductListQuery,
  selectProducts,
} from "./product.utils";

describe("formatPrice", () => {
  it("formats a USD amount", () => {
    expect(formatPrice(12.5)).toBe("$12.50");
  });
});

describe("parseProductListQuery", () => {
  it("reads list query values from search params", () => {
    expect(
      parseProductListQuery({
        search: "mug",
        category: ["home", "garden"],
        scentFamily: "woody",
        occasion: "wedding,birthday",
        sort: "price-asc",
        page: "2",
        pageSize: "4",
      }),
    ).toEqual({
      search: "mug",
      categories: ["home", "garden"],
      scentFamilies: ["woody"],
      occasions: ["wedding", "birthday"],
      sort: "price-asc",
      page: 2,
      pageSize: 6,
    });
  });
});

describe("selectProducts", () => {
  it("searches, filters, sorts, and pages six products", () => {
    const searched = selectProducts(mockProducts, { search: "rose" });
    expect(searched.items.map((product) => product.id)).toEqual(["rose-absolute"]);
    expect(searched.total).toBe(1);

    const woody = selectProducts(mockProducts, {
      scentFamilies: ["woody"],
      sort: "price-asc",
    });
    expect(woody.items.map((product) => product.name)).toEqual([
      "Santal Parchment",
      "Atelier Oud",
    ]);

    const page = selectProducts(
      Array.from({ length: 8 }, (_, index) => ({
        ...mockProducts[0],
        id: `product-${index}`,
        name: `Product ${index}`,
        price: index,
      })),
      { sort: "price-asc", page: 2 },
    );
    expect(page.items).toHaveLength(2);
    expect(page.pageSize).toBe(6);
    expect(page.total).toBe(8);
  });

  it("keeps products inside the selected price range", () => {
    expect(parseProductListQuery({ minPrice: "150", maxPrice: "300" })).toMatchObject({
      minPrice: 150,
      maxPrice: 300,
    });

    const priced = selectProducts(mockProducts, {
      maxPrice: 200,
      sort: "price-asc",
    });
    expect(priced.items.map((product) => product.name)).toEqual([
      "Sol d'Or",
      "Fleur de Lune",
    ]);
  });
});
