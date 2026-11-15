import { motion, AnimatePresence } from 'framer-motion'

/**
 * Animated modal backdrop
 */
export function ModalBackdrop({ children, isOpen, onClose }) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const contentVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dm-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="dm-modal-content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Slide-in panel (for side drawers, filters, etc.)
 */
export function SlideInPanel({ children, isOpen, onClose, position = 'right' }) {
  const panelVariants = {
    hidden: {
      x: position === 'right' ? '100%' : position === 'left' ? '-100%' : 0,
      y: position === 'bottom' ? '100%' : position === 'top' ? '-100%' : 0,
    },
    visible: {
      x: 0,
      y: 0,
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="dm-panel-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={`dm-panel dm-panel--${position}`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
