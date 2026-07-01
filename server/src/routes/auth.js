import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'

export const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dim_admin_secret_change_in_prod'

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' })
  try {
    req.admin = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ' })
  }
}

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'email và password là bắt buộc' })

  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' })

  const ok = await bcrypt.compare(password, admin.password)
  if (!ok) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' })

  const token = jwt.sign({ id: admin.id, email: admin.email, name: admin.name }, JWT_SECRET, {
    expiresIn: '7d',
  })
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json(req.admin)
})

// Tạo admin đầu tiên (chỉ dùng khi chưa có admin nào)
authRouter.post('/setup', async (req, res) => {
  const count = await prisma.adminUser.count()
  if (count > 0) return res.status(403).json({ error: 'Admin đã được tạo' })

  const { email, password, name } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'email và password là bắt buộc' })

  const hashed = await bcrypt.hash(password, 10)
  const admin = await prisma.adminUser.create({ data: { email, password: hashed, name } })
  res.status(201).json({ id: admin.id, email: admin.email, name: admin.name })
})
