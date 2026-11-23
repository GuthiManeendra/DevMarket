import { useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { FaArrowRight, FaCheckCircle, FaCode, FaFileCode, FaLock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'
import { PrimaryButton, SecondaryButton } from '../common/Buttons'
import HeroScene from './HeroScene'

const trustItems = [
  { icon: FaCheckCircle, label: 'Preview before you choose' },
  { icon: FaCode, label: 'Production-ready code' },
  { icon: FaLock, label: 'Secure checkout' },
]

const pillars = [
  { icon: FaCode, label: 'Dev projects' },
  { icon: FaFileCode, label: 'Portfolio templates' },
  { icon: FaLock, label: 'Verified purchases' },
]

function HeroSection() {
  const heroRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const finePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches
  const spotlightEnabled = !reducedMotion && finePointer

  const handlePointerMove = (event) => {
    if (!spotlightEnabled || !heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    heroRef.current.style.setProperty(
      '--rh-mx',
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    )
    heroRef.current.style.setProperty(
      '--rh-my',
      `${((event.clientY - rect.top) / rect.height) * 100}%`,
    )
  }

  return (
    <section
      className="dm-home-hero"
      onPointerMove={handlePointerMove}
      ref={heroRef}
    >
      <div className="dm-home-hero__spotlight" aria-hidden="true" />
      <div className="dm-home-hero__glow dm-home-hero__glow--mint" aria-hidden="true" />
      <div className="dm-home-hero__glow dm-home-hero__glow--violet" aria-hidden="true" />
      <div className="dm-home-hero__grid" aria-hidden="true" />
      <div className="dm-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="dm-eyebrow dm-reveal">
              <BrandLogo compact />
              <span className="dm-home-hero__tagline">The House of Repositories</span>
            </div>
            <h1 className="dm-home-hero__title dm-reveal dm-reveal--delay-1">
              Every build has a <span>home.</span>
            </h1>
            <p className="dm-home-hero__copy dm-reveal dm-reveal--delay-2">
              Repohaus is a curated marketplace for production-ready developer projects and
              portfolio templates — discover, preview, and ship with secure checkout.
            </p>
            <div className="d-flex flex-wrap gap-3 dm-reveal dm-reveal--delay-3">
              <Link to="/projects"><PrimaryButton>Explore projects <FaArrowRight aria-hidden="true" /></PrimaryButton></Link>
              <Link to="/portfolios"><SecondaryButton>Explore portfolios</SecondaryButton></Link>
            </div>
            <div className="dm-hero-trust dm-reveal dm-reveal--delay-4">
              {trustItems.map(({ icon: Icon, label }) => (
                <span key={label}><Icon aria-hidden="true" /> {label}</span>
              ))}
            </div>
            <div className="dm-hero-pillars dm-reveal dm-reveal--delay-4">
              {pillars.map(({ icon: Icon, label }) => (
                <span className="dm-hero-pillar" key={label}>
                  <Icon aria-hidden="true" /> {label}
                </span>
              ))}
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
