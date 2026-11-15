import { FaBolt, FaCode } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import useBuyNow from '../../hooks/useBuyNow'
import { Badge, PriceDisplay } from '../common/Feedback'
import { TechnologyBadge } from '../common/ProductTools'
import { SecondaryButton } from '../common/Buttons'

function hasPrice(item) {
  return item?.price !== null && item?.price !== undefined && item?.price !== ''
}

function MarketplaceProjectCard({ item }) {
  const { buyNow } = useBuyNow()

  return (
    <article className="dm-card dm-market-card h-100">
      <div className="dm-card__media"><FaCode aria-hidden="true" className="text-primary" size={30} /><span className="dm-preview-label">Design preview</span></div>
      <div className="dm-card__body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3"><Badge>{item.category?.name || item.category}</Badge></div>
        <h2 className="h5">{item.title}</h2>
        <p className="dm-muted small">{item.short_description || item.description}</p>
        <div className="d-flex flex-wrap gap-1 mb-4">{(item.technologies || []).map((technology) => <TechnologyBadge key={technology}>{technology}</TechnologyBadge>)}</div>
        <div className="d-flex align-items-center justify-content-between gap-2 mt-auto">
          {hasPrice(item) ? (
            <span className="dm-price-block">
              {item.compare_at_price && Number(item.compare_at_price) > Number(item.price) && (
                <span className="dm-price-compare"><PriceDisplay amount={item.compare_at_price} /></span>
              )}
              <PriceDisplay amount={item.price} />
              {item.discount_percentage > 0 && <span className="dm-discount-badge">{item.discount_percentage}% off</span>}
            </span>
          ) : (
            <span className="dm-muted small">Price unavailable</span>
          )}
          <div className="d-flex gap-2">
            <Link to={`/projects/${item.slug || item.id}`}><SecondaryButton>Details</SecondaryButton></Link>
            {hasPrice(item) && (
              <button className="dm-btn dm-btn--primary" onClick={() => buyNow({ type: 'project', id: item.id })} type="button">
                <FaBolt aria-hidden="true" className="me-1" /> Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default MarketplaceProjectCard
