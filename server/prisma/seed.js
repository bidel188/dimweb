import 'dotenv/config'
import { prisma } from '../src/db.js'

const img = (id, w = 1200, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`

const CATEGORIES = [
  { id: 'sofa', name: 'Sofa', image: img('1555041469-a586c61ea9bc', 600) },
  { id: 'bed', name: 'Phòng ngủ', image: img('1505843513577-22bb7d21e455', 600) },
  { id: 'table', name: 'Bàn', image: img('1592078615290-033ee584e267', 600) },
  { id: 'chair', name: 'Ghế', image: img('1567016432779-094069958ea5', 600) },
  { id: 'lighting', name: 'Đèn', image: img('1540932239986-30128078f3c5', 600) },
  { id: 'decor', name: 'Trang trí', image: img('1581291518633-83b4ebd1d83e', 600) },
]

const PRODUCTS = [
  {
    id: 'sofa-velvet-aurora',
    name: 'Sofa Velvet Aurora',
    category: 'sofa',
    material: 'Vải nhung, khung gỗ sồi',
    price: 18900000,
    originalPrice: 22500000,
    rating: 4.8,
    ratingCount: 124,
    badge: 'Bán chạy',
    image: img('1538688525198-9b88f6f53126'),
    imageHover: img('1524758631624-e2822e304c36'),
    bestseller: true,
  },
  {
    id: 'ghe-banh-moc-lounge',
    name: 'Ghế Bành Mộc Lounge',
    category: 'chair',
    material: 'Da thuộc, chân gỗ óc chó',
    price: 7450000,
    originalPrice: null,
    rating: 4.6,
    ratingCount: 58,
    badge: 'Mới',
    image: img('1567538096630-e0c55bd6374c'),
    imageHover: img('1581539250439-c96689b516dd'),
    newArrival: true,
  },
  {
    id: 'giuong-haven-oak',
    name: 'Giường Ngủ Haven Oak',
    category: 'bed',
    material: 'Gỗ sồi tự nhiên',
    price: 24200000,
    originalPrice: null,
    rating: 4.9,
    ratingCount: 76,
    badge: null,
    image: img('1505843513577-22bb7d21e455'),
    imageHover: img('1494203484021-3c454daf695d'),
    bestseller: true,
  },
  {
    id: 'ban-tra-stonewood',
    name: 'Bàn Trà Stonewood',
    category: 'table',
    material: 'Đá marble, chân kim loại',
    price: 5890000,
    originalPrice: 6990000,
    rating: 4.5,
    ratingCount: 41,
    badge: 'Sale',
    image: img('1592078615290-033ee584e267'),
    imageHover: img('1617104551722-3b2d51366400'),
  },
  {
    id: 'den-san-amber-glow',
    name: 'Đèn Sàn Amber Glow',
    category: 'lighting',
    material: 'Đồng thau, vải lanh',
    price: 3250000,
    originalPrice: null,
    rating: 4.7,
    ratingCount: 33,
    badge: 'Mới',
    image: img('1540932239986-30128078f3c5'),
    imageHover: img('1513506003901-1e6a229e2d15'),
    newArrival: true,
  },
  {
    id: 'ghe-don-nordic-tan',
    name: 'Ghế Đơn Nordic Tan',
    category: 'chair',
    material: 'Da lộn, khung gỗ tần bì',
    price: 6120000,
    originalPrice: null,
    rating: 4.4,
    ratingCount: 29,
    badge: null,
    image: img('1631679706909-1844bbd07221'),
    imageHover: img('1567016432779-094069958ea5'),
  },
  {
    id: 'ban-an-linear-walnut',
    name: 'Bàn Ăn Linear Walnut',
    category: 'table',
    material: 'Gỗ óc chó nguyên khối',
    price: 16750000,
    originalPrice: null,
    rating: 4.9,
    ratingCount: 67,
    badge: 'Bán chạy',
    image: img('1617104551722-3b2d51366400'),
    imageHover: img('1592078615290-033ee584e267'),
    bestseller: true,
  },
  {
    id: 'tu-ao-modular-noir',
    name: 'Tủ Áo Modular Noir',
    category: 'bed',
    material: 'Gỗ công nghiệp phủ melamine',
    price: 19400000,
    originalPrice: null,
    rating: 4.6,
    ratingCount: 22,
    badge: null,
    image: img('1556020685-ae41abfc9365'),
    imageHover: img('1505843513577-22bb7d21e455'),
  },
  {
    id: 'binh-trang-tri-terra',
    name: 'Bình Trang Trí Terra',
    category: 'decor',
    material: 'Gốm tráng men',
    price: 890000,
    originalPrice: null,
    rating: 4.3,
    ratingCount: 18,
    badge: 'Mới',
    image: img('1581291518633-83b4ebd1d83e'),
    imageHover: img('1610701596007-11502861dcfa'),
    newArrival: true,
  },
  {
    id: 'ban-lam-viec-studio-desk',
    name: 'Bàn Làm Việc Studio Desk',
    category: 'table',
    material: 'Gỗ sồi, chân thép sơn tĩnh điện',
    price: 8300000,
    originalPrice: null,
    rating: 4.7,
    ratingCount: 39,
    badge: 'Mới',
    image: img('1518455027359-f3f8164ba6bd'),
    imageHover: img('1499933374294-4584851497cc'),
    newArrival: true,
  },
  {
    id: 'sofa-doi-cloud-linen',
    name: 'Sofa Đôi Cloud Linen',
    category: 'sofa',
    material: 'Vải linen, đệm foam cao cấp',
    price: 21500000,
    originalPrice: 25000000,
    rating: 4.8,
    ratingCount: 91,
    badge: 'Sale',
    image: img('1524758631624-e2822e304c36'),
    imageHover: img('1538688525198-9b88f6f53126'),
    bestseller: true,
  },
  {
    id: 'den-ban-brass-studio',
    name: 'Đèn Bàn Brass Studio',
    category: 'lighting',
    material: 'Đồng thau nguyên khối',
    price: 2180000,
    originalPrice: null,
    rating: 4.5,
    ratingCount: 15,
    badge: null,
    image: img('1565538810643-b5bdb714032a'),
    imageHover: img('1513506003901-1e6a229e2d15'),
  },
]

async function main() {
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, image: cat.image },
      create: { id: cat.id, name: cat.name, image: cat.image },
    })
  }

  for (const p of PRODUCTS) {
    const imgs = [p.image, p.imageHover].filter(Boolean)
    const base = {
      name: p.name, categoryId: p.category, material: p.material,
      price: p.price, originalPrice: p.originalPrice ?? null,
      rating: p.rating ?? 0, ratingCount: p.ratingCount ?? 0,
      badge: p.badge ?? null, image: p.image,
      bestseller: !!p.bestseller, newArrival: !!p.newArrival,
    }
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        ...base,
        images: {
          deleteMany: {},
          create: imgs.map((url, order) => ({ url, order })),
        },
      },
      create: {
        id: p.id, ...base,
        images: { create: imgs.map((url, order) => ({ url, order })) },
      },
    })
  }

  console.log(`Seed xong: ${CATEGORIES.length} danh mục, ${PRODUCTS.length} sản phẩm`)
}

main()
  .catch((err) => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
