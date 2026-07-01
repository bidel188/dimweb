import { Eye, Heart, Star } from 'lucide-react'
import { formatPrice } from '../data/products'
import { useApp } from '../context/AppContext'
import Reveal from './Reveal'

export default function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist, setQuickViewProduct } = useApp()
  const wishlisted = isWishlisted(product.id)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="group relative flex flex-col">
      <Reveal className="relative aspect-4/5 overflow-hidden bg-bone-2 mb-4">
        {(product.badge || discount) && (
          <span className="absolute top-3 left-3 z-10 bg-ink text-white text-[11px] uppercase tracking-wide px-2.5 py-1">
            {discount ? `-${discount}%` : product.badge}
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Thêm vào yêu thích"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart size={16} className={wishlisted ? 'fill-terracotta text-terracotta' : 'text-ink'} />
        </button>

        <img
          src={product.images?.[0]?.url || product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 group-hover:opacity-0"
        />
        {(product.images?.[1]?.url) && (
          <img
            src={product.images[1].url}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <button
          onClick={() => setQuickViewProduct(product)}
          className="absolute bottom-0 inset-x-0 bg-ink/90 text-white text-xs uppercase tracking-wide py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <Eye size={14} /> Xem nhanh
        </button>
      </Reveal>

      <div className="flex items-center gap-1 mb-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < Math.round(product.rating) ? 'fill-bronze text-bronze' : 'text-mist'}
          />
        ))}
        <span className="text-xs text-stone ml-1">({product.ratingCount})</span>
      </div>

      <h3 className="text-sm md:text-base text-ink mb-1.5">{product.name}</h3>

      <div className="flex items-center gap-2">
        <span className="text-ink font-medium">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-stone text-sm line-through">{formatPrice(product.originalPrice)}</span>
        )}
      </div>
    </div>
  )
}
