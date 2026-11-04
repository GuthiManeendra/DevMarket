import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import useMarketplace from '../context/useMarketplace'
import { EmptyState, PriceDisplay } from '../components/common/Feedback'
import { PageHeader } from '../components/common/PageHeader'
import { PrimaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'

function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useMarketplace()
  return (
    <SiteShell>
      <PageHeader breadcrumbs={[{ label: 'Cart' }]} description="Review your selected previews before the future checkout experience is connected." eyebrow="Your workspace" title="Shopping cart" />
      <main className="dm-section pt-4"><div className="dm-container">{cart.length === 0 ? <EmptyState description="Add a design preview from the projects or portfolio store to see it here." title="Your cart is empty" /> : <div className="row g-4"><div className="col-lg-8">{cart.map((item) => <div className="dm-cart-item dm-card p-3 mb-3" key={item.id}><div className="dm-cart-item__thumb"><span>DM</span></div><div className="flex-grow-1"><span className="dm-preview-label dm-preview-label--inline">Design preview</span><h2 className="h5 mt-2">{item.title}</h2><p className="dm-muted small mb-0">{item.category}</p></div><div className="text-end"><PriceDisplay /><div className="d-flex align-items-center gap-2 mt-3"><label className="visually-hidden" htmlFor={`quantity-${item.id}`}>Quantity</label><input className="dm-quantity" id={`quantity-${item.id}`} min="1" onChange={(event) => updateQuantity(item.id, Number(event.target.value))} type="number" value={item.quantity} /><button aria-label={`Remove ${item.title}`} className="dm-btn dm-btn--icon text-danger" onClick={() => removeFromCart(item.id)} type="button"><FaTrash aria-hidden="true" /></button></div></div></div>)}<Link className="dm-text-link" to="/projects"><FaArrowLeft aria-hidden="true" /> Continue shopping</Link></div><div className="col-lg-4"><aside className="dm-purchase-card"><h2 className="h5">Order summary</h2><div className="dm-summary-row"><span>Product subtotal</span><span>Not available</span></div><div className="dm-summary-row"><span>Platform fee (3%)</span><span>Backend calculated</span></div><div className="dm-summary-row"><span>Convenience fee (4%)</span><span>Backend calculated</span></div><div className="dm-summary-row dm-summary-row--total"><strong>Final payable amount</strong><strong>Not available</strong></div><p className="dm-purchase-note">Demonstration cart only. Authoritative totals will come from Django; no order or payment has been created.</p><PrimaryButton className="w-100" disabled>Proceed to checkout</PrimaryButton></aside></div></div>}</div></main>
    </SiteShell>
  )
}

export default CartPage
