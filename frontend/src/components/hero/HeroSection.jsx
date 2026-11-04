import { FaArrowRight, FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'
import { PrimaryButton, SecondaryButton } from '../common/Buttons'
import HeroScene from './HeroScene'

function HeroSection() {
  return (
    <section className="dm-home-hero">
      <div className="dm-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="dm-eyebrow dm-reveal"><BrandLogo compact /> A marketplace for makers</div>
            <h1 className="dm-home-hero__title dm-reveal dm-reveal--delay-1">
              Build your future. <span>One project at a time.</span>
            </h1>
            <p className="dm-home-hero__copy dm-reveal dm-reveal--delay-2">
              Explore premium academic projects, innovative technology solutions, and professional developer portfolios built to accelerate your journey.
            </p>
            <div className="d-flex flex-wrap gap-3 dm-reveal dm-reveal--delay-3">
              <Link to="/projects"><PrimaryButton>Explore projects <FaArrowRight aria-hidden="true" /></PrimaryButton></Link>
              <Link to="/portfolios"><SecondaryButton>Explore portfolios</SecondaryButton></Link>
            </div>
            <div className="dm-hero-trust dm-reveal dm-reveal--delay-4">
              <span><FaCheckCircle aria-hidden="true" /> Preview before you choose</span>
              <span><FaCheckCircle aria-hidden="true" /> Built for developers</span>
            </div>
          </div>
          <div className="col-lg-6">
            <HeroScene />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
