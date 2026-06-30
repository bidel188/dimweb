import { motion } from 'framer-motion'
import Container from './Container'
import { img } from '../lib/img'
import Reveal from './Reveal'
import FloatingBlob from './FloatingBlob'

const STATS = [
  { value: '25+', label: 'Năm kinh nghiệm' },
  { value: '12.000+', label: 'Khách hàng hài lòng' },
  { value: '100%', label: 'Gỗ tự nhiên bền vững' },
]

export default function BrandStory() {
  return (
    <section className="py-24 md:py-32 bg-paper overflow-hidden">
      <Container className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="aspect-4/5"
        >
          <Reveal className="w-full h-full">
            <img
              src={img('1586023492125-27b2c045efd7', 1000)}
              alt="Xưởng chế tác nội thất LUXE"
              className="w-full h-full object-cover"
            />
          </Reveal>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-bronze font-medium mb-4">
            Câu chuyện thương hiệu
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-ink mb-6">
            Chế tác để tồn tại
            <br />
            qua nhiều thế hệ
          </h2>
          <p className="text-stone leading-relaxed mb-10">
            Từ năm 2000, LUXE theo đuổi triết lý thiết kế tối giản và chất liệu bền vững. Mỗi sản phẩm
            là kết quả của quy trình chọn gỗ, xử lý và hoàn thiện thủ công tỉ mỉ — để đồng hành cùng
            không gian sống của bạn qua nhiều thập kỷ.
          </p>
          <div className="relative">
            <FloatingBlob className="-bottom-10 -left-10" size={260} duration={11} />
            <div className="relative z-10 grid grid-cols-3 gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-2xl md:text-3xl text-ink mb-1">{s.value}</p>
                  <p className="text-xs text-stone leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
