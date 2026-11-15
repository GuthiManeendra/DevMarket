import { motion, AnimatePresence } from 'framer-motion'

/**
 * Animated dropdown menu
 */
export function AnimatedDropdown({ isOpen, children, className = '' }) {
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scaleY: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`dm-dropdown-menu ${className}`.trim()}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: 'top' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Animated accordion/collapse
 */
export function AnimatedCollapse({ isOpen, children, className = '' }) {
  const contentVariants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: 'auto',
      opacity: 1,
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={className}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
