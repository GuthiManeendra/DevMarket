import { Link } from 'react-router-dom'
import MainNavbar from '../components/navigation/MainNavbar'
import BrandLogo from '../components/common/BrandLogo'

function SiteShell({ children }) {
  return (
    <div className="dm-shell">
      <MainNavbar />
      {children}
      <footer className="dm-footer">
        <div className="dm-container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <Link to="/"><BrandLogo /></Link>
          <p className="mb-0 small">Discover. Create. Innovate.</p>
        </div>
      </footer>
    </div>
  )
}

export default SiteShell
