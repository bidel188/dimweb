const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

function getToken() {
  return localStorage.getItem('dim_admin_token')
}

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...(body != null ? { body: JSON.stringify(body) } : {}),
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Lỗi máy chủ')
  return data
}

export const api = {
  // Auth
  login: (email, password) => req('POST', '/auth/login', { email, password }),
  me: () => req('GET', '/auth/me'),

  // Products
  getProducts: (params = {}) => req('GET', '/products?' + new URLSearchParams(params)),
  getProduct: (id) => req('GET', `/products/${id}`),
  createProduct: (data) => req('POST', '/products', data),   // data.images = string[]
  updateProduct: (id, data) => req('PUT', `/products/${id}`, data), // data.images = string[] | undefined
  deleteProduct: (id) => req('DELETE', `/products/${id}`),

  // Categories
  getCategories: () => req('GET', '/categories'),
  createCategory: (data) => req('POST', '/categories', data),
  updateCategory: (id, data) => req('PUT', `/categories/${id}`, data),
  deleteCategory: (id) => req('DELETE', `/categories/${id}`),

  // Sets
  getSets: () => req('GET', '/sets'),
  getSet: (id) => req('GET', `/sets/${id}`),
  createSet: (data) => req('POST', '/sets', data),
  updateSet: (id, data) => req('PUT', `/sets/${id}`, data),
  deleteSet: (id) => req('DELETE', `/sets/${id}`),
  addProductToSet: (setId, productId) => req('POST', `/sets/${setId}/products`, { productId }),
  removeProductFromSet: (setId, productId) => req('DELETE', `/sets/${setId}/products/${productId}`),
  reorderSetProducts: (setId, items) => req('PATCH', `/sets/${setId}/products/reorder`, { items }),
}
