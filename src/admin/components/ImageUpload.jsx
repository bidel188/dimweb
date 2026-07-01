import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

// Gọi hàm này khi save form để upload file thật lên Cloudinary
export async function uploadToCloudinary(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', 'dim_cloud_image')
  const res = await fetch('https://api.cloudinary.com/v1_1/dnmtragmg/image/upload', {
    method: 'POST',
    body: form,
  })
  const data = await res.json()
  if (!data.secure_url) throw new Error(data.error?.message || 'Upload thất bại')
  return data.secure_url
}

// onChange(previewUrl, file) — previewUrl là blob URL để hiện preview,
// file là File object để upload sau. Nếu xóa ảnh: onChange('', null)
export default function ImageUpload({ value, onChange, label = 'Ảnh' }) {
  const inputRef = useRef()

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    onChange(previewUrl, file)
    e.target.value = ''
  }

  function handleClear() {
    onChange('', null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {value ? (
        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100 group">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-medium shadow"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-white text-red-500 rounded-lg shadow"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <Upload size={20} />
          <span className="text-xs">Bấm để chọn ảnh</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
