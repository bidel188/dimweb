import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatPrice, getProductsByIds } from '../data/products'
import { BUY_URL } from '../data/site'

export default function ShopTheLookModal() {
  const { activeLook, setActiveLook, setQuickViewProduct } = useApp()
  const products = activeLook ? getProductsByIds(activeLook.productIds) : []

  const openProduct = (product) => {
    setActiveLook(null)
    setQuickViewProduct(product)
  }

  return (
    <AnimatePresence>
      {activeLook && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setActiveLook(null)}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative bg-paper w-full max-w-3xl max-h-[88vh] overflow-y-auto grid md:grid-cols-2 z-10"
          >
            <button
              onClick={() => setActiveLook(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <div className="aspect-square md:aspect-auto bg-bone-2">
              <img src={activeLook.image} alt={activeLook.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-8 md:p-10 flex flex-col">
              <p className="text-xs uppercase tracking-[0.2em] text-bronze font-medium mb-3">
                Shop the look
              </p>
              <h3 className="font-heading text-2xl text-ink mb-6">{activeLook.title}</h3>

              <div className="flex flex-col gap-4 mb-6">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openProduct(p)}
                    className="flex items-center gap-4 text-left group"
                  >
                    <div className="w-16 h-16 shrink-0 overflow-hidden bg-bone-2">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink group-hover:text-bronze transition-colors truncate">
                        {p.name}
                      </p>
                      <p className="text-sm text-stone">{formatPrice(p.price)}</p>
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-mist group-hover:text-bronze transition-colors shrink-0"
                    />
                  </button>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <a
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-ink text-white py-3.5 text-sm uppercase tracking-wide hover:bg-bronze transition-colors duration-300"
                >
                  Liên hệ đặt mua cả set
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
