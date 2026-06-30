import 'dotenv/config'
import { prisma } from '../src/db.js'
import { CATEGORIES, PRODUCTS } from '../../src/data/products.js'

async function main() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name, image: category.image },
      create: { id: category.id, name: category.name, image: category.image },
    })
  }

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        categoryId: product.category,
        material: product.material,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        rating: product.rating ?? 0,
        ratingCount: product.ratingCount ?? 0,
        badge: product.badge ?? null,
        image: product.image,
        imageHover: product.imageHover ?? null,
        bestseller: !!product.bestseller,
        newArrival: !!product.newArrival,
      },
      create: {
        id: product.id,
        name: product.name,
        categoryId: product.category,
        material: product.material,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        rating: product.rating ?? 0,
        ratingCount: product.ratingCount ?? 0,
        badge: product.badge ?? null,
        image: product.image,
        imageHover: product.imageHover ?? null,
        bestseller: !!product.bestseller,
        newArrival: !!product.newArrival,
      },
    })
  }

  console.log(`Seed xong: ${CATEGORIES.length} danh mục, ${PRODUCTS.length} sản phẩm`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
