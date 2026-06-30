import { AnimatePresence, motion } from 'framer-motion'
import { Star, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../data/products'
import { BUY_URL } from '../data/site'

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useApp()

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
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

            <div className="aspect-square md:aspect-auto bg-bone-2">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
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
