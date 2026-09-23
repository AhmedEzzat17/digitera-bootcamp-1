import {ControlsIcon} from '@sanity/icons/Controls'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const productOption = defineType({
  name: 'productOption',
  title: 'Product option',
  type: 'object',
  icon: ControlsIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'Label shown above the selector, such as Size.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'values',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
})
