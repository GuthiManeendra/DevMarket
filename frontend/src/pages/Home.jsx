import { FaArrowUp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import FAQ from '../components/sections/FAQ'
import HowItWorks from '../components/sections/HowItWorks'
import OffersAndReviews from '../components/sections/OffersAndReviews'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import CategorySection from '../components/categories/CategorySection'
import FeaturedProjects from '../components/projects/FeaturedProjects'
import PortfolioShowcase from '../components/portfolios/PortfolioShowcase'
import HeroSection from '../components/hero/HeroSection'
import SiteShell from '../layouts/SiteShell'

function Home() {
  return (
    <SiteShell>
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedProjects />
        <PortfolioShowcase />
        <WhyChooseUs />
        <HowItWorks />
        <OffersAndReviews />
        <FAQ />
        <section className="dm-home-cta">
          <div className="dm-container">
            <div className="dm-home-cta__inner">
              <div>
                <div className="dm-eyebrow">Your next build starts here</div>
                <h2>Bring your ambition to the marketplace.</h2>
              </div>
              <Link to="/projects"><button className="dm-btn dm-btn--primary" type="button">Start exploring <FaArrowUp aria-hidden="true" /></button></Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}

export default Home
