import { motion } from 'framer-motion'

/**
 * Simple spinner loader
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  }

  const pixelSize = sizeMap[size] || 24

  return (
    <motion.div
      className={`dm-spinner ${className}`.trim()}
      style={{
        width: pixelSize,
        height: pixelSize,
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: 'currentColor',
        borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/**
 * Skeleton loading animation
 */
export function Skeleton({ className = '', width = '100%', height = '100%' }) {
  return (
    <motion.div
      className={`dm-skeleton ${className}`.trim()}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

/**
 * Full page loader
 */
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="dm-page-loader">
      <div className="dm-page-loader__content">
        <Spinner size="xl" />
        <motion.p
          className="dm-page-loader__text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  )
}

/**
 * Pulse animation for loading states
 */
export function Pulse({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {children}
    </motion.div>
  )
}
