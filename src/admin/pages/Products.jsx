import { useEffect, useState } from 'react'
import { api } from '../api.js'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Star, Sparkles, Search } from 'lucide-react'
import ImageUpload, { uploadToCloudinary } from '../components/ImageUpload.jsx'

const EMPTY = {
  name: '', categoryId: '', material: '',
  price: '', originalPrice: '', badge: '',
  image: '', imageHover: '', bestseller: false, newArrival: false,
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [modal, setModal] = useState(null) // null | { mode: 'create'|'edit', data }

  useEffect(() => {
    load()
    api.getCategories().then(setCategories)
  }, [])

  async function load() {
    const data = await api.getProducts()
    setProducts(data)
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.categoryId === filterCat : true
    return matchSearch && matchCat
  })

  async function handleToggle(product, field) {
    try {
      const updated = await api.updateProduct(product.id, { ...product, [field]: !product[field] })
      setProducts(ps => ps.map(p => p.id === updated.id ? updated : p))
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Xóa sản phẩm này?')) return
    try {
      await api.deleteProduct(id)
      setProducts(ps => ps.filter(p => p.id !== id))
      toast.success('Đã xóa sản phẩm')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleSave(form) {
    try {
      const data = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      }
      if (modal.mode === 'create') {
        const created = await api.createProduct(data)
        setProducts(ps => [created, ...ps])
        toast.success('Đã thêm sản phẩm')
      } else {
        const updated = await api.updateProduct(form.id, data)
        setProducts(ps => ps.map(p => p.id === updated.id ? updated : p))
        toast.success('Đã cập nhật')
      }
      setModal(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Sản phẩm</h1>
        <button
          onClick={() => setModal({ mode: 'create', data: { ...EMPTY } })}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={15} /> Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-5 py-3 text-left">Sản phẩm</th>
              <th className="px-5 py-3 text-left">Danh mục</th>
              <th className="px-5 py-3 text-right">Giá</th>
              <th className="px-5 py-3 text-center">Bán chạy</th>
              <th className="px-5 py-3 text-center">Mới</th>
              <th className="px-5 py-3 text-left">Badge</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100" />
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{p.categoryId}</td>
                <td className="px-5 py-3 text-right text-gray-700">
                  {p.price.toLocaleString('vi-VN')}₫
                </td>
                <td className="px-5 py-3 text-center">
                  <button onClick={() => handleToggle(p, 'bestseller')}
                    className={`p-1 rounded transition-colors ${p.bestseller ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}>
                    <Star size={16} fill={p.bestseller ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="px-5 py-3 text-center">
                  <button onClick={() => handleToggle(p, 'newArrival')}
                    className={`p-1 rounded transition-colors ${p.newArrival ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'}`}>
                    <Sparkles size={16} fill={p.newArrival ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  {p.badge && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{p.badge}</span>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => setModal({ mode: 'edit', data: { ...p, originalPrice: p.originalPrice ?? '' } })}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">Không có sản phẩm</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ProductModal
          mode={modal.mode}
          data={modal.data}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

function ProductModal({ mode, data, categories, onSave, onClose }) {
  const [form, setForm] = useState(data)
  const [files, setFiles] = useState({ image: null, imageHover: null })
  const [saving, setSaving] = useState(false)
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  async function handleSaveClick() {
    setSaving(true)
    try {
      let image = form.image
      let imageHover = form.imageHover
      if (files.image) image = await uploadToCloudinary(files.image)
      if (files.imageHover) imageHover = await uploadToCloudinary(files.imageHover)
      await onSave({ ...form, image, imageHover })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {mode === 'create' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}
        </h2>
        <div className="space-y-3">
          <Field label="Tên sản phẩm" required>
            <input value={form.name} onChange={set('name')} className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Danh mục" required>
              <select value={form.categoryId} onChange={set('categoryId')} className={input}>
                <option value="">-- Chọn --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Badge">
              <input value={form.badge} onChange={set('badge')} placeholder="Mới / Sale / Bán chạy" className={input} />
            </Field>
          </div>
          <Field label="Chất liệu" required>
            <input value={form.material} onChange={set('material')} className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Giá (VND)" required>
              <input type="number" value={form.price} onChange={set('price')} className={input} />
            </Field>
            <Field label="Giá gốc (VND)">
              <input type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="Để trống nếu không có" className={input} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ImageUpload
              label="Ảnh chính *"
              value={form.image}
              onChange={(previewUrl, file) => {
                setForm(f => ({ ...f, image: previewUrl }))
                setFiles(fs => ({ ...fs, image: file }))
              }}
            />
            <ImageUpload
              label="Ảnh hover"
              value={form.imageHover}
              onChange={(previewUrl, file) => {
                setForm(f => ({ ...f, imageHover: previewUrl }))
                setFiles(fs => ({ ...fs, imageHover: file }))
              }}
            />
          </div>
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.bestseller} onChange={set('bestseller')} className="w-4 h-4 accent-gray-900" />
              Bán chạy
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.newArrival} onChange={set('newArrival')} className="w-4 h-4 accent-gray-900" />
              Hàng mới
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Hủy</button>
          <button onClick={handleSaveClick} disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Đang lưu...' : mode === 'create' ? 'Thêm' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const input = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
