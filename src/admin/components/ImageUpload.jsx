import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

const CLOUD_NAME = 'dnmtragmg'
const UPLOAD_PRESET = 'dim'

export default function ImageUpload({ value, onChange, label = 'Ảnh' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('upload_preset', UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (data.secure_url) onChange(data.secure_url)
      else throw new Error('Upload thất bại')
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
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
              onClick={() => onChange('')}
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
          disabled={uploading}
          className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs">Đang upload...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span className="text-xs">Bấm để chọn ảnh</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
