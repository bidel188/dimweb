# Dim — Tài liệu dự án (cập nhật 2026-07-01)

## Tổng quan

Storefront nội thất / trang trí "Dim" — React + Vite frontend kết hợp Node/Express/Prisma/PostgreSQL backend. Admin panel quản lý toàn bộ nội dung.

**Repo:** https://github.com/bidel188/dimweb.git  
**Branch chính:** `master`

---

## Khởi động dự án

```bash
# 1. Khởi động PostgreSQL (Docker)
docker compose up -d          # root project

# 2. Khởi động backend API
cd server
npm run dev                   # http://localhost:4000

# 3. Khởi động frontend
cd ..                         # root project
npm run dev                   # http://localhost:5173
```

**Admin panel:** http://localhost:5173/admin  
**Storefront:** http://localhost:5173

---

## Cấu trúc thư mục

```
Dim/
├── docker-compose.yml          # PostgreSQL 16-alpine
├── package.json                # Frontend deps (React 19 + Vite 8)
├── src/
│   ├── main.jsx                # Entry — tách admin vs storefront bằng pathname
│   ├── App.jsx                 # Storefront root
│   ├── context/
│   │   └── AppContext.jsx      # Fetch products + categories từ API; wishlist; quickView state
│   ├── components/             # Storefront components
│   │   ├── ProductCard.jsx
│   │   ├── QuickViewModal.jsx  # Gallery ảnh với thumbnail strip + prev/next
│   │   ├── AllProducts.jsx
│   │   ├── BestSellers.jsx
│   │   ├── NewArrivals.jsx
│   │   ├── Categories.jsx
│   │   ├── Footer.jsx
│   │   └── ShopTheLookModal.jsx
│   ├── data/
│   │   ├── products.js         # formatPrice helper (dữ liệu tĩnh đã bị thay bằng API)
│   │   └── site.js             # BUY_URL và hằng số site
│   └── admin/
│       ├── AuthContext.jsx     # JWT admin auth (localStorage: dim_admin_token)
│       ├── AdminApp.jsx        # Routes /admin/*
│       ├── api.js              # API client (fetch wrapper, Bearer token)
│       ├── components/
│       │   ├── Layout.jsx      # Sidebar nav + logout
│       │   ├── ImageUpload.jsx # Upload đơn (dùng cho category)
│       │   └── MultiImageUpload.jsx  # Upload nhiều ảnh (dùng cho product)
│       └── pages/
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── Products.jsx    # CRUD sản phẩm + toggle bestseller/newArrival
│           ├── Categories.jsx  # CRUD danh mục
│           └── Sets.jsx        # CRUD set + thêm/xóa/reorder sản phẩm trong set
└── server/
    ├── .env                    # DATABASE_URL, PORT, JWT_SECRET
    ├── package.json            # Backend deps (Express 5, Prisma 7, bcryptjs, jwt)
    ├── prisma/
    │   ├── schema.prisma       # Prisma schema (xem bên dưới)
    │   └── seed.js             # Seed 6 danh mục + 12 sản phẩm mẫu
    └── src/
        ├── index.js            # Express app, CORS, routes
        ├── db.js               # PrismaClient với @prisma/adapter-pg
        └── routes/
            ├── auth.js         # POST /login, GET /me, POST /setup
            ├── products.js     # CRUD + images[]
            ├── categories.js   # CRUD
            └── sets.js         # CRUD + product management (protected)
```

---

## Stack kỹ thuật

| Layer | Công nghệ | Version |
|---|---|---|
| Frontend | React | 19 |
| Build tool | Vite | 8 |
| CSS | Tailwind CSS | 4 |
| Routing (FE) | React Router DOM | 7 |
| Animation | Framer Motion | 12 |
| Icons | Lucide React | 1.22 |
| Toast | react-hot-toast | 2.6 |
| Backend | Node.js + Express | 5 |
| ORM | Prisma | 7.8 |
| Database | PostgreSQL | 16 |
| Auth | JWT (jsonwebtoken) + bcryptjs | — |
| Image storage | Cloudinary (unsigned upload) | — |
| DB adapter | @prisma/adapter-pg | 7.8 |

---

## Cấu hình môi trường

### `server/.env`
```env
DATABASE_URL="postgresql://dim:dim_dev_password@localhost:5432/dim_db?schema=public"
PORT=4000
JWT_SECRET="dim_admin_super_secret_2026"
```

### Docker PostgreSQL (`docker-compose.yml`)
```
user: dim | password: dim_dev_password | db: dim_db | port: 5432
volume: dim_pgdata
```

