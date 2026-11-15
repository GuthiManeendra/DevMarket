import { FaArrowRight, FaBolt, FaDesktop } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Badge } from '../common/Feedback'
import SectionHeading from '../common/SectionHeading'

const portfolioSamples = {
  standard: [
    {
      title: 'Personal Developer',
      description: 'A clean professional portfolio for developers.',
      technologies: ['React', 'Bootstrap'],
    },
    {
      title: 'Professional Profile',
      description: 'A modern portfolio for showcasing experience and skills.',
      technologies: ['React', 'Responsive'],
    },
    {
      title: 'Creative Portfolio',
      description: 'A polished layout for projects and achievements.',
      technologies: ['React', 'CSS'],
    },
  ],

  animated: [
    {
      title: 'Motion Developer',
      description: 'An animated portfolio with interactive sections.',
      technologies: ['React', 'Motion'],
    },
    {
      title: 'Creative Experience',
      description: 'A dynamic portfolio with engaging transitions.',
      technologies: ['React', 'Animation'],
    },
    {
      title: 'Premium Showcase',
      description: 'An immersive portfolio experience for professionals.',
      technologies: ['React', '3D Effects'],
    },
  ],
}

function SampleCard({ sample, premium }) {
  return (
    <article className="dm-card h-100">
      <div className="dm-portfolio-preview__screen p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          {premium ? (
            <FaBolt className="text-primary" size={24} />
          ) : (
            <FaDesktop className="text-primary" size={24} />
          )}

          <span className="dm-preview-label">
            Sample design
          </span>
        </div>

        <div className="dm-card__body">
          <h3 className="h5">{sample.title}</h3>
          <p className="dm-muted small mb-0">
            {sample.description}
          </p>
        </div>
      </div>

      <div className="dm-card__body">
        <div className="d-flex flex-wrap gap-2">
          {sample.technologies.map((technology) => (
            <Badge key={technology}>
              {technology}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  )
}

function PortfolioCategoryShowcase({
  title,
  description,
  samples,
  premium = false,
}) {
  return (
    <div className="mb-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="h4 mb-2">{title}</h3>
          <p className="dm-muted mb-0">{description}</p>
        </div>

        <Link
          to="/portfolios"
          className="dm-btn dm-btn--secondary"
        >
          Explore portfolios <FaArrowRight />
        </Link>
      </div>

      <div className="row g-4">
        {samples.map((sample) => (
          <div className="col-md-6 col-lg-4" key={sample.title}>
            <SampleCard
              sample={sample}
              premium={premium}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function PortfolioShowcase() {
  return (
    <section className="dm-section">
      <div className="container">
        <SectionHeading
          eyebrow="Portfolio Templates"
          title="Choose Your Portfolio Style"
          description="Explore professional and animated portfolio templates."
        />

        <PortfolioCategoryShowcase
          title="Standard Professional"
          description="Clean, responsive and professional portfolio designs."
          samples={portfolioSamples.standard}
        />

        <PortfolioCategoryShowcase
          title="Premium Animated"
          description="Interactive and animation-focused portfolio designs."
          samples={portfolioSamples.animated}
          premium
        />

        <p className="dm-muted small text-center mt-4">
          Live previews and downloadable source files are available
          for published portfolio products.
        </p>
      </div>
    </section>
  )
}

export default PortfolioShowcase