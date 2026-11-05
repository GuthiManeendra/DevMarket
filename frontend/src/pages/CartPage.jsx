import { useEffect, useState } from 'react'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { clearCart, fetchCart, removeCartItem } from '../services/projectService'
import { EmptyState, PriceDisplay } from '../components/common/Feedback'
import { PageHeader } from '../components/common/PageHeader'
import { PrimaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'

function CartPage() {
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchCart().then(setCart).catch(() => setError('Your cart is temporarily unavailable.')).finally(() => setLoading(false)) }, [])
  const refresh = (request) => request.then(setCart).catch(() => setError('The cart could not be updated.'))
  if (loading) return <SiteShell><main className="dm-section"><div className="dm-container"><EmptyState title="Loading cart" description="Refreshing current product prices and fees." /></div></main></SiteShell>
  if (error) return <SiteShell><main className="dm-section"><div className="dm-container"><EmptyState title="Cart unavailable" description={error} /></div></main></SiteShell>
  return (
    <SiteShell>
      <PageHeader breadcrumbs={[{ label: 'Cart' }]} description="Review products and current server-calculated charges before checkout." eyebrow="Your workspace" title="Shopping cart" />
      <main className="dm-section pt-4"><div className="dm-container">{!cart?.items?.length ? <EmptyState description="Add a published project or portfolio template to see it here." title="Your cart is empty" /> : <div className="row g-4"><div className="col-lg-8">{cart.items.map((item) => <div className="dm-cart-item dm-card p-3 mb-3" key={item.id}><div className="dm-cart-item__thumb">DM</div><div className="flex-grow-1"><span className="dm-preview-label dm-preview-label--inline">{item.product_type}</span><h2 className="h5 mt-2">{item.title}</h2><p className="dm-muted small mb-0">{item.slug}</p></div><div className="text-end"><PriceDisplay amount={item.base_price} /><button aria-label={`Remove ${item.title}`} className="dm-btn dm-btn--icon text-danger d-block ms-auto mt-3" onClick={() => refresh(removeCartItem(item.id))} type="button"><FaTrash aria-hidden="true" /></button></div></div>)}<button className="dm-text-button" onClick={() => refresh(clearCart())} type="button">Clear cart</button><Link className="dm-text-link d-block mt-3" to="/projects"><FaArrowLeft aria-hidden="true" /> Continue shopping</Link></div><div className="col-lg-4"><aside className="dm-purchase-card"><h2 className="h5">Order summary</h2><div className="dm-summary-row"><span>Product subtotal</span><PriceDisplay amount={cart.subtotal} /></div><div className="dm-summary-row"><span>Platform fee</span><PriceDisplay amount={cart.platform_fee} /></div><div className="dm-summary-row"><span>Convenience fee</span><PriceDisplay amount={cart.convenience_fee} /></div><div className="dm-summary-row dm-summary-row--total"><strong>Estimated total</strong><strong><PriceDisplay amount={cart.total} /></strong></div>{cart.tax_configuration_incomplete && <p className="dm-purchase-note">Tax configuration is incomplete and no tax is currently applied.</p>}<Link className="dm-btn dm-btn--primary w-100 text-center mt-3" to="/checkout"><PrimaryButton className="w-100">Proceed to checkout</PrimaryButton></Link></aside></div></div>}</div></main>
    </SiteShell>
  )
}

export default CartPage
