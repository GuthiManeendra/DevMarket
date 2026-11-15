
import { useEffect, useState } from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/Feedback'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'
import { breadcrumbJsonLd } from '../utils/seo'
import api from '../services/api'

function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    let mounted = true

    const loadOffers = async () => {
      try {
        const response = await api.get('/cart/offers/')

        if (mounted) {
          setOffers(response.data?.offers || [])
          setError('')
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.detail ||
            'Unable to load offers. Please try again later.'
          )
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadOffers()

    return () => {
      mounted = false
    }
  }, [])

  const formatDiscount = (offer) => {
    const value = Number(offer.discount_value)

    return offer.discount_type === 'percentage'
      ? `${value}% OFF`
      : `₹${value.toLocaleString('en-IN')} OFF`
  }

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
    } catch {
      setError('Unable to copy the coupon code. Please copy it manually.')
    }
  }

  return (
    <SiteShell>
      <SEO
        description="Explore current DevMarket promotions, discount coupons and special offers on software projects and portfolio templates."
        jsonLd={breadcrumbJsonLd([{ label: 'Home', to: '/' }, { label: 'Offers', to: '/offers' }])}
        path="/offers"
        title="Offers & Promotions"
      />
      <PageHeader
        breadcrumbs={[{ label: 'Offers' }]}
        description="Explore current promotions and discounts for your next project."
        eyebrow="Promotions"
        title="Find the right offer for your next project"
      />

      <main className="dm-section pt-4">
        <div className="dm-container">
          {loading && (
            <div className="text-center py-5 dm-muted">
              Loading active offers...
            </div>
          )}

          {!loading && error && (
            <div className="dm-card p-4 mb-4" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && offers.length > 0 && (
            <div className="row g-4">
              {offers.map((offer) => (
                <div className="col-md-6 col-lg-4" key={offer.id}>
                  <article className="dm-card p-4 h-100">
                    <span className="dm-preview-label dm-preview-label--inline">
                      Active offer
                    </span>

                    <h2 className="h3 mt-3">
                      {formatDiscount(offer)}
                    </h2>

                    <p className="dm-muted">
                      {offer.description || 'Special DevMarket promotion.'}
                    </p>

                    <div className="dm-card p-3 mb-3">
                      <small className="dm-muted d-block mb-1">
                        Coupon code
                      </small>

                      <div className="d-flex justify-content-between align-items-center gap-2">
                        <strong>{offer.code}</strong>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light"
                          onClick={() => copyCode(offer.code)}
                        >
                          {copiedCode === offer.code ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <p className="small dm-muted mb-2">
                      Minimum order: ₹
                      {Number(offer.minimum_order_amount).toLocaleString('en-IN')}
                    </p>

                    {offer.maximum_discount_amount !== null && (
                      <p className="small dm-muted mb-2">
                        Maximum discount: ₹
                        {Number(offer.maximum_discount_amount).toLocaleString('en-IN')}
                      </p>
                    )}

                    <p className="small dm-muted mb-0">
                      Valid until:{' '}
                      {new Date(offer.expiry_date).toLocaleDateString('en-IN')}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && offers.length === 0 && (
            <EmptyState
              description="There are no active offers available right now. Please check again later."
              title="No active offers"
            />
          )}
        </div>
      </main>
    </SiteShell>
  )
}

export default OffersPage