import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useMarketplace from '../context/useMarketplace'
import { fetchPortfolio } from '../services/projectService'
import { Badge, EmptyState, PriceDisplay } from '../components/common/Feedback'
import { Breadcrumb } from '../components/common/PageHeader'
import { TechnologyBadge } from '../components/common/ProductTools'
import { PrimaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'

function PortfolioDetailsPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const { addToCart } = useMarketplace()

  useEffect(() => {
    fetchPortfolio(id).then(setItem).catch(() => setError('This portfolio is unavailable or has not been published.'))
  }, [id])

  if (error) return <SiteShell><main className="dm-section"><div className="dm-container"><EmptyState description={error} title="Portfolio unavailable" /></div></main></SiteShell>
  if (!item) return <SiteShell><main className="dm-section"><div className="dm-container"><EmptyState description="Loading the published portfolio details." title="Loading portfolio" /></div></main></SiteShell>
  const technologies = [item.frontend_technology, item.backend_technology, ...(item.programming_languages || []), ...(item.frameworks || []), ...(item.libraries || []), ...(item.animation_technology || [])].filter(Boolean)
  const screenshots = item.previews?.filter((preview) => ['screenshot', 'image_gallery'].includes(preview.preview_type)) || []
  return (
    <SiteShell>
      <main className="dm-section pt-4">
        <div className="dm-container">
          <Breadcrumb items={[{ label: 'Portfolio store', to: '/portfolios' }, { label: item.title }]} />
          <div className="row g-5 mt-1 align-items-start">
            <div className="col-lg-7">
              <div className="dm-gallery-main"><span className="dm-preview-label">Protected portfolio preview</span>{item.previews?.find((preview) => preview.preview_type === 'live_demo')?.preview_url ? <a className="dm-btn dm-btn--primary" href={item.previews.find((preview) => preview.preview_type === 'live_demo').preview_url} rel="noreferrer" target="_blank">Open live demo</a> : <span className="dm-gallery-main__word">Portfolio</span>}</div>
              {screenshots.length > 0 && <div className="row g-3 mt-1">{screenshots.map((preview) => <div className="col-4" key={preview.id}>{preview.thumbnail_image ? <img alt={preview.description || item.title} className="img-fluid rounded" src={preview.thumbnail_image} /> : <div className="dm-gallery-thumb" />}</div>)}</div>}
            </div>
            <div className="col-lg-5">
              <Badge>{item.category?.name || item.portfolio_type}</Badge>
              <h1 className="mt-3">{item.title}</h1>
              <p className="lead dm-muted">{item.full_description}</p>
              <div className="d-flex flex-wrap gap-2 mb-4">{technologies.map((technology) => <TechnologyBadge key={technology}>{technology}</TechnologyBadge>)}</div>
              <div className="dm-purchase-card"><div className="d-flex justify-content-between align-items-center mb-3"><span className="dm-muted">Base price</span><PriceDisplay amount={item.base_price} /></div><PrimaryButton className="w-100" onClick={() => addToCart(item)}>Add to cart</PrimaryButton><p className="dm-purchase-note mt-3">Additional customization services are listed separately from the base price.</p></div>
            </div>
          </div>
          <section className="dm-detail-content mt-5"><h2>Template details</h2><div className="row g-4"><div className="col-md-6"><h3 className="h5">Features</h3><ul>{(item.features || []).map((feature) => <li key={feature}>{feature}</li>)}</ul><h3 className="h5 mt-4">Included sections</h3><ul>{(item.included_sections || []).map((section) => <li key={section}>{section}</li>)}</ul></div><div className="col-md-6"><p><strong>Responsive:</strong> {item.responsive_support ? 'Yes' : 'No'}</p><p><strong>Dark mode:</strong> {item.dark_mode_support ? 'Yes' : 'No'}</p><p><strong>SEO support:</strong> {item.seo_support ? 'Yes' : 'No'}</p><p><strong>Documentation:</strong> {item.documentation_included ? 'Included' : 'Not included'}</p><h3 className="h5 mt-4">Customization options</h3>{item.customization_options?.length ? <ul>{item.customization_options.map((option) => <li key={option.id}>{option.option_name} — <PriceDisplay amount={option.additional_price} /></li>)}</ul> : <p className="dm-muted">No customization services are currently available.</p>}</div></div></section>
        </div>
      </main>
    </SiteShell>
  )
}

export default PortfolioDetailsPage
