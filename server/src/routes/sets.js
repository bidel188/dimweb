import { Router } from 'express'
import { prisma } from '../db.js'
import { requireAuth } from './auth.js'

export const setsRouter = Router()

// Tất cả routes sets đều cần đăng nhập
setsRouter.use(requireAuth)

setsRouter.get('/', async (req, res) => {
  const sets = await prisma.productSet.findMany({
    include: {
      setProducts: {
        include: { product: true },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(sets)
})

setsRouter.get('/:id', async (req, res) => {
  const set = await prisma.productSet.findUnique({
    where: { id: req.params.id },
    include: {
      setProducts: {
        include: { product: { include: { category: true } } },
        orderBy: { order: 'asc' },
      },
    },
  })
  if (!set) return res.status(404).json({ error: 'Không tìm thấy set' })
  res.json(set)
})

setsRouter.post('/', async (req, res) => {
  const { name, description, image } = req.body
  if (!name) return res.status(400).json({ error: 'Tên set là bắt buộc' })
  const set = await prisma.productSet.create({ data: { name, description, image } })
  res.status(201).json(set)
})

setsRouter.put('/:id', async (req, res) => {
  const { name, description, image } = req.body
  const set = await prisma.productSet.update({
    where: { id: req.params.id },
    data: { name, description, image },
  })
  res.json(set)
})

setsRouter.delete('/:id', async (req, res) => {
  await prisma.productSet.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

// Thêm sản phẩm vào set
setsRouter.post('/:id/products', async (req, res) => {
  const { productId, order } = req.body
  if (!productId) return res.status(400).json({ error: 'productId là bắt buộc' })
  const item = await prisma.setProduct.create({
    data: { setId: req.params.id, productId, order: order ?? 0 },
    include: { product: true },
  })
  res.status(201).json(item)
})

// Xóa sản phẩm khỏi set
setsRouter.delete('/:id/products/:productId', async (req, res) => {
  await prisma.setProduct.delete({
    where: { setId_productId: { setId: req.params.id, productId: req.params.productId } },
  })
  res.status(204).end()
})

// Cập nhật thứ tự sản phẩm trong set
setsRouter.patch('/:id/products/reorder', async (req, res) => {
  const { items } = req.body // [{ productId, order }]
  await Promise.all(
    items.map(({ productId, order }) =>
      prisma.setProduct.update({
        where: { setId_productId: { setId: req.params.id, productId } },
        data: { order },
      })
    )
  )
  res.json({ ok: true })
})
