import {defineField, defineType} from 'sanity'
import type {ComponentType} from 'react'
import {validateUniqueSlug} from './slug'

type TaxonomyConfig = {
  name: string
  title: string
  icon: ComponentType
}

export function defineTaxonomy({name, title, icon}: TaxonomyConfig) {
  return defineType({
    name,
    title,
    type: 'document',
    icon,
    fields: [
      defineField({
        name: 'title',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'slug',
        type: 'slug',
        options: {source: 'title', maxLength: 96},
        validation: (rule) =>
          rule.required().custom(async (slug, context) => {
            if (!slug?.current) return 'Required'
            if (!/^[a-z0-9-]+$/.test(slug.current)) {
              return 'Slug must be lowercase with hyphens only'
            }
            return validateUniqueSlug(slug.current, context)
          }),
      }),
    ],
    preview: {
      select: {title: 'title', subtitle: 'slug.current'},
    },
  })
}
