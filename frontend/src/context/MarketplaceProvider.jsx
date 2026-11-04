import { useMemo, useState } from 'react'
import MarketplaceContext from './storeContext'

function MarketplaceProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  const toggleWishlist = (item) => {
    setWishlist((current) => current.some((entry) => entry.id === item.id)
      ? current.filter((entry) => entry.id !== item.id)
      : [...current, item])
  }

  const addToCart = (item) => {
    setCart((current) => current.some((entry) => entry.id === item.id)
      ? current
      : [...current, { ...item, quantity: 1 }])
  }

  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id))

  const updateQuantity = (id, quantity) => {
    setCart((current) => current.map((item) => (
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )))
  }

  const value = useMemo(() => ({
    addToCart,
    cart,
    removeFromCart,
    toggleWishlist,
    updateQuantity,
    wishlist,
  }), [cart, wishlist])

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
}

export default MarketplaceProvider
