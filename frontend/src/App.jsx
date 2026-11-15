
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import MarketplaceProvider from './context/MarketplaceProvider'
import useMarketplace from './context/useMarketplace'
import AnalyticsTracker from './components/seo/AnalyticsTracker'

import { PageTransition, AnimatedRoutes } from './components/animations/PageTransition'

import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import AuthPages from './pages/AuthPages'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import OffersPage from './pages/OffersPage'
import PortfoliosPage from './pages/PortfoliosPage'
import PortfolioDetailsPage from './pages/PortfolioDetailsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ProjectsPage from './pages/ProjectsPage'
import PurchasesPage from './pages/PurchasesPage'

// Protect marketplace pages.
// Visitors can browse for 7 seconds before being redirected to login.
function ProtectedRoute({ children }) {
  const { user, authLoading } = useMarketplace()
  const location = useLocation()

  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    if (authLoading || user?.isLoggedIn) {
      setShowAuth(false)
      return
    }

    const timer = setTimeout(() => {
      setShowAuth(true)
    }, 7000)

    return () => clearTimeout(timer)
  }, [authLoading, user])

  if (authLoading) {
    return null
  }

  if (!user?.isLoggedIn && !showAuth) {
    return children
  }

  if (!user?.isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return children
}

// Login and registration routes.
function PublicAuthRoute() {
  const { user, authLoading } = useMarketplace()
  const location = useLocation()

  if (authLoading) {
    return null
  }

  if (user?.isLoggedIn) {
    const destination = location.state?.from

    const redirectPath = destination
      ? `${destination.pathname || '/'}${destination.search || ''}${destination.hash || ''}`
      : '/'

    return <Navigate to={redirectPath} replace />
  }

  return <AuthPages />
}

// Application routes with page transitions.
function AppRoutes() {
  return (
    <Routes>
      {/* Public authentication pages */}
      <Route path="/login" element={<PublicAuthRoute />} />
      <Route path="/register" element={<PublicAuthRoute />} />

      {/* Protected marketplace pages */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageTransition><Home /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <PageTransition><ProjectsPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <PageTransition><ProjectDetailsPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolios"
        element={
          <ProtectedRoute>
            <PageTransition><PortfoliosPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolios/:id"
        element={
          <ProtectedRoute>
            <PageTransition><PortfolioDetailsPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <PageTransition><OffersPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <PageTransition><AboutPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <PageTransition><ContactPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <PageTransition><CartPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <PageTransition><CheckoutPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/purchases"
        element={
          <ProtectedRoute>
            <PageTransition><PurchasesPage /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <PageTransition><NotFoundPage /></PageTransition>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <AnimatedRoutes>
          <AppRoutes />
        </AnimatedRoutes>
      </BrowserRouter>
    </MarketplaceProvider>
  )
}

export default App
