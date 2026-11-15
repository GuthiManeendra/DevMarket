import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBoxOpen, FaExternalLinkAlt } from 'react-icons/fa'
import { fetchMyOrders } from '../services/projectService'
import { EmptyState, PriceDisplay } from '../components/common/Feedback'
import { PageHeader } from '../components/common/PageHeader'
import { Badge } from '../components/common/Feedback'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'

function productLink(item) {
  if (!item.product_slug_snapshot) return '/projects'
  return item.product_type === 'portfolio'
    ? `/portfolios/${item.product_slug_snapshot}`
    : `/projects/${item.product_slug_snapshot}`
}

function PurchasesPage() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(data.results || []))
      .catch(() => setError('Your purchase history is temporarily unavailable.'))
  }, [])

  if (error) {
    return (
      <SiteShell>
        <SEO noindex title="My Purchases" />
        <main className="dm-section"><div className="dm-container"><EmptyState description={error} title="Purchases unavailable" /></div></main>
      </SiteShell>
    )
  }
  if (!orders) {
    return (
      <SiteShell>
        <SEO noindex title="My Purchases" />
        <main className="dm-section"><div className="dm-container"><EmptyState description="Loading your verified purchases." title="Loading purchases" /></div></main>
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <SEO noindex title="My Purchases" />
      <PageHeader
        breadcrumbs={[{ label: 'My Purchases' }]}
        description="Products you have purchased with verified Razorpay payments."
        eyebrow="Your workspace"
        title="My Purchases"
      />
      <main className="dm-section pt-4">
        <div className="dm-container">
          {orders.length === 0 ? (
            <EmptyState
              description="Projects and portfolios you buy will appear here after payment is verified."
              title="No purchases yet"
            />
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map((order) => (
                <div className="dm-card p-4" key={order.order_number}>
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <strong>{order.order_number}</strong>
                        <Badge>{order.status.replace(/_/g, ' ')}</Badge>
                      </div>
                      <small className="dm-muted d-block mt-1">
                        {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        {order.payment_method ? ` • ${order.payment_method.toUpperCase()}` : ''}
                        {order.payment_id ? ` • ${order.payment_id}` : ''}
                      </small>
                    </div>
                    <div className="text-end">
                      <PriceDisplay amount={order.total_amount} />
                      <div className="small dm-muted">{order.currency}</div>
                    </div>
                  </div>
                  <div className="mt-3 d-flex flex-column gap-2">
                    {order.items.map((item) => (
                      <div className="d-flex align-items-center justify-content-between gap-2" key={item.id}>
                        <span>
                          {item.product_title_snapshot}
                          <span className="dm-muted small ms-2">({item.product_type})</span>
                        </span>
                        {order.status === 'paid' && (
                          <Link className="dm-btn dm-btn--secondary btn-sm" to={productLink(item)}>
                            <FaExternalLinkAlt className="me-1" /> View / Access
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link className="dm-text-link" to="/projects">
              <FaBoxOpen className="me-1" /> Continue shopping
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default PurchasesPage