### Cloudinary
```
Cloud name: dnmtragmg
Upload preset: dim_cloud_image  (unsigned)
```

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"        // phải dùng "prisma-client-js", KHÔNG phải "prisma-client"
  output   = "../src/generated/prisma" // output JS compiled, không phải TS
}

datasource db {
  provider = "postgresql"
  // URL KHÔNG đặt ở đây — Prisma 7 lấy từ prisma.config.ts hoặc .env qua dotenv
}

model Category { id, name, image }
model Product   { id, name, categoryId, material, price, originalPrice?,
                  rating, ratingCount, badge?, image (thumbnail),
                  bestseller, newArrival, createdAt, updatedAt,
                  images ProductImage[], setProducts SetProduct[] }
model ProductImage { id, productId, url, order }  // onDelete: Cascade
model ProductSet   { id, name, description?, image?, setProducts SetProduct[] }
model SetProduct   { setId, productId, order }     // @@id composite, onDelete: Cascade
model AdminUser    { id, email @unique, password, name?, createdAt }
```

**Lưu ý thiết kế ảnh sản phẩm:**
- `Product.image` = thumbnail (ảnh đầu tiên) — dùng cho list view, không cần JOIN
- `Product.images[]` (ProductImage) = gallery đầy đủ — dùng cho QuickView / detail page
- `images[0]` = ảnh chính, `images[1]` = ảnh hover trên card

---

## API Endpoints

**Base URL:** `http://localhost:4000/api`

### Auth (không cần token)
| Method | Path | Body | Mô tả |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | Trả `{ token, admin }` |
| GET | `/auth/me` | — | Trả admin từ token |
| POST | `/auth/setup` | `{ email, password, name }` | Tạo admin đầu tiên (chỉ khi chưa có) |

### Products (GET public, POST/PUT/DELETE cần token)
| Method | Path | Mô tả |
|---|---|---|
| GET | `/products` | Tất cả sản phẩm (query: `category`, `bestseller`, `newArrival`) |
| GET | `/products/:id` | Chi tiết 1 sản phẩm |
| POST | `/products` | Tạo mới — body: `{ name, categoryId, material, price, images: string[] }` |
| PUT | `/products/:id` | Cập nhật — nếu có `images[]` thì xóa cũ tạo lại |
| DELETE | `/products/:id` | Xóa (cascade ProductImage) |

Response Product luôn có: `category` (object), `images` (mảng `{ id, url, order }`)

### Categories
| Method | Path | Body |
|---|---|---|
| GET | `/categories` | — |
| POST | `/categories` | `{ name, image }` |
| PUT | `/categories/:id` | `{ name, image }` |
| DELETE | `/categories/:id` | — |

### Sets (tất cả cần token)
| Method | Path | Body |
|---|---|---|
| GET | `/sets` | — |
| POST | `/sets` | `{ name, description?, image? }` |
| PUT | `/sets/:id` | `{ name, description?, image? }` |
| DELETE | `/sets/:id` | — |
| POST | `/sets/:id/products` | `{ productId }` |
| DELETE | `/sets/:id/products/:productId` | — |
| PATCH | `/sets/:id/products/reorder` | `{ items: [{ productId, order }] }` |

---

## Luồng upload ảnh (Cloudinary)

**Pattern: blob preview local → upload lên cloud chỉ khi save form**

```
User chọn file
  → URL.createObjectURL(file) tạo blob URL
  → hiển thị preview ngay
  → File object lưu trong state (pendingFiles[])

User nhấn Lưu
  → uploadToCloudinary(file) gọi Cloudinary API
  → nhận secure_url
  → gửi mảng URL lên backend API
```

`uploadToCloudinary(file)` — export từ `src/admin/components/ImageUpload.jsx`

---

## Admin Panel

**URL:** `/admin` (tách khỏi storefront bằng `window.location.pathname.startsWith('/admin')` trong `main.jsx`)

**Token lưu ở:** `localStorage['dim_admin_token']`

| Route | Component | Tính năng |
|---|---|---|
| `/admin/login` | Login.jsx | Form đăng nhập |
| `/admin` | Dashboard.jsx | Thống kê tổng quan |
| `/admin/products` | Products.jsx | Bảng CRUD + toggle Bestseller/NewArrival + MultiImageUpload |
| `/admin/categories` | Categories.jsx | Grid card + modal CRUD + ImageUpload |
| `/admin/sets` | Sets.jsx | 2 panel: list set + panel thêm/xóa/reorder sản phẩm |

