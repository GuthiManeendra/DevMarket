import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function CategoryCard({ icon, name = 'Category', description = 'Explore curated digital work.' }) {
  return (
    <Link className="dm-card d-block h-100 p-4" to="/projects">
      <div className="text-primary mb-4">{icon}</div>
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <h3 className="h5">{name}</h3>
          <p className="dm-muted small mb-0">{description}</p>
        </div>
        <FaArrowRight aria-hidden="true" className="text-primary" />
      </div>
    </Link>
  )
}

export default CategoryCard
