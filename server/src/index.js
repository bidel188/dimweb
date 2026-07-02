import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { productsRouter } from './routes/products.js'
import { categoriesRouter } from './routes/categories.js'
import { setsRouter } from './routes/sets.js'
import { authRouter } from './routes/auth.js'
import { requireAuth } from './routes/auth.js'

const app = express()

const corsOrigin = process.env.CORS_ORIGIN
app.use(cors({ origin: corsOrigin ? corsOrigin.split(',') : true }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/sets', setsRouter)

// Protected admin routes
app.use('/api/admin/products', requireAuth, productsRouter)
app.use('/api/admin/categories', requireAuth, categoriesRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Lỗi máy chủ' })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API server đang chạy tại http://localhost:${port}`))
