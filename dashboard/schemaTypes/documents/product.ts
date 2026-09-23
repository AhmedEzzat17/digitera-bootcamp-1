import {BottleIcon} from '@sanity/icons/Bottle'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {validateUniqueSlug} from '../shared/slug'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BottleIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Used as the product URL, for example /products/fleur-de-lune.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return 'Required'
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return 'Slug must be lowercase with hyphens only'
          }
          return validateUniqueSlug(slug.current, context)
        }),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notes',
      type: 'string',
      description: 'Short scent line shown on the product card, such as Floral / Jasmine & White Musk.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      description: 'Price in US dollars.',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: (rule) => rule.required().warning('Alt text is important for SEO'),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'scentFamily',
      title: 'Scent family',
      type: 'reference',
      to: [{type: 'scentFamily'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'occasion',
      type: 'reference',
      to: [{type: 'occasion'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'options',
      type: 'array',
      of: [defineArrayMember({type: 'productOption'})],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      category: 'category.title',
      media: 'images.0',
    },
    prepare({title, price, category, media}) {
      const formattedPrice = typeof price === 'number' ? `$${price}` : undefined
      return {
        title,
        subtitle: [category, formattedPrice].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
