import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import Container from './Container'
import FloatingBlob from './FloatingBlob'
import { img } from '../lib/img'
import { BUY_URL } from '../data/site'

const SLIDES = [
  {
    image: img('1556228720-195a672e8a03', 1800),
    eyebrow: 'Bộ sưu tập 2026',
    title: 'Thiết kế vượt thời gian\ncho không gian sống hiện đại',
    cta: 'Khám phá bộ sưu tập',
    href: '#collection',
  },
  {
    image: img('1484101403633-562f891dc89a', 1800),
    eyebrow: 'Chế tác thủ công',
    title: 'Từng đường nét\nlà một câu chuyện',
    cta: 'Xem sản phẩm',
    href: '#products',
  },
  {
    image: img('1571508601891-ca5e7a713859', 1800),
    eyebrow: 'Ưu đãi giới hạn',
    title: 'Nâng tầm không gian\nsống của bạn',
    cta: 'Liên hệ đặt mua',
    href: BUY_URL,
  },
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[index]
  const isExternal = slide.href.startsWith('http')

  return (
    <section id="top" className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-ink">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-ink/10" />
        </motion.div>
      </AnimatePresence>

      <FloatingBlob className="top-1/4 left-[8%]" size={420} duration={14} opacity={0.2} />

      <Container className="relative h-full flex flex-col justify-end pb-24 md:pb-32">
        <motion.div
          key={`text-${index}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-xl"
        >
          <p className="text-bone/90 text-xs uppercase tracking-[0.25em] mb-5">{slide.eyebrow}</p>
          <h1 className="font-heading text-white text-4xl md:text-6xl leading-[1.1] whitespace-pre-line mb-8">
            {slide.title}
          </h1>
          <a
            href={slide.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-3 bg-white text-ink px-7 py-3.5 text-sm uppercase tracking-wide hover:bg-bronze hover:text-white transition-colors duration-300"
          >
            {slide.cta} <ArrowRight size={16} />
          </a>
        </motion.div>
      </Container>

      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
      >
        <ChevronDown size={22} />
      </motion.div>

      <div className="absolute bottom-8 right-8 md:right-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Xem slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-white' : 'w-3 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
