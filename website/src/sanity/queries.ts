import { defineQuery } from "next-sanity";

type ProductListSort = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const productFields = `{
  _id,
  name,
  "slug": slug.current,
  description,
  notes,
  price,
  images[]{
    alt,
    asset,
    crop,
    hotspot
  },
  "category": category->slug.current,
  "scentFamily": scentFamily->slug.current,
  "occasion": occasion->slug.current,
  options[]{
    _key,
    name,
    values
  }
}`;

const productFilter = /* groq */ `
  _type == "product" &&
  defined(slug.current) &&
  (
    $search == "" ||
    name match $search ||
    notes match $search ||
    description match $search
  ) &&
  (count($categories) == 0 || category->slug.current in $categories) &&
  (count($scentFamilies) == 0 || scentFamily->slug.current in $scentFamilies) &&
  (count($occasions) == 0 || occasion->slug.current in $occasions) &&
  price >= $minPrice &&
  price <= $maxPrice
`;

const PRODUCT_SORT_CLAUSE: Record<ProductListSort, string> = {
  "name-asc": "name asc",
  "name-desc": "name desc",
  "price-asc": "price asc",
  "price-desc": "price desc",
};

export function productsListQuery(sort: ProductListSort, start: number, end: number) {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start
  ) {
    throw new Error("Invalid product page bounds");
  }

  return defineQuery(`{
    "items": *[${productFilter}] | order(${PRODUCT_SORT_CLAUSE[sort]}, _id asc) [${start}...${end}] ${productFields},
    "total": count(*[${productFilter}])
  }`);
}

export const PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] ${productFields}
`);
