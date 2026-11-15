import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaBolt,
  FaArrowRight,
} from 'react-icons/fa'
import { fetchFeaturedProjects, fetchProjectCategories } from '../../services/projectService'
import { projectToCard } from '../../utils/projectMapping'
import useBuyNow from '../../hooks/useBuyNow'
import PremiumProjectCard from './PremiumProjectCard'
import '../../styles/premium-projects.css'

function FeaturedProjects({ showHeading = true }) {
  const [activeCategory, setActiveCategory] = useState('All Categories')
  const [apiProjects, setApiProjects] = useState([])
  const [categories, setCategories] = useState([])
  const { buyNow } = useBuyNow()

  useEffect(() => {
    let active = true
    fetchFeaturedProjects()
      .then((data) => {
        if (active) setApiProjects((data.results || data || []).map(projectToCard))
      })
      .catch(() => {})
    fetchProjectCategories()
      .then((data) => {
        if (active) setCategories(data.results || data || [])
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  // Floating ambient background particles
  const particles = [
    { id: 1, top: '12%', left: '8%', size: 6, delay: '0s', duration: '7s' },
    { id: 2, top: '28%', right: '12%', size: 8, delay: '1.5s', duration: '9s' },
    { id: 3, top: '55%', left: '15%', size: 5, delay: '2.5s', duration: '8s' },
    { id: 4, top: '70%', right: '9%', size: 7, delay: '0.8s', duration: '11s' },
    { id: 5, top: '88%', left: '45%', size: 6, delay: '3.2s', duration: '10s' },
  ]

  const displayedProjects = useMemo(() => {
    const list = apiProjects.slice(0, 8)
    if (activeCategory === 'All Categories') return list
    return list.filter((p) => p.category === activeCategory || p.categorySlug === activeCategory)
  }, [apiProjects, activeCategory])

  return (
    <section className="dm-premium-projects" id="projects">
      {/* Background Ambient Glows & Dynamic Grid */}
      <div className="dm-projects-bg-effects" aria-hidden="true">
        <div className="dm-projects-glow dm-projects-glow--purple" />
        <div className="dm-projects-glow dm-projects-glow--blue" />
        <div className="dm-projects-glow dm-projects-glow--cyan" />
        <div className="dm-projects-grid-overlay" />

        {/* Floating Particles */}
        {particles.map((p) => (
          <div
            className="dm-floating-particle"
            key={p.id}
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="dm-container">
        {/* Animated Section Header */}
        {showHeading && (
          <motion.div
            className="dm-projects-header"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-50px' }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="dm-projects-eyebrow">
              <FaBolt size={12} /> Curated Project Catalog
            </div>
            <h2 className="dm-projects-title">
              Featured <span className="dm-gradient-heading">Projects & Architectures</span>
            </h2>

            <div className="dm-heading-underline-wrap">
              <span className="dm-heading-dot" />
              <div className="dm-heading-underline" />
              <span className="dm-heading-dot" />
            </div>

            <p className="dm-projects-subtitle">
              Explore production-ready projects across AI, full-stack web, data science,
              cybersecurity and more — with transparent pricing and secure checkout.
            </p>
          </motion.div>
        )}

        {/* Category Navigation Pills */}
        <div className="dm-projects-tabs-nav" role="tablist" aria-label="Project Categories">
          <button
            aria-selected={activeCategory === 'All Categories'}
            className={`dm-projects-tab-btn ${activeCategory === 'All Categories' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All Categories')}
            role="tab"
            type="button"
          >
            <span>All Projects</span>
          </button>
          {categories.slice(0, 4).map((cat) => (
            <button
              aria-selected={activeCategory === cat.name}
              className={`dm-projects-tab-btn ${activeCategory === cat.name ? 'active' : ''}`}
              key={cat.slug}
              onClick={() => setActiveCategory(cat.name)}
              role="tab"
              type="button"
            >
              <span>{cat.name}</span>
            </button>
          ))}
          <Link className="dm-projects-tab-btn text-info" to="/projects">
            <span>View All Projects</span>
            <FaArrowRight size={11} className="ms-1" />
          </Link>
        </div>

        {/* Projects Grid */}
        {displayedProjects.length === 0 ? (
          <div className="dm-card p-5 text-center my-4">
            <h3 className="h5 text-white mb-2">No projects available yet</h3>
            <p className="dm-muted mb-0">Published projects will appear here once added from Django Admin.</p>
          </div>
        ) : (
          <div className="dm-projects-grid">
            {displayedProjects.map((project, index) => (
              <PremiumProjectCard
                index={index}
                key={project.id}
                onBuyNow={() => buyNow({ type: 'project', id: project.id })}
                project={project}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA to view full catalog */}
        <div className="text-center mt-5 pt-3">
          <Link className="dm-btn dm-btn--primary px-4 py-3" to="/projects">
            Explore All Projects & Categories <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects
