import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaCode, FaArrowRight, FaLayerGroup } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function ProjectTechModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  const {
    id,
    number,
    title,
    category,
    difficulty,
    technologies = [],
    frontendArchitecture,
    backendArchitecture,
    databaseInfo,
    accentColor = '#3b82f6',
  } = project

  return (
    <motion.div
      aria-labelledby="dm-tech-modal-title"
      aria-modal="true"
      className="dm-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      transition={{ duration: 0.22 }}
    >
      <motion.div
        className="dm-modal-container"
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
      >
        <div
          className="dm-modal-header-glow"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, #22d3ee, #8b5cf6)`,
          }}
        />

        <button
          aria-label="Close technologies modal"
          className="dm-modal-close-btn"
          onClick={onClose}
          type="button"
        >
          <FaTimes />
        </button>

        <div className="dm-modal-body">
          <div className="dm-modal-eyebrow-row">
            <span className="dm-project-number-badge">
              <FaLayerGroup size={12} /> Project #{number || id}
            </span>
            <span className="dm-card-category-pill">{category}</span>
            <span className="dm-card-difficulty-badge">{difficulty}</span>
          </div>

          <h2 className="dm-modal-title mt-2" id="dm-tech-modal-title">
            {title}
          </h2>
          <div className="dm-modal-subtitle">
            Technology Stack & Architectural Specifications
          </div>

          <div className="dm-modal-section-title mt-4">
            <FaCode size={13} /> Integrated Technologies & Libraries
          </div>
          <div className="dm-modal-tech-list">
            {technologies.map((tech) => (
              <span className="dm-modal-tech-badge" key={tech}>
                <span className="dm-tech-pill-dot" />
                {tech}
              </span>
            ))}
          </div>

          <div className="dm-tech-stack-breakdown mt-4">
            {frontendArchitecture && (
              <div className="dm-tech-stack-row">
                <span className="dm-tech-stack-label">Frontend Layer:</span>
                <span className="dm-tech-stack-val">{frontendArchitecture}</span>
              </div>
            )}
            {backendArchitecture && (
              <div className="dm-tech-stack-row">
                <span className="dm-tech-stack-label">Backend Layer:</span>
                <span className="dm-tech-stack-val">{backendArchitecture}</span>
              </div>
            )}
            {databaseInfo && (
              <div className="dm-tech-stack-row">
                <span className="dm-tech-stack-label">Data Storage:</span>
                <span className="dm-tech-stack-val">{databaseInfo}</span>
              </div>
            )}
          </div>

          <div className="dm-modal-footer mt-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button
              className="dm-btn dm-btn--secondary"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
            <Link
              className="dm-view-details-btn"
              onClick={onClose}
              to={`/projects/${id}`}
            >
              View Full Details <FaArrowRight aria-hidden="true" size={12} />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectTechModal
