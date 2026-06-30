import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)
const STORAGE_KEY = 'luxe_wishlist'

export function AppProvider({ children }) {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])

  return (
    <AppContext.Provider
      value={{
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
