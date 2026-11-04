import { FaHeart, FaRegHeart, FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa'
import { PrimaryButton, SecondaryButton } from './Buttons'
import { Badge, EmptyState } from './Feedback'

function WishlistButton({ active, onClick }) {
  return (
    <button aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'} className="dm-btn dm-btn--icon" onClick={onClick} type="button">
      {active ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
    </button>
  )
}

function SearchBar({ value, onChange, onClear, onSubmit }) {
  return (
    <form className="dm-search-bar" onSubmit={onSubmit}>
      <FaSearch aria-hidden="true" />
      <input aria-label="Search projects" onChange={(event) => onChange(event.target.value)} placeholder="Search projects, technologies..." value={value} />
      {value && <button aria-label="Clear search" onClick={onClear} type="button"><FaTimes aria-hidden="true" /></button>}
      <PrimaryButton type="submit">Search</PrimaryButton>
    </form>
  )
}

function FilterSidebar({ categories, selectedCategory, onCategoryChange, onClear, sort, onSortChange }) {
  return (
    <aside className="dm-filter-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 mb-0"><FaSlidersH aria-hidden="true" className="me-2 text-primary" />Filters</h2>
        <button className="dm-text-button" onClick={onClear} type="button">Clear all</button>
      </div>
      <label className="form-label fw-semibold" htmlFor="category-filter">Category</label>
      <select className="dm-input mb-4" id="category-filter" onChange={(event) => onCategoryChange(event.target.value)} value={selectedCategory}>
        <option value="">All categories</option>
        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      <label className="form-label fw-semibold" htmlFor="sort-filter">Sort by</label>
      <select className="dm-input" id="sort-filter" onChange={(event) => onSortChange(event.target.value)} value={sort}>
        <option value="relevance">Relevance</option>
        <option value="name">Name</option>
        <option value="category">Category</option>
      </select>
      <div className="dm-filter-note mt-4">
        <Badge>API ready</Badge>
        <p>Filters will use authoritative catalog data after Django integration.</p>
      </div>
    </aside>
  )
}

function LoadingSkeleton() {
  return <div aria-label="Loading" className="dm-card dm-skeleton-card" role="status"><div /><div /><div /></div>
}

function ErrorState({ message = 'Something went wrong. Please try again.' }) {
  return <EmptyState description={message} title="Unable to load this content" />
}

function ProductGrid({ children }) {
  return <div className="row g-4">{children}</div>
}

function TechnologyBadge({ children }) {
  return <span className="dm-tech-badge">{children}</span>
}

function Pagination({ page = 1, hasNext = false, onChange }) {
  return (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-center dm-pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" disabled={page === 1} onClick={() => onChange(page - 1)} type="button">Previous</button></li>
        <li className="page-item active"><span className="page-link">{page}</span></li>
        <li className={`page-item ${!hasNext ? 'disabled' : ''}`}><button className="page-link" disabled={!hasNext} onClick={() => onChange(page + 1)} type="button">Next</button></li>
      </ul>
    </nav>
  )
}

function ProductActions({ item, inWishlist, onWishlist, onAdd }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <WishlistButton active={inWishlist} onClick={onWishlist} />
      <LinkButton to={`/projects/${item.id}`}>View details</LinkButton>
      <SecondaryButton onClick={onAdd}>Add to cart</SecondaryButton>
    </div>
  )
}

function LinkButton({ children, to }) {
  return <a className="dm-btn dm-btn--secondary" href={to}>{children}</a>
}

export {
  ErrorState,
  FilterSidebar,
  LinkButton,
  LoadingSkeleton,
  Pagination,
  ProductActions,
  ProductGrid,
  SearchBar,
  TechnologyBadge,
  WishlistButton,
}
