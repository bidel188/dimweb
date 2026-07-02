import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)
const STORAGE_KEY = 'luxe_wishlist'
const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

export function AppProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLook, setActiveLook] = useState(null)

  useEffect(() => {
    const opts = { headers: { 'ngrok-skip-browser-warning': 'true' } }
    Promise.all([
      fetch(`${API}/products`, opts).then(r => r.json()),
      fetch(`${API}/categories`, opts).then(r => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
    }).finally(() => setLoadingData(false))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        loadingData,
        wishlist,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        setQuickViewProduct,
        activeCategory,
        setActiveCategory,
        activeLook,
        setActiveLook,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
