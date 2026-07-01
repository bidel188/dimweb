import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

// urls: string[]  (blob URLs cho preview, Cloudinary URLs cho ảnh đã lưu)
// files: File[]   (file tương ứng, null nếu ảnh đã có URL thật)
// onChange(urls, files)
export default function MultiImageUpload({ urls = [], files = [], onChange }) {
  const inputRef = useRef()

  function handleFiles(e) {
    const selected = Array.from(e.target.files)
    if (!selected.length) return
    const newPreviews = selected.map(f => URL.createObjectURL(f))
    onChange([...urls, ...newPreviews], [...files, ...selected])
    e.target.value = ''
  }

  function handleRemove(index) {
    const newUrls = urls.filter((_, i) => i !== index)
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newUrls, newFiles)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ảnh sản phẩm <span className="text-red-400">*</span>
        <span className="text-gray-400 font-normal ml-1">(ảnh đầu tiên là ảnh chính)</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {urls.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded">
                Chính
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 p-1 bg-white/90 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Nút thêm ảnh */}
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <Upload size={18} />
          <span className="text-xs">Thêm ảnh</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  )
}
