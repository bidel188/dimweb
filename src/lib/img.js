// Helper tạo URL ảnh Unsplash với kích thước/chất lượng tối ưu theo nhu cầu hiển thị.
export const img = (id, w = 1200, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`
