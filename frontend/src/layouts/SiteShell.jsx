import { FaArrowUp, FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import MainNavbar from '../components/navigation/MainNavbar'
import BrandLogo from '../components/common/BrandLogo'

const COPYRIGHT_YEAR = new Date().getFullYear()

function SiteShell({ children }) {
  return (
    <div className="dm-shell">
      <MainNavbar />
      {children}
      <footer className="dm-footer">
        <div className="dm-container">
          <div className="row g-5">
            <div className="col-lg-4">
              <Link to="/"><BrandLogo /></Link>
              <p className="dm-footer__intro">A considered marketplace for the next generation of developers and digital makers.</p>
              <p className="small mb-0">Discover. Create. Innovate.</p>
            </div>
            <div className="col-6 col-lg-2">
              <h2>Marketplace</h2>
              <Link to="/projects">Explore projects</Link>
              <Link to="/projects">AI projects</Link>
              <Link to="/projects">Python projects</Link>
              <Link to="/projects">Java projects</Link>
              <Link to="/portfolios">Portfolio store</Link>
            </div>
            <div className="col-6 col-lg-2">
              <h2>Company</h2>
              <Link to="/about">About us</Link>
              <Link to="/contact">Contact</Link>
              <span>Careers (soon)</span>
            </div>
            <div className="col-6 col-lg-2">
              <h2>Support</h2>
              <Link to="/contact">Help center</Link>
              <Link to="/#faq">FAQs</Link>
              <Link to="/contact">Technical support</Link>
              <span>Refund policy</span>
            </div>
            <div className="col-6 col-lg-2">
              <h2>Legal</h2>
              <span>Terms and conditions</span>
              <span>Privacy policy</span>
              <span>Licensing policy</span>
            </div>
          </div>
          <div className="dm-footer__bottom">
            <span>© {COPYRIGHT_YEAR} DevMarket. All rights reserved.</span>
            <div className="d-flex align-items-center gap-2">
              <a aria-label="Email placeholder" className="dm-footer__social" href="mailto:hello@example.com"><FaEnvelope aria-hidden="true" /></a>
              <a aria-label="GitHub placeholder" className="dm-footer__social" href="#github"><FaGithub aria-hidden="true" /></a>
              <a aria-label="LinkedIn placeholder" className="dm-footer__social" href="#linkedin"><FaLinkedin aria-hidden="true" /></a>
              <a aria-label="Twitter placeholder" className="dm-footer__social" href="#twitter"><FaTwitter aria-hidden="true" /></a>
              <a aria-label="Back to top" className="dm-footer__social" href="#top"><FaArrowUp aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SiteShell
