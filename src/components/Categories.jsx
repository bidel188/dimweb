import { motion } from 'framer-motion'
import Container from './Container'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { CATEGORIES } from '../data/products'
import { useApp } from '../context/AppContext'

export default function Categories() {
  const { setActiveCategory } = useApp()

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Danh mục" title="Mua sắm theo không gian" align="center" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.id}
              href="#products"
              onClick={() => setActiveCategory(cat.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex flex-col items-center gap-4 text-center"
            >
              <Reveal clip={false} delay={i * 0.06} className="w-full aspect-square rounded-full overflow-hidden bg-bone-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Reveal>
              <span className="text-sm md:text-base text-ink group-hover:text-bronze transition-colors">
                {cat.name}
              </span>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  )
}
