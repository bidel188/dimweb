import { useEffect, useState } from 'react'
import { api } from '../api.js'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Search, ChevronRight } from 'lucide-react'
import ImageUpload from '../components/ImageUpload.jsx'

export default function Sets() {
  const [sets, setSets] = useState([])
  const [selected, setSelected] = useState(null) // set đang xem/sửa sản phẩm
  const [modal, setModal] = useState(null) // create/edit set info

  useEffect(() => { load() }, [])

  async function load() {
    const data = await api.getSets()
    setSets(data)
  }

  async function handleDeleteSet(id) {
    if (!confirm('Xóa set này?')) return
    try {
      await api.deleteSet(id)
      setSets(ss => ss.filter(s => s.id !== id))
      if (selected?.id === id) setSelected(null)
      toast.success('Đã xóa set')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleSaveSet(form) {
    try {
      if (modal.mode === 'create') {
        const created = await api.createSet(form)
        setSets(ss => [{ ...created, setProducts: [] }, ...ss])
        toast.success('Đã tạo set')
      } else {
        const updated = await api.updateSet(form.id, form)
        setSets(ss => ss.map(s => s.id === updated.id ? { ...s, ...updated } : s))
        toast.success('Đã cập nhật')
      }
      setModal(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleOpenSet(set) {
    const detail = await api.getSet(set.id)
    setSelected(detail)
  }

  async function handleRemoveProduct(setId, productId) {
    try {
      await api.removeProductFromSet(setId, productId)
      setSelected(s => ({ ...s, setProducts: s.setProducts.filter(sp => sp.productId !== productId) }))
      setSets(ss => ss.map(s => s.id === setId
        ? { ...s, setProducts: s.setProducts.filter(sp => sp.productId !== productId) }
        : s))
      toast.success('Đã xóa khỏi set')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleAddProduct(setId, productId) {
    try {
      const item = await api.addProductToSet(setId, productId)
      setSelected(s => ({ ...s, setProducts: [...s.setProducts, item] }))
      setSets(ss => ss.map(s => s.id === setId
        ? { ...s, setProducts: [...s.setProducts, item] }
        : s))
      toast.success('Đã thêm vào set')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Set sản phẩm</h1>
        <button
          onClick={() => setModal({ mode: 'create', data: { name: '', description: '', image: '' } })}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={15} /> Tạo set mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Danh sách set */}
        <div className="space-y-3">
          {sets.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
              Chưa có set nào. Tạo set đầu tiên!
            </div>
          )}
          {sets.map(s => (
            <div
              key={s.id}
              onClick={() => handleOpenSet(s)}
              className={`bg-white rounded-xl border cursor-pointer transition-colors ${
                selected?.id === s.id ? 'border-gray-900' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {s.image ? (
                  <img src={s.image} alt={s.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-xl">□</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                  {s.description && <div className="text-xs text-gray-400 mt-0.5 truncate">{s.description}</div>}
                  <div className="text-xs text-gray-400 mt-1">{s.setProducts.length} sản phẩm</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); setModal({ mode: 'edit', data: { id: s.id, name: s.name, description: s.description || '', image: s.image || '' } }) }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteSet(s.id) }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Panel sản phẩm trong set */}
        {selected && (
          <SetProductPanel
            set={selected}
            onRemove={handleRemoveProduct}
            onAdd={handleAddProduct}
            onClose={() => setSelected(null)}
          />
        )}
      </div>

      {modal && (
        <SetModal mode={modal.mode} data={modal.data} onSave={handleSaveSet} onClose={() => setModal(null)} />
      )}
    </div>
  )
}

function SetProductPanel({ set, onRemove, onAdd, onClose }) {
  const [allProducts, setAllProducts] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => { api.getProducts().then(setAllProducts) }, [])

  const inSet = new Set(set.setProducts.map(sp => sp.productId))
  const suggestions = allProducts.filter(p =>
    !inSet.has(p.id) && p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl border border-gray-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{set.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{set.setProducts.length} sản phẩm</p>
        </div>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>

      {/* Sản phẩm trong set */}
      <div className="space-y-2 mb-5">
        {set.setProducts.length === 0 && (
          <p className="text-sm text-gray-400 py-3 text-center">Chưa có sản phẩm trong set</p>
        )}
        {set.setProducts.map(sp => (
          <div key={sp.productId} className="flex items-center gap-3 py-2 border-b border-gray-50">
            <img src={sp.product.image} alt={sp.product.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{sp.product.name}</div>
              <div className="text-xs text-gray-400">{sp.product.price.toLocaleString('vi-VN')}₫</div>
            </div>
            <button
              onClick={() => onRemove(set.id, sp.productId)}
              className="p-1 text-gray-300 hover:text-red-500 shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Thêm sản phẩm */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thêm sản phẩm</div>
        <div className="relative mb-2">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {suggestions.slice(0, 10).map(p => (
            <button
              key={p.id}
              onClick={() => onAdd(set.id, p.id)}
              className="flex items-center gap-3 w-full px-2 py-1.5 rounded-lg hover:bg-gray-50 text-left"
            >
              <img src={p.image} alt={p.name} className="w-7 h-7 rounded object-cover bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 truncate">{p.name}</div>
                <div className="text-xs text-gray-400">{p.price.toLocaleString('vi-VN')}₫</div>
              </div>
              <Plus size={13} className="text-gray-400 shrink-0" />
            </button>
          ))}
          {suggestions.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">Không tìm thấy</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SetModal({ mode, data, onSave, onClose }) {
  const [form, setForm] = useState(data)
  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {mode === 'create' ? 'Tạo set mới' : 'Chỉnh sửa set'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên set <span className="text-red-400">*</span></label>
            <input value={form.name} onChange={set('name')} placeholder="Phòng khách tối giản" className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={set('description')} rows={2} className={input} />
          </div>
          <ImageUpload
            label="Ảnh cover"
            value={form.image}
            onChange={url => setForm(f => ({ ...f, image: url }))}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Hủy</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
            {mode === 'create' ? 'Tạo set' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

const input = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
