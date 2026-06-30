// Thông tin thương hiệu & liên kết liên hệ — thay bằng thông tin thật khi go-live.
export const SITE = {
  name: 'LUXE',
  fullName: 'LUXE Furniture',
  tagline: 'Timeless design for modern living',
  phone: '0123 456 789',
  zaloUrl: 'https://zalo.me/0123456789',
  messengerUrl: 'https://m.me/luxefurniture',
  email: 'hello@luxefurniture.vn',
  address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    pinterest: 'https://pinterest.com',
  },
}

// CTA "Mua ngay" trỏ ra ngoài (Zalo) vì giai đoạn này chưa có cart/checkout thật.
export const BUY_URL = SITE.zaloUrl
