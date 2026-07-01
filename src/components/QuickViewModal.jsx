import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../data/products'
import { BUY_URL } from '../data/site'

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useApp()
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (quickViewProduct) setActiveIdx(0)
  }, [quickViewProduct?.id])

  if (!quickViewProduct) return null

  const imgs = quickViewProduct.images?.length
    ? quickViewProduct.images.map(i => i.url)
    : [quickViewProduct.image].filter(Boolean)

  const prev = () => setActiveIdx(i => (i - 1 + imgs.length) % imgs.length)
  const next = () => setActiveIdx(i => (i + 1) % imgs.length)

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative bg-paper w-full max-w-3xl max-h-[88vh] overflow-y-auto grid md:grid-cols-2 z-10"
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            {/* Image gallery */}
            <div className="flex flex-col gap-2 bg-bone-2 p-2">
              <div className="relative aspect-square overflow-hidden">
                <img
                  key={activeIdx}
                  src={imgs[activeIdx]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
                {imgs.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {imgs.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`flex-none w-14 h-14 rounded overflow-hidden border-2 transition-colors ${
                        i === activeIdx ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 md:p-10 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < Math.round(quickViewProduct.rating) ? 'fill-bronze text-bronze' : 'text-mist'
                    }
                  />
                ))}
                <span className="text-xs text-stone ml-1">({quickViewProduct.ratingCount} đánh giá)</span>
              </div>

              <h3 className="font-heading text-2xl text-ink mb-3">{quickViewProduct.name}</h3>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl text-ink font-medium">{formatPrice(quickViewProduct.price)}</span>
                {quickViewProduct.originalPrice && (
                  <span className="text-stone line-through">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-stone text-sm mb-6">Chất liệu: {quickViewProduct.material}</p>

              <div className="mt-auto flex flex-col gap-3">
                <a
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-ink text-white py-3.5 text-sm uppercase tracking-wide hover:bg-bronze transition-colors duration-300"
                >
                  Liên hệ đặt mua
                </a>
                <p className="text-xs text-stone text-center">
                  Miễn phí giao hàng nội thành · Bảo hành 24 tháng
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
