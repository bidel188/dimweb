import { Router } from 'express'
import { prisma } from '../db.js'

export const productsRouter = Router()

const includeImages = {
  category: true,
  images: { orderBy: { order: 'asc' } },
}

productsRouter.get('/', async (req, res) => {
  const { category, bestseller, newArrival } = req.query
  const where = {
    ...(category ? { categoryId: category } : {}),
    ...(bestseller !== undefined ? { bestseller: bestseller === 'true' } : {}),
    ...(newArrival !== undefined ? { newArrival: newArrival === 'true' } : {}),
  }
  const products = await prisma.product.findMany({
    where,
    include: includeImages,
    orderBy: { createdAt: 'desc' },
  })
  res.json(products)
})

productsRouter.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: includeImages,
  })
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' })
  res.json(product)
})

productsRouter.get('/:id/related', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } })
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' })

  const LIMIT = 8

  const setLinks = await prisma.setProduct.findMany({
    where: { productId: product.id },
    select: { setId: true },
  })
  const setIds = setLinks.map((s) => s.setId)

  const [bySet, byCategory, byName] = await Promise.all([
    setIds.length
      ? prisma.product.findMany({
          where: { id: { not: product.id }, setProducts: { some: { setId: { in: setIds } } } },
          include: includeImages,
          take: LIMIT,
        })
      : Promise.resolve([]),
    prisma.product.findMany({
      where: { id: { not: product.id }, categoryId: product.categoryId },
      include: includeImages,
      orderBy: { createdAt: 'desc' },
      take: LIMIT,
    }),
    prisma.product.findMany({
      where: {
        id: { not: product.id },
        name: { contains: product.name.split(' ').slice(0, 2).join(' '), mode: 'insensitive' },
      },
      include: includeImages,
      take: LIMIT,
    }),
  ])

  res.json({ bySet, byCategory, byName })
})

productsRouter.post('/', async (req, res) => {
  const {
    name, categoryId, material, price, originalPrice,
    rating, ratingCount, badge, bestseller, newArrival,
    images = [], // mảng URL ảnh
  } = req.body

  if (!name || !categoryId || !material || price == null || images.length === 0) {
    return res.status(400).json({ error: 'name, categoryId, material, price và ít nhất 1 ảnh là bắt buộc' })
  }

  const product = await prisma.product.create({
    data: {
      name, categoryId, material,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      rating: rating ?? 0,
      ratingCount: ratingCount ?? 0,
      badge: badge || null,
      image: images[0], // thumbnail = ảnh đầu
      bestseller: !!bestseller,
      newArrival: !!newArrival,
      images: {
        create: images.map((url, order) => ({ url, order })),
      },
    },
    include: includeImages,
  })
  res.status(201).json(product)
})

productsRouter.put('/:id', async (req, res) => {
  const {
    name, categoryId, material, price, originalPrice,
    rating, ratingCount, badge, bestseller, newArrival,
    images, // undefined = không thay đổi ảnh
  } = req.body

  const data = {
    name, categoryId, material,
    price: price != null ? Number(price) : undefined,
    originalPrice: originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : undefined,
    rating, ratingCount,
    badge: badge ?? null,
    bestseller, newArrival,
  }

  // Nếu có images mới thì xóa cũ và tạo lại
  if (images && images.length > 0) {
    data.image = images[0]
    data.images = {
      deleteMany: {},
      create: images.map((url, order) => ({ url, order })),
    }
  }

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data,
    include: includeImages,
  })
  res.json(product)
})

productsRouter.delete('/:id', async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
