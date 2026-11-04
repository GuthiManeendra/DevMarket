import { FaHeart, FaSearch, FaShoppingBag } from 'react-icons/fa'
import { Link, NavLink } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'
import { PrimaryButton } from '../common/Buttons'

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore Projects', to: '/projects' },
  { label: 'Portfolio Store', to: '/portfolios' },
  { label: 'Premium Collections', to: '/collections' },
  { label: 'Offers', to: '/offers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function MainNavbar() {
  return (
    <header className="dm-navbar">
      <nav className="navbar navbar-expand-lg">
        <div className="dm-container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Link className="navbar-brand" to="/">
            <BrandLogo />
          </Link>
          <button
            aria-controls="devmarket-navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
            className="navbar-toggler"
            data-bs-target="#devmarket-navigation"
            data-bs-toggle="collapse"
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="devmarket-navigation">
            <div className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center gap-3">
              {navigationItems.map((item) => (
                <NavLink
                  className={({ isActive }) => `dm-nav-link ${isActive ? 'active' : ''}`.trim()}
                  key={item.to}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="d-flex align-items-center gap-1">
                <button aria-label="Search" className="dm-btn dm-btn--icon" type="button">
                  <FaSearch aria-hidden="true" />
                </button>
                <button aria-label="Wishlist" className="dm-btn dm-btn--icon" type="button">
                  <FaHeart aria-hidden="true" />
                </button>
                <button aria-label="Cart" className="dm-btn dm-btn--icon" type="button">
                  <FaShoppingBag aria-hidden="true" />
                </button>
              </div>
              <Link className="dm-nav-link" to="/login">
                Login
              </Link>
              <PrimaryButton>Register</PrimaryButton>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default MainNavbar
