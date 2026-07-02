import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Heart, Star } from 'lucide-react'
import Container from '../components/Container'
import ProductGallery from '../components/ProductGallery'
import RelatedSection from '../components/RelatedSection'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../data/products'
import { BUY_URL } from '../data/site'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { isWishlisted, toggleWishlist } = useApp()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState({ bySet: [], byCategory: [], byName: [] })
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    const opts = { headers: { 'ngrok-skip-browser-warning': 'true' } }

    Promise.all([
      fetch(`${API}/products/${id}`, opts).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API}/products/${id}/related`, opts).then((r) => (r.ok ? r.json() : { bySet: [], byCategory: [], byName: [] })),
    ])
      .then(([prod, rel]) => {
        if (!prod) {
          setNotFound(true)
          return
        }
        setProduct(prod)
        setRelated(rel)
        window.scrollTo({ top: 0 })
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="pt-32 pb-24">
        <Container>
          <p className="text-center text-stone">Đang tải...</p>
        </Container>
      </main>
    )
  }

  if (notFound || !product) {
    return (
      <main className="pt-32 pb-24">
        <Container className="text-center">
          <p className="text-stone mb-6">Không tìm thấy sản phẩm.</p>
          <Link to="/" className="text-ink underline">
            Quay về trang chủ
          </Link>
        </Container>
      </main>
    )
  }

  const wishlisted = isWishlisted(product.id)

  return (
    <main className="pt-28 md:pt-32 pb-24">
      <Container>
        <nav className="flex items-center gap-2 text-sm text-stone mb-8">
          <Link to="/" className="hover:text-ink">
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <span className="hover:text-ink">{product.category?.name}</span>
          <ChevronRight size={14} />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery product={product} />

          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(product.rating) ? 'fill-bronze text-bronze' : 'text-mist'}
                />
              ))}
              <span className="text-xs text-stone ml-1">({product.ratingCount} đánh giá)</span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl text-ink mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl text-ink font-medium">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-stone line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-y-2 text-sm mb-8 max-w-sm">
              <dt className="text-stone">Chất liệu</dt>
              <dd className="text-ink">{product.material}</dd>
              <dt className="text-stone">Danh mục</dt>
              <dd className="text-ink">{product.category?.name}</dd>
            </dl>

            <div className="mt-auto flex flex-col gap-3 max-w-sm">
              <div className="flex gap-3">
                <a
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center bg-ink text-white py-3.5 text-sm uppercase tracking-wide hover:bg-bronze transition-colors duration-300"
                >
                  Liên hệ đặt mua
                </a>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Thêm vào yêu thích"
                  className="w-14 flex items-center justify-center border border-ink/15 hover:border-ink transition-colors"
                >
                  <Heart size={18} className={wishlisted ? 'fill-terracotta text-terracotta' : 'text-ink'} />
                </button>
              </div>
              <p className="text-xs text-stone text-center">Miễn phí giao hàng nội thành · Bảo hành 24 tháng</p>
            </div>
          </div>
        </div>
      </Container>

      <RelatedSection eyebrow="Bộ sưu tập" title="Trong cùng bộ sưu tập" products={related.bySet} />
      <RelatedSection eyebrow="Gợi ý" title="Cùng danh mục" products={related.byCategory} />
      <RelatedSection eyebrow="Gợi ý" title="Có thể bạn quan tâm" products={related.byName} />
    </main>
  )
}
