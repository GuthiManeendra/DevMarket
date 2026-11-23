import { useEffect, useState } from 'react'
import { FaArrowLeft, FaTrash, FaLayerGroup, FaPalette } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { clearCart, fetchCart, removeCartItem } from '../services/projectService'
import { EmptyState, PriceDisplay } from '../components/common/Feedback'
import { PageHeader } from '../components/common/PageHeader'
import { PrimaryButton } from '../components/common/Buttons'
import ConfirmDialog from '../components/common/ConfirmDialog'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'

function CartPage() {
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    fetchCart()
      .then(setCart)
      .catch(() => setError('Your cart is temporarily unavailable.'))
      .finally(() => setLoading(false))
  }, [])

  const refresh = (request) => {
    return request
      .then(setCart)
      .catch(() => setError('The cart could not be updated.'))
  }

  const handleRemove = async (itemId) => {
    setRemoving(itemId)
    try {
      await refresh(removeCartItem(itemId))
    } finally {
      setRemoving(null)
    }
  }

  const handleClearCart = async () => {
    setConfirmClear(false)
    await refresh(clearCart())
  }

  if (loading) {
    return (
      <SiteShell>
        <SEO noindex title="Shopping cart" />
        <main className="dm-section">
          <div className="dm-container">
            <EmptyState title="Loading cart" description="Refreshing current product prices and fees." />
          </div>
        </main>
      </SiteShell>
    )
  }

  if (error) {
    return (
      <SiteShell>
        <SEO noindex title="Shopping cart" />
        <main className="dm-section">
          <div className="dm-container">
            <EmptyState title="Cart unavailable" description={error} />
          </div>
        </main>
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <SEO noindex title="Shopping cart" />
      <PageHeader
        breadcrumbs={[{ label: 'Cart' }]}
        description="Review products and current server-calculated charges before checkout."
        eyebrow="Your workspace"
        title="Shopping cart"
      />
      <ConfirmDialog
        confirmLabel="Clear cart"
        message="This removes every item from your cart. This action cannot be undone."
        onCancel={() => setConfirmClear(false)}
        onConfirm={handleClearCart}
        open={confirmClear}
        title="Clear your cart?"
      />
      <main className="dm-section pt-4 pb-5">
        <div className="dm-container">
          {!cart?.items?.length ? (
            <EmptyState
              description="Add a published project or portfolio template to see it here."
              title="Your cart is empty"
            />
          ) : (
            <div className="row g-4 mb-5">
              <div className="col-lg-8">
                <div className="dm-cart-items">
                  {cart.items.map((item) => {
                    const isPortfolio = item.product_type === 'portfolio_template'
                    const displayTitle = item.product_title_snapshot || item.title || 'Product'
                    const displaySlug = item.product_slug_snapshot || item.slug || ''

                    return (
                      <div className="dm-cart-item dm-card p-4 mb-3" key={item.id}>
                        <div className="dm-cart-item__thumb">
                          {isPortfolio ? <FaPalette /> : <FaLayerGroup />}
                        </div>
                        <div className="dm-cart-item__content">
                          <span className="dm-preview-label dm-preview-label--inline">
                            {isPortfolio ? 'Portfolio Template' : 'Project'}
                          </span>
                          <h3 className="h5 mt-2 mb-1">{displayTitle}</h3>
                          {displaySlug && (
                            <p className="dm-muted small mb-0">{displaySlug}</p>
                          )}
                        </div>
                        <div className="dm-cart-item__price">
                          <PriceDisplay amount={item.base_price} />
                          <button
                            aria-label={`Remove ${displayTitle}`}
                            className="dm-btn dm-btn--icon text-danger d-block ms-auto mt-3"
                            disabled={removing === item.id}
                            onClick={() => handleRemove(item.id)}
                            type="button"
                          >
                            {removing === item.id ? (
                              <span style={{ fontSize: '0.875rem' }}>Removing...</span>
                            ) : (
                              <FaTrash aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="dm-cart-actions mt-4 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    className="dm-text-button"
                    onClick={() => setConfirmClear(true)}
                    type="button"
                  >
                    Clear cart
                  </button>
                  <Link className="dm-text-link d-block mt-2" to="/projects">
                    <FaArrowLeft aria-hidden="true" /> Continue shopping
                  </Link>
                </div>
              </div>
              <div className="col-lg-4">
                <aside className="dm-purchase-card">
                  <h2 className="h5 mb-4">Order summary</h2>
                  <div className="dm-summary-row">
                    <span>Product subtotal</span>
                    <PriceDisplay amount={cart.subtotal} />
                  </div>
                  <div className="dm-summary-row">
                    <span>Platform fee</span>
                    <PriceDisplay amount={cart.platform_fee} />
                  </div>
                  <div className="dm-summary-row">
                    <span>Convenience fee</span>
                    <PriceDisplay amount={cart.convenience_fee} />
                  </div>
                  {cart.discount > 0 && (
                    <div className="dm-summary-row text-success">
                      <span>Discount</span>
                      <span>-<PriceDisplay amount={cart.discount} /></span>
                    </div>
                  )}
                  <div className="dm-summary-row dm-summary-row--total">
                    <strong>Estimated total</strong>
                    <strong><PriceDisplay amount={cart.total} /></strong>
                  </div>
                  {cart.tax_configuration_incomplete && (
                    <p className="dm-purchase-note mt-3">
                      Tax configuration is incomplete and no tax is currently applied.
                    </p>
                  )}
                  <Link className="dm-btn dm-btn--primary w-100 text-center mt-4" to="/checkout">
                    <PrimaryButton className="w-100">Proceed to checkout</PrimaryButton>
                  </Link>
                </aside>
              </div>
            </div>
          )}
        </div>
      </main>
    </SiteShell>
  )
}

export default CartPage
