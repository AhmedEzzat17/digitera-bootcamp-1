import {createReadStream, existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-09-23'})
const publicImagesPath = resolve(process.cwd(), '../website/public/images/products')

const taxonomies = {
  category: [
    {title: 'Pure Extractions', slug: 'pure-extractions'},
    {title: 'Private Reserve', slug: 'private-reserve'},
    {title: 'Atelier Oils', slug: 'atelier-oils'},
    {title: 'Discovery Vault', slug: 'discovery-vault'},
  ],
  scentFamily: [
    {title: 'Floral', slug: 'floral'},
    {title: 'Woody', slug: 'woody'},
    {title: 'Oriental', slug: 'oriental'},
    {title: 'Fresh', slug: 'fresh'},
  ],
  occasion: [
    {title: 'Personal Use', slug: 'personal-use'},
    {title: 'Wedding', slug: 'wedding'},
    {title: 'Gift Sets', slug: 'gift-sets'},
    {title: 'Birthday', slug: 'birthday'},
  ],
} as const

const products = [
  {
    name: 'Fleur de Lune',
    slug: 'fleur-de-lune',
    description: 'A luminous floral composition of jasmine and white musk.',
    notes: 'Floral / Jasmine & White Musk',
    price: 195,
    category: 'pure-extractions',
    scentFamily: 'floral',
    occasion: 'personal-use',
    image: 'fleur-de-lune.png',
  },
  {
    name: 'Santal Parchment',
    slug: 'santal-parchment',
    description: 'Warm sandalwood layered with cardamom.',
    notes: 'Woody / Sandalwood & Cardamom',
    price: 220,
    category: 'pure-extractions',
    scentFamily: 'woody',
    occasion: 'personal-use',
    image: 'santal-parchment.png',
  },
  {
    name: 'Noir Cocoon',
    slug: 'noir-cocoon',
    description: 'An oriental blend of tobacco and amber.',
    notes: 'Oriental / Tobacco & Amber',
    price: 240,
    category: 'private-reserve',
    scentFamily: 'oriental',
    occasion: 'wedding',
    image: 'noir-cocoon.png',
  },
  {
    name: "Sol d'Or",
    slug: 'sol-dor',
    description: 'A fresh coastal blend of bergamot and sea salt.',
    notes: 'Fresh / Bergamot & Sea Salt',
    price: 185,
    category: 'pure-extractions',
    scentFamily: 'fresh',
    occasion: 'personal-use',
    image: 'sol-dor.png',
  },
  {
    name: 'Atelier Oud',
    slug: 'atelier-oud',
    description: 'Rich oud deepened with saffron.',
    notes: 'Woody / Rich Oud & Saffron',
    price: 310,
    category: 'atelier-oils',
    scentFamily: 'woody',
    occasion: 'gift-sets',
    image: 'atelier-oud.png',
  },
  {
    name: 'Rose Absolute',
    slug: 'rose-absolute',
    description: 'Damask rose balanced with cedar.',
    notes: 'Floral / Damask Rose & Cedar',
    price: 205,
    category: 'private-reserve',
    scentFamily: 'floral',
    occasion: 'birthday',
    image: 'rose-absolute.png',
  },
]

async function ensureTaxonomy(type: string, title: string, slug: string) {
  const existingId = await client.fetch<string | null>(
    `*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    {type, slug},
  )

  if (existingId) return existingId

  const created = await client.create({
    _type: type,
    title,
    slug: {_type: 'slug', current: slug},
  })

  return created._id
}

async function uploadProductImage(filename: string) {
  const imagePath = resolve(publicImagesPath, filename)

  if (!existsSync(imagePath)) {
    throw new Error(`Missing product image: ${imagePath}`)
  }

  const asset = await client.assets.upload('image', createReadStream(imagePath), {
    filename,
  })

  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function seed() {
  const ids = new Map<string, string>()

  for (const [type, items] of Object.entries(taxonomies)) {
    for (const item of items) {
      const id = await ensureTaxonomy(type, item.title, item.slug)
      ids.set(`${type}:${item.slug}`, id)
      console.log(`${type} ${item.slug} -> ${id}`)
    }
  }

  for (const product of products) {
    const existingId = await client.fetch<string | null>(
      `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
      {slug: product.slug},
    )

    if (existingId) {
      const hasImages = await client.fetch<boolean>(
        `defined(*[_id == $id][0].images[0])`,
        {id: existingId},
      )

      if (!hasImages) {
        const image = await uploadProductImage(product.image)
        await client.patch(existingId).set({images: [image]}).commit()
        console.log(`product ${product.slug} images added -> ${existingId}`)
      }

      console.log(`product ${product.slug} already exists -> ${existingId}`)
      continue
    }

    const categoryId = ids.get(`category:${product.category}`)
    const scentFamilyId = ids.get(`scentFamily:${product.scentFamily}`)
    const occasionId = ids.get(`occasion:${product.occasion}`)

    if (!categoryId || !scentFamilyId || !occasionId) {
      throw new Error(`Missing taxonomy for ${product.slug}`)
    }

    const image = await uploadProductImage(product.image)
    const created = await client.create({
      _type: 'product',
      name: product.name,
      slug: {_type: 'slug', current: product.slug},
      description: product.description,
      notes: product.notes,
      price: product.price,
      category: {_type: 'reference', _ref: categoryId},
      scentFamily: {_type: 'reference', _ref: scentFamilyId},
      occasion: {_type: 'reference', _ref: occasionId},
      images: [image],
      options: [],
    })

    console.log(`product ${product.slug} -> ${created._id}`)
  }
}

seed().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
