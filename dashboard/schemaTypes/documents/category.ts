import {TagIcon} from '@sanity/icons/Tag'
import {defineTaxonomy} from '../shared/define-taxonomy'

export const category = defineTaxonomy({
  name: 'category',
  title: 'Category',
  icon: TagIcon,
})
