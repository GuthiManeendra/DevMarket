import { motion } from 'framer-motion'
import { useRef } from 'react'

/**
 * Animated card with hover effects
 * Includes subtle scale, shadow, and border glow
 */
export function AnimatedCard({
  children,
  className = '',
  hoverEnabled = true,
  tiltEnabled = false,
  ...props
}) {
  const cardRef = useRef(null)

  const cardVariants = {
    idle: {
      scale: 1,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion || !hoverEnabled) {
    return (
      <div className={`dm-card ${className}`.trim()} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className={`dm-card ${className}`.trim()}
      variants={cardVariants}
      initial="idle"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Card with image zoom on hover
 */
export function ImageZoomCard({ children, className = '', ...props }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return <div className={`dm-card ${className}`.trim()} {...props}>{children}</div>
  }

  return (
    <motion.div
      className={`dm-card ${className}`.trim()}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
