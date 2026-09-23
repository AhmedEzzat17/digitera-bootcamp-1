export const API_VERSION = '2026-09-23'

type SlugContext = {
  getClient: (options: {apiVersion: string}) => {
    fetch: (query: string, params: Record<string, string | undefined>) => Promise<number>
  }
  document?: {_id?: string; _type?: string}
}

export async function validateUniqueSlug(slug: string, context: SlugContext) {
  const client = context.getClient({apiVersion: API_VERSION})
  const id = context.document?._id?.replace(/^drafts\./, '')
  const existing = await client.fetch(
    `count(*[_type == $type && slug.current == $slug && !(_id in [$id, $draftId])])`,
    {
      slug,
      type: context.document?._type,
      id,
      draftId: id ? `drafts.${id}` : '',
    },
  )

  return existing === 0 || 'Slug already exists'
}
