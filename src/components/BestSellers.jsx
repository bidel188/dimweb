import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Container from './Container'
import SectionHeading from './SectionHeading'
import ProductCard from './ProductCard'
import { PRODUCTS } from '../data/products'

const items = PRODUCTS.filter((p) => p.bestseller)

export default function BestSellers() {
  const scrollerRef = useRef(null)

  const scrollByAmount = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section id="bestsellers" className="py-24 md:py-32 bg-paper">
      <Container>
        <SectionHeading
          eyebrow="Khách hàng yêu thích"
          title="Sản phẩm bán chạy"
          action={
            <div className="flex gap-2">
              <button
                onClick={() => scrollByAmount(-1)}
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
                aria-label="Xem sản phẩm trước"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollByAmount(1)}
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
                aria-label="Xem sản phẩm sau"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          }
        />
      </Container>

      <div
        ref={scrollerRef}
        className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar px-5 sm:px-8 lg:px-20 snap-x snap-mandatory scroll-px-5"
      >
        {items.map((p) => (
          <div key={p.id} className="min-w-[260px] sm:min-w-[300px] w-[300px] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
