# Dim Admin Server

Backend API (Express + Prisma + PostgreSQL) cho chức năng admin quản lý sản phẩm.

## Yêu cầu

- Docker Desktop đang chạy (để khởi động Postgres qua `docker-compose.yml` ở thư mục gốc)
- Node.js

## Setup lần đầu

```bash
# 1. Từ thư mục gốc của repo, khởi động Postgres
docker compose up -d

# 2. Cài dependencies
cd server
npm install

# 3. Copy biến môi trường (đã có sẵn .env mặc định khớp docker-compose)
cp .env.example .env   # nếu .env chưa tồn tại

# 4. Tạo bảng trong database
npm run prisma:migrate -- --name init

# 5. Seed dữ liệu mẫu từ src/data/products.js
npm run prisma:seed
```

## Chạy server

```bash
npm run dev
```

API chạy tại `http://localhost:4000`.

## Các endpoint chính

- `GET /api/products` — danh sách sản phẩm (filter qua query `?category=&bestseller=&newArrival=`)
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

## Xem dữ liệu trực quan

```bash
npm run prisma:studio
```
