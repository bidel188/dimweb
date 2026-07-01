import Container from './Container'
import SectionHeading from './SectionHeading'
import ProductCard from './ProductCard'
import { useApp } from '../context/AppContext'

export default function NewArrivals() {
  const { products } = useApp()
  const items = products.filter((p) => p.newArrival)

  return (
    <section className="py-24 md:py-32 bg-bone">
      <Container>
        <SectionHeading eyebrow="Vừa ra mắt" title="Sản phẩm mới" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  )
}
