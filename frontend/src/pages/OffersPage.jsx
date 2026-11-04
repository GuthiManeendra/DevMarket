import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/Feedback'
import SiteShell from '../layouts/SiteShell'

function OffersPage() {
  return (
    <SiteShell>
      <PageHeader breadcrumbs={[{ label: 'Offers' }]} description="When verified promotions are active, they will be presented here with clear terms and eligibility." eyebrow="Promotions" title="Find the right solution for your next project" />
      <main className="dm-section pt-4"><div className="dm-container"><div className="row g-4">{['First purchase offers', 'Student offers', 'Project bundles', 'Portfolio offers', 'Seasonal campaigns'].map((title) => <div className="col-md-6 col-lg-4" key={title}><div className="dm-card p-4 h-100"><h2 className="h5">{title}</h2><p className="dm-muted small">Offer details, applicable products, expiry, and coupon code will appear only when supplied by the backend.</p><span className="dm-preview-label dm-preview-label--inline">No active offer</span></div></div>)}</div><div className="mt-5"><EmptyState description="There are no active offers or coupons to display right now." title="Offers will appear here when available" /></div></div></main>
    </SiteShell>
  )
}

export default OffersPage
