import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MarketplaceProvider from './context/MarketplaceProvider'
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

function App() {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<ProjectsPage />} path="/projects" />
          <Route element={<ProjectDetailsPage />} path="/projects/:id" />
          <Route element={<PortfoliosPage />} path="/portfolios" />
          <Route element={<PortfolioDetailsPage />} path="/portfolios/:id" />
          <Route element={<OffersPage />} path="/offers" />
          <Route element={<AboutPage />} path="/about" />
          <Route element={<ContactPage />} path="/contact" />
          <Route element={<AuthPages />} path="/login" />
          <Route element={<AuthPages />} path="/register" />
          <Route element={<CartPage />} path="/cart" />
          <Route element={<CheckoutPage />} path="/checkout" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </BrowserRouter>
    </MarketplaceProvider>
  )
}

export default App
