import { FaCircleNotch, FaRegFolderOpen, FaStar } from 'react-icons/fa'

function Badge({ children }) {
  return <span className="dm-badge">{children}</span>
}

function LoadingSpinner({ label = 'Loading' }) {
  return (
    <span aria-label={label} className="spinner-border spinner-border-sm text-primary" role="status">
      <span className="visually-hidden">{label}</span>
    </span>
  )
}

function EmptyState({ title = 'Nothing here yet', description = 'New content will appear here soon.' }) {
  return (
    <div className="dm-card p-5 text-center">
      <FaRegFolderOpen aria-hidden="true" className="mb-3 text-primary" size={28} />
      <h3 className="h5">{title}</h3>
      <p className="dm-muted mb-0">{description}</p>
    </div>
  )
}

function RatingDisplay({ rating = 5, count }) {
  return (
    <span className="dm-rating" aria-label={`${rating} out of 5 stars`}>
      <FaStar aria-hidden="true" />
      {rating.toFixed(1)}
      {count !== undefined && <span className="dm-muted">({count})</span>}
    </span>
  )
}

function PriceDisplay({ amount = '—', currency = '₹' }) {
  return <span className="dm-price">{amount === '—' ? amount : `${currency}${amount}`}</span>
}

function SpinnerIcon() {
  return <FaCircleNotch aria-hidden="true" className="fa-spin" />
}

export { Badge, EmptyState, LoadingSpinner, PriceDisplay, RatingDisplay, SpinnerIcon }
