import { defineQuery } from "next-sanity";

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

export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && defined(slug.current)] | order(_createdAt asc) ${productFields}
`);

export const PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] ${productFields}
`);