**Tạo admin đầu tiên:**
```bash
curl -X POST http://localhost:4000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dim.vn","password":"your_password","name":"Admin"}'
```

---

## Storefront — Kết nối API

`AppContext.jsx` fetch `products` + `categories` từ API khi mount. Tất cả component dùng `useApp()` hook:

```js
const { products, categories, loadingData, quickViewProduct, setQuickViewProduct, toggleWishlist, isWishlisted } = useApp()
```

| Component | Dữ liệu dùng |
|---|---|
| AllProducts | `products`, `categories` — filter theo `p.categoryId` |
| BestSellers | `products.filter(p => p.bestseller)` |
| NewArrivals | `products.filter(p => p.newArrival)` |
| Categories | `categories` |
| Footer | `categories` |
| ProductCard | `product.images[0].url` (main), `images[1].url` (hover) |
| QuickViewModal | `product.images[]` → gallery với thumbnail strip + prev/next |
| ShopTheLookModal | `products` |

---

## Lệnh Prisma thường dùng

```bash
cd server

# Sau khi sửa schema
npx prisma generate          # tái sinh Prisma Client

# Đồng bộ schema lên DB (dev)
npx prisma db push           # không tạo migration file
npx prisma db push --accept-data-loss  # khi có drop column

# Chạy seed
node prisma/seed.js

# GUI xem database
npx prisma studio            # http://localhost:5555
```

---

## Các lỗi đã gặp & cách sửa

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| `url is required` datasource | Prisma 7 không đặt URL trong schema | Xóa `url = env(...)` khỏi datasource block |
| Generator `prisma-client` output `.ts` | Provider sai | Dùng `provider = "prisma-client-js"` |
| `id is missing` khi tạo sản phẩm | Prisma Client cũ (trước khi có `@default(cuid())`) | Chạy `npx prisma generate` rồi restart server |
| `prisma migrate dev` hỏi confirmation | Drop column có data cần xác nhận | Dùng `npx prisma db push --accept-data-loss` |
| Seed thất bại vì import `../lib/img` | ESM Node không resolve alias của Vite | Inline data vào seed.js, không import từ src/ |
| Upload Cloudinary thất bại | Tên preset sai | Preset phải là `dim_cloud_image` (đúng với Cloudinary dashboard) |
| Storefront không hiển thị sản phẩm mới | Component dùng data tĩnh | Dùng AppContext fetch từ API |
| `p.category` undefined khi filter | API trả `categoryId` không phải `category` (string) | Filter bằng `p.categoryId` |

---

## Tính năng đã hoàn thành

- [x] Storefront: Hero, Categories, BestSellers, NewArrivals, AllProducts, ShopTheLook, Footer
- [x] Storefront kết nối API thay vì dữ liệu tĩnh
- [x] ProductCard: hover image, wishlist, quick view button
- [x] QuickViewModal: gallery ảnh nhiều tấm với thumbnail strip
- [x] PostgreSQL + Prisma + Express API
- [x] Admin auth (JWT 7 ngày)
- [x] Admin Dashboard
- [x] Admin Products: CRUD + toggle Bestseller/NewArrival + MultiImageUpload
- [x] Admin Categories: CRUD + ImageUpload
- [x] Admin Sets: CRUD + thêm/xóa/reorder sản phẩm
- [x] Cloudinary upload (unsigned, deferred — chỉ upload khi save)
- [x] Auto-generate ID bằng `cuid()` cho tất cả models
- [x] ProductImage gallery (nhiều ảnh/sản phẩm, có thứ tự)
- [x] Migration data cũ: 13 sản phẩm seeded đã có ProductImage records

---

## Gợi ý tính năng tiếp theo

- [ ] Trang chi tiết sản phẩm `/products/:id` (gallery lớn hơn, mô tả, đánh giá)
- [ ] Giỏ hàng (Cart) — context + local storage
- [ ] Trang thanh toán / liên hệ đặt mua
- [ ] Trang `/shop` riêng với pagination + filter + sort
- [ ] Trang `/sets/:id` hiển thị set sản phẩm trên storefront
- [ ] Admin: thêm mô tả sản phẩm dài (rich text)
- [ ] Admin: drag-and-drop reorder ảnh trong MultiImageUpload
- [ ] Admin: quản lý đơn hàng / liên hệ
- [ ] Deploy: Railway/Render (backend) + Vercel (frontend)
- [ ] Tách `http://localhost:4000` thành biến env `VITE_API_URL`
