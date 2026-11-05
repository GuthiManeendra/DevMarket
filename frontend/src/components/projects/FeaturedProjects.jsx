import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { fetchFeaturedProjects } from '../../services/projectService'
import { EmptyState } from '../common/Feedback'
import MarketplaceProjectCard from '../cards/MarketplaceProjectCard'
import SectionHeading from '../common/SectionHeading'

function FeaturedProjects() {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    fetchFeaturedProjects().then((data) => setProjects(data.results || data)).catch(() => setProjects([]))
  }, [])
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
        {projects.length > 0 ? <div className="row g-4">{projects.slice(0, 3).map((project) => <div className="col-md-4" key={project.id}><MarketplaceProjectCard item={project} /></div>)}</div> : <EmptyState description="Featured projects will appear here after a real project is published in the catalog." title="No featured projects yet" />}
      </div>
    </section>
  )
}

export default FeaturedProjects
