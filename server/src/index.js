import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { productsRouter } from './routes/products.js'
import { categoriesRouter } from './routes/categories.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Lỗi máy chủ' })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API server đang chạy tại http://localhost:${port}`))
