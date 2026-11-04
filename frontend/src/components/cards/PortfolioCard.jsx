import { FaDesktop } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Badge, PriceDisplay } from '../common/Feedback'
import { SecondaryButton } from '../common/Buttons'

function PortfolioCard({ title = 'Portfolio concept', premium = false, technology = 'Technology', price = '—' }) {
  return (
    <article className="dm-card h-100">
      <div className="dm-card__media">
        <FaDesktop aria-hidden="true" className="text-primary" size={32} />
      </div>
      <div className="dm-card__body">
        <Badge>{premium ? 'Premium' : 'Standard'}</Badge>
        <h3 className="mt-3">{title}</h3>
        <p className="dm-muted small mb-3">{technology}</p>
        <div className="d-flex align-items-center justify-content-between gap-3">
          <PriceDisplay amount={price} />
          <div className="d-flex gap-2">
            <SecondaryButton>Live demo</SecondaryButton>
            <Link to="/portfolios/details">
              <SecondaryButton>Details</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PortfolioCard
