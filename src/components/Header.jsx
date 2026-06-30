import { useEffect, useState } from 'react'
import { Heart, Menu, Phone, X } from 'lucide-react'
import Container from './Container'
import { BUY_URL, SITE } from '../data/site'
import { useApp } from '../context/AppContext'

const NAV = [
  { label: 'Sản phẩm', href: '#products' },
  { label: 'Bộ sưu tập', href: '#collection' },
  { label: 'Cảm hứng', href: '#inspiration' },
  { label: 'Đánh giá', href: '#reviews' },
  { label: 'Liên hệ', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { wishlist } = useApp()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bone/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.06)] py-3' : 'py-6'
      }`}
    >
      <Container className="flex items-center justify-between">
        <a href="#top" className="font-heading text-2xl tracking-wide text-ink">
          {SITE.name}
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink/80 hover:text-ink relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-ink transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="#wishlist" className="relative hidden sm:inline-flex" aria-label="Sản phẩm yêu thích">
            <Heart size={20} className="text-ink" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-bronze text-white text-[10px] leading-none w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </a>
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-ink text-white text-sm px-5 py-2.5 hover:bg-bronze transition-colors duration-300"
          >
            <Phone size={15} /> Liên hệ đặt mua
          </a>
          <button className="lg:hidden text-ink" onClick={() => setOpen(true)} aria-label="Mở menu">
            <Menu size={24} />
          </button>
        </div>
      </Container>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-bone p-8 transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end mb-10">
            <button onClick={() => setOpen(false)} aria-label="Đóng menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-heading text-2xl text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center justify-center gap-2 bg-ink text-white text-sm px-5 py-3 w-full"
          >
            <Phone size={15} /> Liên hệ đặt mua
          </a>
        </div>
      </div>
    </header>
  )
}
