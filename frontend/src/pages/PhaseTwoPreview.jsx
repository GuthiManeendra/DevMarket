import { FaCode, FaLayerGroup, FaPalette } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'
import { Badge } from '../components/common/Feedback'
import BrandLogo from '../components/common/BrandLogo'
import SectionHeading from '../components/common/SectionHeading'
import CategoryCard from '../components/cards/CategoryCard'
import SiteShell from '../layouts/SiteShell'

const palette = [
  { name: 'Deep navy', value: '#080D1B', color: '#080D1B' },
  { name: 'Electric blue', value: '#3B82F6', color: '#3B82F6' },
  { name: 'Violet', value: '#8B5CF6', color: '#8B5CF6' },
  { name: 'Cyan', value: '#22D3EE', color: '#22D3EE' },
]

function PhaseTwoPreview() {
  return (
    <SiteShell>
      <main>
        <section className="dm-section">
          <div className="dm-container">
            <div className="dm-hero-panel">
              <div className="position-relative z-1">
                <BrandLogo />
                <div className="dm-eyebrow mt-5">Phase 2 design system</div>
                <h1 className="mt-3">Build boldly. <span className="dm-gradient-text">Ship beautifully.</span></h1>
                <p className="lead mt-4">
                  DevMarket is a premium home for developer projects and digital portfolios.
                  This screen previews the brand foundation before marketplace pages are built.
                </p>
                <div className="d-flex flex-wrap gap-3 mt-4">
                  <PrimaryButton>Explore the system</PrimaryButton>
                  <Link to="/about"><SecondaryButton>Our direction</SecondaryButton></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dm-section pt-0">
          <div className="dm-container">
            <SectionHeading
              description="A focused set of reusable foundations keeps the future marketplace consistent, fast, and accessible."
              eyebrow="The foundation"
              title="One system. Every digital product."
            />
            <div className="row g-4">
              <div className="col-md-4">
                <CategoryCard icon={<FaPalette size={24} />} name="Visual language" description="Tokens for color, type, rhythm, and motion." />
              </div>
              <div className="col-md-4">
                <CategoryCard icon={<FaLayerGroup size={24} />} name="Composable UI" description="Primitives that scale from cards to pages." />
              </div>
              <div className="col-md-4">
                <CategoryCard icon={<FaCode size={24} />} name="Developer-first" description="Accessible, responsive Bootstrap-compatible patterns." />
              </div>
            </div>
          </div>
        </section>

        <section className="dm-section pt-0">
          <div className="dm-container">
            <SectionHeading description="The core brand colors are designed to remain legible across premium dark surfaces and clean light interfaces." eyebrow="Color palette" title="Signal through color." />
            <div className="row g-3">
              {palette.map((color) => (
                <div className="col-6 col-lg-3" key={color.name}>
                  <div className="dm-token-card">
                    <div className="dm-swatch" style={{ backgroundColor: color.color }} />
                    <strong>{color.name}</strong>
                    <div className="dm-muted small mt-1">{color.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
              <Badge>Premium by design</Badge>
              <span className="dm-muted small">Discover. Create. Innovate.</span>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}

export default PhaseTwoPreview
