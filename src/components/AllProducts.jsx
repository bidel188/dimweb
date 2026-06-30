import { AnimatePresence, motion } from 'framer-motion'
import Container from './Container'
import SectionHeading from './SectionHeading'
import ProductCard from './ProductCard'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { useApp } from '../context/AppContext'

const FILTERS = [{ id: 'all', name: 'Tất cả' }, ...CATEGORIES.map(({ id, name }) => ({ id, name }))]

export default function AllProducts() {
  const { activeCategory, setActiveCategory } = useApp()
  const items =
    activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <section id="products" className="py-24 md:py-32 bg-bone">
      <Container>
        <SectionHeading eyebrow="Toàn bộ sản phẩm" title="Khám phá danh mục nội thất" align="center" />

        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveCategory(f.id)}
              className={`px-5 py-2 rounded-full text-sm border transition-colors duration-300 ${
                activeCategory === f.id
                  ? 'bg-ink text-white border-ink'
                  : 'border-ink/15 text-ink hover:border-ink'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-stone"
            >
              Chưa có sản phẩm trong danh mục này.
            </motion.p>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
            >
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  )
}
