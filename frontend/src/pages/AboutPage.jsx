import { FaArrowRight, FaCompass, FaLightbulb, FaUsers } from 'react-icons/fa'
import { PageHeader } from '../components/common/PageHeader'
import SectionHeading from '../components/common/SectionHeading'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'
import { breadcrumbJsonLd } from '../utils/seo'

function AboutPage() {
  return (
    <SiteShell>
      <SEO
        description="Learn about DevMarket — a digital marketplace helping students, developers, and technology enthusiasts access practical software projects and professional developer portfolio templates."
        jsonLd={breadcrumbJsonLd([{ label: 'Home', to: '/' }, { label: 'About us', to: '/about' }])}
        path="/about"
        title="About DevMarket"
      />
      <PageHeader breadcrumbs={[{ label: 'About us' }]} description="A digital marketplace designed to help students, developers, and technology enthusiasts access practical software projects and professional developer portfolios." eyebrow="The DevMarket point of view" title="A better starting point for your next build" />
      <main>
        <section className="dm-section pt-4"><div className="dm-container"><div className="dm-about-story"><div><div className="dm-eyebrow">About DevMarket</div><h2>Make progress feel possible.</h2></div><p>DevMarket brings projects, portfolios, and practical guidance into one considered experience. It is designed to help people move from an idea to a stronger next step without losing sight of craft.</p></div></div></section>
        <section className="dm-section dm-section--soft"><div className="dm-container"><SectionHeading align="center" description="The principles that guide the product experience." eyebrow="What we believe" title="Useful by design. Open to possibility." /><div className="row g-4">{[['Our mission', 'Make practical technology work more accessible for people building their future.', FaCompass], ['Our vision', 'Create a trusted ecosystem where learning and professional presentation meet.', FaLightbulb], ['Our commitment', 'Keep product information clear, protect purchase access, and design for real progress.', FaUsers]].map(([title, text, Icon]) => <div className="col-md-4" key={title}><div className="dm-card p-4 h-100"><Icon className="text-primary mb-4" size={24} /><h3 className="h5">{title}</h3><p className="dm-muted mb-0">{text}</p></div></div>)}</div></div></section>
        <section className="dm-section"><div className="dm-container d-flex flex-wrap justify-content-between align-items-center gap-4"><div><div className="dm-eyebrow">The marketplace</div><h2 className="h3 mt-2">Projects, portfolios, and support for the next step.</h2></div><a className="dm-btn dm-btn--primary" href="/projects">Explore the marketplace <FaArrowRight aria-hidden="true" /></a></div></section>
      </main>
    </SiteShell>
  )
}

export default AboutPage
