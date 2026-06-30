import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { img } from '../lib/img'
import Reveal from './Reveal'
import FloatingBlob from './FloatingBlob'

export default function FeaturedCollection() {
  return (
    <section id="collection" className="grid md:grid-cols-2 min-h-[80vh]">
      <Reveal className="relative h-[50vh] md:h-auto overflow-hidden">
        <img
          src={img('1493663284031-b7e3aefcae8e', 1400)}
          alt="Bộ sưu tập The Nordic Edit"
          className="w-full h-full object-cover"
        />
      </Reveal>
      <div className="relative overflow-hidden bg-bone-2 flex items-center justify-center px-8 md:px-16 py-16 md:py-0">
        <FloatingBlob className="-top-24 -right-24" size={320} duration={12} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-md"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-bronze font-medium mb-4">
            Bộ sưu tập nổi bật
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-ink mb-5">
            The Nordic Edit
          </h2>
          <p className="text-stone leading-relaxed mb-8">
            Lấy cảm hứng từ chủ nghĩa tối giản Bắc Âu — đường nét thanh thoát, vật liệu tự nhiên và
            bảng màu trung tính cho một không gian sống ấm áp, tĩnh lặng.
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-3 text-ink border-b border-ink pb-1 text-sm uppercase tracking-wide hover:gap-4 hover:text-bronze hover:border-bronze transition-all duration-300"
          >
            Khám phá ngay <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
