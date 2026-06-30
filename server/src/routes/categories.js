import { Router } from 'express'
import { prisma } from '../db.js'

export const categoriesRouter = Router()

categoriesRouter.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  res.json(categories)
})

categoriesRouter.post('/', async (req, res) => {
  const { id, name, image } = req.body
  if (!id || !name || !image) {
    return res.status(400).json({ error: 'id, name, image là bắt buộc' })
  }
  const category = await prisma.category.create({ data: { id, name, image } })
  res.status(201).json(category)
})

categoriesRouter.put('/:id', async (req, res) => {
  const { name, image } = req.body
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name, image },
  })
  res.json(category)
})

categoriesRouter.delete('/:id', async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
