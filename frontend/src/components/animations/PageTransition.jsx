import { motion, AnimatePresence } from 'framer-motion'

/**
 * Reusable page transition wrapper
 * Provides smooth fade-in/slide-up transitions between routes
 */
export function PageTransition({ children, className = '' }) {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const pageTransition = {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1],
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

/**
 * Wrapper for AnimatePresence with page transitions
 * Use this in App.jsx or route components
 */
export function AnimatedRoutes({ children }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {children}
    </AnimatePresence>
  )
}
