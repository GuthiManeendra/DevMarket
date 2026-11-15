import { useNavigate } from 'react-router-dom'
import useMarketplace from '../context/useMarketplace'
import { trackEvent } from '../utils/analytics'

/**
 * Buy Now flow:
 *  - Logged out  → redirect to the existing login page, remembering the
 *    intended checkout URL so the purchase continues after sign-in.
 *  - Logged in   → open the custom checkout page with a `buy` parameter.
 *    CheckoutPage resolves it to a cart item and scopes the order to it.
 *
 * @param {{ type: 'project' | 'portfolio', id: number|string }} productRef
 */
export default function useBuyNow() {
  const navigate = useNavigate()
  const { user, authLoading } = useMarketplace()

  const buyNow = ({ type, id }) => {
    if (!id) return
    trackEvent('begin_checkout', {
      currency: 'INR',
      items: [{ item_id: String(id), item_name: type === 'portfolio' ? 'Portfolio template' : 'Project' }],
    })
    const buyParam = `${type}:${id}`
    const checkoutPath = `/checkout?buy=${encodeURIComponent(buyParam)}`

    if (!user?.isLoggedIn) {
      navigate('/login', {
        state: {
          from: {
            pathname: '/checkout',
            search: `?buy=${encodeURIComponent(buyParam)}`,
          },
        },
      })
      return
    }

    navigate(checkoutPath)
  }

  return { buyNow, isLoggedIn: Boolean(user?.isLoggedIn), authLoading }
}
