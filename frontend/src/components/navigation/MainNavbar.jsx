import { FaHeart, FaSearch, FaShoppingBag, FaUserCircle } from 'react-icons/fa'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import BrandLogo from '../common/BrandLogo'
import { PrimaryButton } from '../common/Buttons'
import useMarketplace from '../../context/useMarketplace'
import { useRef, useEffect } from 'react'

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Portfolio', to: '/portfolios' },
  // { label: 'Premium Collections', to: '/collections' },
  { label: 'Offers', to: '/offers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function MainNavbar() {
  const { user, logout, cart } = useMarketplace()
  const cartIconRef = useRef(null)

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
                <motion.div key={item.to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                  <NavLink
                    className={({ isActive }) => `dm-nav-link ${isActive ? 'active' : ''}`.trim()}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="d-flex align-items-center gap-1">
                <motion.button
                  aria-label="Search"
                  className="dm-btn dm-btn--icon"
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaSearch aria-hidden="true" />
                </motion.button>
                <motion.button
                  aria-label="Wishlist (local preview)"
                  className="dm-btn dm-btn--icon"
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaHeart aria-hidden="true" />
                </motion.button>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.15 }}>
                  <Link aria-label="Cart" className="dm-btn dm-btn--icon position-relative" to="/cart" ref={cartIconRef}>
                    <FaShoppingBag aria-hidden="true" />
                    {cart.length > 0 && (
                      <span className="dm-cart-badge">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </div>

              {user?.isLoggedIn ? (
                <div className="d-flex align-items-center gap-3">
                  <span className="dm-nav-link text-white fw-bold d-inline-flex align-items-center gap-1">
                    <FaUserCircle size={18} /> {user.name}
                  </span>
                  <NavLink className="dm-nav-link" to="/purchases">
                    Purchases
                  </NavLink>
                  <button
                    className="dm-btn dm-btn--secondary btn-sm"
                    onClick={logout}
                    type="button"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <Link className="dm-nav-link" to="/login">
                    Login
                  </Link>
                  <Link to="/register">
                    <PrimaryButton>Get started</PrimaryButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default MainNavbar
