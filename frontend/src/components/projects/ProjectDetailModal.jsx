import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaLayerGroup, FaCheckCircle, FaCode, FaBolt } from 'react-icons/fa'

function ProjectDetailModal({ project, onClose }) {
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

  const { Icon, number, name, subtitle, description, technologies, features } = project

  return (
    <motion.div
      aria-labelledby="dm-modal-title"
      aria-modal="true"
      className="dm-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="dm-modal-container"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="dm-modal-header-glow" />

        <button
          aria-label="Close details"
          className="dm-modal-close-btn"
          onClick={onClose}
          type="button"
        >
          <FaTimes />
        </button>

        <div className="dm-modal-body">
          <div className="dm-modal-eyebrow-row">
            <span className="dm-project-number-badge">
              <FaLayerGroup size={12} /> Project {number}
            </span>
            <div className="dm-project-icon-box">
              <Icon />
            </div>
          </div>

          <h2 className="dm-modal-title" id="dm-modal-title">
            {name}
          </h2>
          <div className="dm-modal-subtitle">{subtitle}</div>

          <div className="dm-modal-section-title">
            <FaCheckCircle size={13} /> Project Overview
          </div>
          <div className="dm-modal-desc-box">
            <p className="dm-modal-desc">{description}</p>
          </div>

          <div className="dm-modal-section-title">
            <FaCode size={13} /> Technology Stack & Libraries
          </div>
          <div className="dm-modal-tech-list">
            {technologies.map((tech) => (
              <span className="dm-modal-tech-badge" key={tech}>
                {tech}
              </span>
            ))}
          </div>

          {features && features.length > 0 && (
            <>
              <div className="dm-modal-section-title">
                <FaBolt size={13} /> Architectural Highlights
              </div>
              <ul className="dm-modal-features-list">
                {features.map((feat, idx) => (
                  <li key={idx}>
                    <FaCheckCircle size={12} className="dm-modal-check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="dm-modal-footer">
            <button
              className="dm-view-details-btn"
              onClick={onClose}
              type="button"
            >
              Close Details
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectDetailModal
