import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductGallery({ product }) {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => setActiveIdx(0), [product?.id])

  const imgs = product.images?.length ? product.images.map((i) => i.url) : [product.image].filter(Boolean)

  const prev = () => setActiveIdx((i) => (i - 1 + imgs.length) % imgs.length)
  const next = () => setActiveIdx((i) => (i + 1) % imgs.length)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden bg-bone-2">
        <img
          key={activeIdx}
          src={imgs[activeIdx]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Ảnh sau"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`flex-none w-20 h-20 rounded overflow-hidden border-2 transition-colors ${
                i === activeIdx ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
