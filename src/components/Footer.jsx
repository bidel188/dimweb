import { Mail, MapPin, Phone } from 'lucide-react'
import Container from './Container'
import { FacebookIcon, InstagramIcon } from './SocialIcons'
import { SITE } from '../data/site'
import { useApp } from '../context/AppContext'

const HELP_LINKS = [
  { label: 'Vận chuyển & Giao hàng', href: '#' },
  { label: 'Đổi trả & Bảo hành', href: '#' },
  { label: 'Câu hỏi thường gặp', href: '#' },
]

export default function Footer() {
  const { categories, setActiveCategory } = useApp()
  const shopLinks = categories.map((cat) => ({
    label: cat.name,
    href: '#products',
    onClick: () => setActiveCategory(cat.id),
  }))

  return (
    <footer id="contact" className="bg-bone-2 pt-20 pb-8">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-16">
          <div className="col-span-2">
            <p className="font-heading text-2xl text-ink mb-4">{SITE.name}</p>
            <p className="text-stone text-sm leading-relaxed mb-6 max-w-xs">
              Nội thất cao cấp cho không gian sống hiện đại — chế tác bền vững, thiết kế vượt thời
              gian.
            </p>
            <div className="flex gap-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
              >
                <FacebookIcon size={16} />
              </a>
            </div>
          </div>

          <FooterCol title="Sản phẩm" links={shopLinks} />
          <FooterCol title="Hỗ trợ" links={HELP_LINKS} />

          <div>
            <p className="text-sm font-medium text-ink mb-4">Liên hệ</p>
            <ul className="space-y-3 text-sm text-stone">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" /> {SITE.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} /> {SITE.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} /> {SITE.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-ink transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Điều khoản dịch vụ
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-sm font-medium text-ink mb-4">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              onClick={l.onClick}
              className="text-sm text-stone hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
