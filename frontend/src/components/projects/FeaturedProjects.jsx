import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { EmptyState } from '../common/Feedback'
import SectionHeading from '../common/SectionHeading'

function FeaturedProjects() {
  return (
    <section className="dm-section dm-section--soft" id="projects">
      <div className="dm-container">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
          <SectionHeading
            description="Explore practical software projects designed for learning, development, and innovation."
            eyebrow="Curated work"
            title="Featured projects"
          />
          <Link className="dm-text-link mb-4" to="/projects">Explore all projects <FaArrowRight aria-hidden="true" /></Link>
        </div>
        <EmptyState
          description="Featured projects will appear here when the DevMarket catalog is connected."
          title="The catalog is getting ready"
        />
      </div>
    </section>
  )
}

export default FeaturedProjects
