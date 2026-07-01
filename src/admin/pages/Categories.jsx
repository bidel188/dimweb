import { useEffect, useState } from 'react'
import { api } from '../api.js'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const EMPTY = { id: '', name: '', image: '' }

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await api.getCategories()
    setCategories(data)
  }

  async function handleDelete(id) {
    if (!confirm('Xóa danh mục này? Các sản phẩm thuộc danh mục sẽ không bị xóa.')) return
    try {
      await api.deleteCategory(id)
      setCategories(cs => cs.filter(c => c.id !== id))
      toast.success('Đã xóa danh mục')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleSave(form) {
    try {
      if (modal.mode === 'create') {
        const created = await api.createCategory(form)
        setCategories(cs => [...cs, created])
        toast.success('Đã thêm danh mục')
      } else {
        const updated = await api.updateCategory(form.id, form)
        setCategories(cs => cs.map(c => c.id === updated.id ? updated : c))
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
        <h1 className="text-xl font-semibold text-gray-900">Danh mục</h1>
        <button
          onClick={() => setModal({ mode: 'create', data: { ...EMPTY } })}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={15} /> Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
            <div className="relative h-36 bg-gray-100">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setModal({ mode: 'edit', data: { ...c } })}
                  className="p-1.5 bg-white rounded-lg text-gray-600 hover:text-gray-900 shadow"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 bg-white rounded-lg text-gray-600 hover:text-red-600 shadow"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="font-medium text-gray-900 text-sm">{c.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">ID: {c.id}</div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <CategoryModal
          mode={modal.mode}
          data={modal.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

function CategoryModal({ mode, data, onSave, onClose }) {
  const [form, setForm] = useState(data)
  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {mode === 'create' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
        </h2>
        <div className="space-y-3">
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug) <span className="text-red-400">*</span></label>
              <input value={form.id} onChange={set('id')} placeholder="sofa" className={input} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên <span className="text-red-400">*</span></label>
            <input value={form.name} onChange={set('name')} className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh (URL) <span className="text-red-400">*</span></label>
            <input value={form.image} onChange={set('image')} className={input} />
            {form.image && (
              <img src={form.image} alt="" className="mt-2 h-24 w-full object-cover rounded-lg bg-gray-100" />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Hủy</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
            {mode === 'create' ? 'Thêm' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

const input = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
