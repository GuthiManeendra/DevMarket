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
import SEO from '../components/seo/SEO'
import { organizationJsonLd, websiteJsonLd } from '../utils/seo'
import { ScrollReveal } from '../components/animations/ScrollReveal'

function Home() {
  return (
    <SiteShell>
      <SEO
        description="Browse production-ready software projects and professional portfolio templates. Buy verified code projects and developer portfolio templates with secure checkout on Repohaus."
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
        path="/"
        title="Marketplace for Developer Projects & Portfolio Templates"
      />
      <main>
        <HeroSection />
        <ScrollReveal once={true}>
          <CategorySection />
        </ScrollReveal>
        <ScrollReveal once={true} delay={0.1}>
          <FeaturedProjects />
        </ScrollReveal>
        <ScrollReveal once={true} delay={0.2}>
          <PortfolioShowcase />
        </ScrollReveal>
        <ScrollReveal once={true} delay={0.3}>
          <WhyChooseUs />
        </ScrollReveal>
        <ScrollReveal once={true} delay={0.4}>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal once={true} delay={0.5}>
          <OffersAndReviews />
        </ScrollReveal>
        <ScrollReveal once={true} delay={0.6}>
          <FAQ />
        </ScrollReveal>
        <ScrollReveal once={true} delay={0.7}>
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
        </ScrollReveal>
      </main>
    </SiteShell>
  )
}

export default Home
