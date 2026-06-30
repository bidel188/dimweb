import { ArrowUpRight } from 'lucide-react'
import Container from './Container'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { ROOM_LOOKS } from '../data/products'
import { useApp } from '../context/AppContext'

export default function RoomInspiration() {
  const { setActiveLook } = useApp()

  return (
    <section id="inspiration" className="py-24 md:py-32 bg-paper">
      <Container>
        <SectionHeading
          eyebrow="Cảm hứng không gian"
          title="Phòng của bạn, phong cách của bạn"
          subtitle="Chạm vào một không gian để xem các sản phẩm được sử dụng trong set này."
        />
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {ROOM_LOOKS.map((look, i) => (
            <button
              key={look.id}
              onClick={() => setActiveLook(look)}
              className={`relative group overflow-hidden text-left ${
                i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
              }`}
            >
              <Reveal className="w-full h-full" delay={i * 0.06}>
                <img
                  src={look.image}
                  alt={look.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Reveal>
              <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
                <span className="font-heading text-white text-lg md:text-xl">{look.title}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 bg-white text-ink text-xs uppercase tracking-wide px-4 py-2.5 shrink-0">
                  Xem set <ArrowUpRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}
