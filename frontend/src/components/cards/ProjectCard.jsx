import { FaCode } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Badge, PriceDisplay, RatingDisplay } from '../common/Feedback'
import { SecondaryButton } from '../common/Buttons'

function ProjectCard({ title = 'Project title', category = 'Category', technology = 'Technology', price = '—' }) {
  return (
    <article className="dm-card h-100">
      <div className="dm-card__media">
        <FaCode aria-hidden="true" className="text-primary" size={32} />
      </div>
      <div className="dm-card__body">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
          <Badge>{category}</Badge>
          <RatingDisplay />
        </div>
        <h3>{title}</h3>
        <p className="dm-muted small mb-3">{technology}</p>
        <div className="d-flex align-items-center justify-content-between gap-3">
          <PriceDisplay amount={price} />
          <Link to="/projects/details">
            <SecondaryButton>View details</SecondaryButton>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
