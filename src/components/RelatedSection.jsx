import Container from './Container'
import SectionHeading from './SectionHeading'
import ProductCard from './ProductCard'

export default function RelatedSection({ eyebrow, title, products }) {
  if (!products?.length) return null

  return (
    <section className="py-16 md:py-20 border-t border-ink/10">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} align="left" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mt-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  )
}
