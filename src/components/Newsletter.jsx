import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Container from './Container'
import FloatingBlob from './FloatingBlob'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    // Chưa nối backend/email service — chỉ hiển thị trạng thái xác nhận tạm thời.
    setSubmitted(true)
  }

  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-28">
      <FloatingBlob className="-top-32 -left-20" size={360} duration={13} opacity={0.18} />
      <FloatingBlob className="-bottom-32 -right-10" size={300} duration={16} opacity={0.15} />
      <Container className="relative z-10 text-center max-w-2xl">
        <h2 className="font-heading text-white text-3xl md:text-4xl mb-4">Gia nhập Inner Circle</h2>
        <p className="text-bone/70 mb-8">
          Nhận thông tin bộ sưu tập mới, ưu đãi riêng và cảm hứng thiết kế nội thất mỗi tháng.
        </p>
        {submitted ? (
          <p className="text-bronze">Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="flex-1 bg-transparent border border-white/30 text-white placeholder:text-white/50 px-5 py-3.5 text-sm focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-white text-ink px-6 py-3.5 text-sm uppercase tracking-wide hover:bg-bronze hover:text-white transition-colors duration-300"
            >
              Đăng ký <ArrowRight size={15} />
            </button>
          </form>
        )}
      </Container>
    </section>
  )
}
