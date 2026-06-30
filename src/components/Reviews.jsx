import { Quote, Star } from 'lucide-react'
import Container from './Container'
import SectionHeading from './SectionHeading'
import { REVIEWS } from '../data/products'

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 md:py-32 bg-bone-2">
      <Container>
        <SectionHeading
          eyebrow="Khách hàng nói gì"
          title="Được tin tưởng bởi hàng nghìn gia đình"
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((r) => (
            <div key={r.id} className="bg-paper p-8 flex flex-col">
              <Quote className="text-bronze mb-4" size={28} />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < r.rating ? 'fill-bronze text-bronze' : 'text-mist'} />
                ))}
              </div>
              <p className="text-stone leading-relaxed mb-6 flex-1">&ldquo;{r.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm text-ink font-medium">{r.name}</p>
                  <p className="text-xs text-stone">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
