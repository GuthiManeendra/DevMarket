
import { useEffect, useMemo, useState } from 'react'

import MarketplaceContext from './storeContext'
import api from '../services/api'
import { addCartItem as addToCartApi, fetchCart } from '../services/projectService'

const WISHLIST_KEY = 'repohaus_wishlist'

const AUTH_USER_KEY = 'devmarket_auth_user'
const AUTH_TOKEN_KEY = 'devmarket_auth_token'

function MarketplaceProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  // Sync the navbar cart badge with the server-side cart on load.
  useEffect(() => {
    let active = true
    fetchCart()
      .then((data) => {
        if (!active) return
        const items = data.items || data.results || data || []
        setCart(Array.isArray(items) ? items : [])
      })
      .catch(() => {})
    return () => { active = false }
  }, [])
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Verify the saved Django token when Repohaus opens.
  useEffect(() => {
    let active = true

    const verifyAuthentication = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)

      if (!token) {
        localStorage.removeItem(AUTH_USER_KEY)

        if (active) {
          setUser(null)
          setAuthLoading(false)
        }

        return
      }

      try {
        const response = await api.get('/auth/me/')

        if (!active) return

        const authenticatedUser = {
          ...response.data.user,
          isLoggedIn: true,
        }

        setUser(authenticatedUser)

        localStorage.setItem(
          AUTH_USER_KEY,
          JSON.stringify(authenticatedUser)
        )
      } catch (error) {
        if (!active) return

        // Invalid token: clear the previous login.
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)

        setUser(null)
      } finally {
        if (active) {
          setAuthLoading(false)
        }
      }
    }

    verifyAuthentication()

    return () => {
      active = false
    }
  }, [])

  // Save user only after successful Django authentication.
  const login = (userData, token) => {
    if (!token || !userData) {
      throw new Error('Valid authentication details are required.')
    }

    const authenticatedUser = {
      ...userData,
      isLoggedIn: true,
    }

    localStorage.setItem(AUTH_TOKEN_KEY, token)

    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(authenticatedUser)
    )

    setUser(authenticatedUser)
  }

  // Logout from Django and clear local authentication.
  const logout = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)

      if (token) {
        await api.post('/auth/logout/')
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)

      setUser(null)
    }
  }

  // Wishlist functionality.
  const toggleWishlist = (item) => {
    setWishlist((current) =>
      current.some((entry) => entry.id === item.id)
        ? current.filter((entry) => entry.id !== item.id)
        : [...current, item]
    )
  }

  // Add item to cart.
  const addToCart = async (item) => {
    try {
      // Determine if it's a project or portfolio based on the item structure
      // Portfolios have portfolio_type field, projects have difficulty_level
      const isPortfolio = item.portfolio_type !== undefined || item.frontend_technology !== undefined
      const payload = isPortfolio
        ? { portfolio_template_id: item.id }
        : { project_id: item.id }
      
      // Call the backend API
      const result = await addToCartApi(payload)
      
      // Update local state with the result
      setCart((current) => {
        const existingIndex = current.findIndex((entry) => entry.id === item.id)
        if (existingIndex !== -1) {
          return current
        }
        return [...current, { ...item, quantity: 1, ...result }]
      })
      
      return result
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }

  // Remove item from cart.
  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    )
  }

  // Update cart quantity.
  const updateQuantity = (id, quantity) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, quantity),
            }
          : item
      )
    )
  }

  const value = useMemo(
    () => ({
      addToCart,
      cart,
      login,
      logout,
      removeFromCart,
      toggleWishlist,
      updateQuantity,
      user,
      wishlist,
      authLoading,
    }),
    [cart, wishlist, user, authLoading]
  )

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  )
}

export default MarketplaceProvider
