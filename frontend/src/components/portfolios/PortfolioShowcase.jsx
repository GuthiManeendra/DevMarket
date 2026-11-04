import { FaArrowRight, FaBolt, FaDesktop } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Badge } from '../common/Feedback'
import SectionHeading from '../common/SectionHeading'

function PortfolioPreview({ premium = false }) {
  return (
    <article className={`dm-portfolio-preview ${premium ? 'dm-portfolio-preview--premium' : ''}`}>
      <div className="dm-portfolio-preview__screen">
        <div className="dm-portfolio-preview__nav"><span /><span /><span /></div>
        <div className="dm-portfolio-preview__hero">
          <small>{premium ? 'Motion / Interaction' : 'Profile / Work'}</small>
          <strong>{premium ? 'Make an entrance.' : 'Make your work visible.'}</strong>
          <div className="dm-portfolio-preview__button" />
        </div>
        <div className="dm-portfolio-preview__blocks"><span /><span /><span /></div>
      </div>
      <div className="p-4">
        <Badge>{premium ? 'Premium animated' : 'Standard professional'}</Badge>
        <h3 className="h5 mt-3">{premium ? 'A portfolio with presence' : 'A portfolio that works'}</h3>
        <p className="dm-muted small">{premium ? 'Interactive sections, expressive motion, and a sharper point of view.' : 'A clear, responsive foundation for your profile, skills, and projects.'}</p>
        <div className="d-flex flex-wrap gap-2 small dm-muted mb-4"><span>React</span><span>•</span><span>Responsive</span><span>•</span><span>Customizable</span></div>
        <div className="d-flex flex-wrap gap-2">
          <button className="dm-btn dm-btn--secondary" type="button"><FaDesktop aria-hidden="true" /> Live demo</button>
          <Link to="/portfolios"><button className="dm-btn dm-btn--primary" type="button">Explore <FaArrowRight aria-hidden="true" /></button></Link>
        </div>
      </div>
    </article>
  )
}

function PortfolioShowcase() {
  return (
    <section className="dm-section" id="portfolios">
      <div className="dm-container">
        <SectionHeading
          description="Showcase your skills, projects, and experience with professionally designed developer portfolios."
          eyebrow="Make your mark"
          title="Portfolios that make you stand out"
        />
        <div className="row g-4">
          <div className="col-lg-6"><PortfolioPreview /></div>
          <div className="col-lg-6"><PortfolioPreview premium /></div>
        </div>
        <div className="dm-inline-note mt-4">
          <FaBolt aria-hidden="true" />
          <span>Live previews are designed to showcase the experience. Source files remain protected until purchase.</span>
        </div>
      </div>
    </section>
  )
}

export default PortfolioShowcase
