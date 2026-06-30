import { Router } from 'express'
import { prisma } from '../db.js'

export const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
  const { category, bestseller, newArrival } = req.query
  const where = {
    ...(category ? { categoryId: category } : {}),
    ...(bestseller !== undefined ? { bestseller: bestseller === 'true' } : {}),
    ...(newArrival !== undefined ? { newArrival: newArrival === 'true' } : {}),
  }
  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(products)
})

productsRouter.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  })
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' })
  res.json(product)
})

productsRouter.post('/', async (req, res) => {
  const {
    id, name, categoryId, material, price, originalPrice,
    rating, ratingCount, badge, image, imageHover, bestseller, newArrival,
  } = req.body

  if (!id || !name || !categoryId || !material || price == null || !image) {
    return res.status(400).json({ error: 'id, name, categoryId, material, price, image là bắt buộc' })
  }

  const product = await prisma.product.create({
    data: {
      id, name, categoryId, material, price, originalPrice,
      rating, ratingCount, badge, image, imageHover,
      bestseller: !!bestseller, newArrival: !!newArrival,
    },
  })
  res.status(201).json(product)
})

productsRouter.put('/:id', async (req, res) => {
  const {
    name, categoryId, material, price, originalPrice,
    rating, ratingCount, badge, image, imageHover, bestseller, newArrival,
  } = req.body

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      name, categoryId, material, price, originalPrice,
      rating, ratingCount, badge, image, imageHover, bestseller, newArrival,
    },
  })
  res.json(product)
})

productsRouter.delete('/:id', async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
