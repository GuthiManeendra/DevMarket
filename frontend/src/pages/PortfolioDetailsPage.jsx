import { useParams } from 'react-router-dom'
import { demoPortfolios } from '../data/demoCatalog'
import useMarketplace from '../context/useMarketplace'
import { Badge, EmptyState, PriceDisplay } from '../components/common/Feedback'
import { Breadcrumb } from '../components/common/PageHeader'
import { TechnologyBadge } from '../components/common/ProductTools'
import { PrimaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'

function PortfolioDetailsPage() {
  const { id } = useParams()
  const item = demoPortfolios.find((portfolio) => portfolio.id === id) || demoPortfolios[0]
  const { addToCart } = useMarketplace()
  return (
    <SiteShell>
      <main className="dm-section pt-4">
        <div className="dm-container">
          <Breadcrumb items={[{ label: 'Portfolio store', to: '/portfolios' }, { label: item.title }]} />
          <div className="row g-5 mt-1 align-items-start">
            <div className="col-lg-7">
              <div className="dm-gallery-main"><span className="dm-preview-label">Protected live preview</span><div className="dm-gallery-main__word">Portfolio</div></div>
              <div className="row g-3 mt-1"><div className="col-4"><div className="dm-gallery-thumb" /></div><div className="col-4"><div className="dm-gallery-thumb dm-gallery-thumb--two" /></div><div className="col-4"><div className="dm-gallery-thumb dm-gallery-thumb--three" /></div></div>
            </div>
            <div className="col-lg-5">
              <Badge>{item.category}</Badge>
              <h1 className="mt-3">{item.title}</h1>
              <p className="lead dm-muted">{item.description}</p>
              <div className="d-flex flex-wrap gap-2 mb-4">{item.technologies.map((technology) => <TechnologyBadge key={technology}>{technology}</TechnologyBadge>)}</div>
              <div className="dm-purchase-card">
                <div className="d-flex justify-content-between align-items-center mb-3"><span className="dm-muted">Price</span><PriceDisplay /></div>
                <PrimaryButton className="w-100" onClick={() => addToCart(item)}>Add preview to cart</PrimaryButton>
                <p className="dm-purchase-note mt-3">Customization availability will be shown from the product record.</p>
              </div>
            </div>
          </div>
          <section className="dm-detail-content mt-5"><h2>Portfolio details</h2><p className="dm-muted">Features, responsive behavior, live demo metadata, license information, and customization options will be connected to the verified portfolio record.</p><EmptyState description="Protected source code is never exposed through preview links." title="More portfolio information is coming with catalog integration" /></section>
        </div>
      </main>
    </SiteShell>
  )
}

export default PortfolioDetailsPage
