import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Shop')
    .items([
      S.documentTypeListItem('product').title('Products'),
      S.divider(),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('scentFamily').title('Scent families'),
      S.documentTypeListItem('occasion').title('Occasions'),
    ])
