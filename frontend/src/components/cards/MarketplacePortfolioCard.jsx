import { FaDesktop } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import useMarketplace from '../../context/useMarketplace'
import { Badge, PriceDisplay } from '../common/Feedback'
import { TechnologyBadge, WishlistButton } from '../common/ProductTools'
import { SecondaryButton } from '../common/Buttons'

function MarketplacePortfolioCard({ item }) {
  const { addToCart, toggleWishlist, wishlist } = useMarketplace()
  const inWishlist = wishlist.some((entry) => entry.id === item.id)

  const technologies = [
    item.frontend_technology,
    ...(item.frameworks || []),
    ...(item.libraries || []),
    ...(item.animation_technology || []),
  ].filter(Boolean)
  return (
    <article className="dm-card dm-market-card h-100">
      <div className="dm-portfolio-preview__screen dm-market-card__preview"><FaDesktop aria-hidden="true" className="text-primary" size={30} /><span className="dm-preview-label">Design preview</span></div>
      <div className="dm-card__body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3"><Badge>{item.category?.name || item.portfolio_type}</Badge><WishlistButton active={inWishlist} onClick={() => toggleWishlist(item)} /></div>
        <h2 className="h5">{item.title}</h2>
        <p className="dm-muted small">{item.short_description}</p>
        <div className="d-flex flex-wrap gap-1 mb-4">{technologies.map((technology) => <TechnologyBadge key={technology}>{technology}</TechnologyBadge>)}</div>
        <div className="d-flex align-items-center justify-content-between gap-2 mt-auto">
          <PriceDisplay amount={item.base_price} />
          <div className="d-flex gap-2"><a className="dm-btn dm-btn--secondary" href={item.previews?.find((preview) => preview.preview_type === 'live_demo')?.preview_url || '#'} rel="noreferrer" target="_blank">Live demo</a><Link to={`/portfolios/${item.slug}`}><SecondaryButton>Details</SecondaryButton></Link></div>
        </div>
        <button className="dm-btn dm-btn--primary w-100 mt-2" onClick={() => addToCart(item)} type="button">Add to cart</button>
      </div>
    </article>
  )
}

export default MarketplacePortfolioCard
