import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { subscribeToast } from '../../utils/toastBus'

export function ToastHost({ position = 'top-right' }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => subscribeToast(({ id, message, type }) => {
    setToasts((current) => [...current, { id, message, type }])
  }), [])

  const dismiss = (id) => setToasts((current) => current.filter((t) => t.id !== id))

  return (
    <ToastContainer
      position={position}
      toasts={toasts.map((t) => ({ ...t, onClose: () => dismiss(t.id) }))}
    />
  )
}

/**
 * Toast notification with animations
 */
export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right',
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const positionStyles = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
  }

  const typeStyles = {
    success: { backgroundColor: '#10b981' },
    error: { backgroundColor: '#ef4444' },
    warning: { backgroundColor: '#f59e0b' },
    info: { backgroundColor: '#34e0a1' },
  }

  const toastVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: position.includes('top') ? -20 : 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: position.includes('top') ? -20 : 20,
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="dm-toast"
          style={{
            ...positionStyles[position],
            ...typeStyles[type],
          }}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Toast container for managing multiple toasts
 */
export function ToastContainer({ toasts = [], position = 'top-right' }) {
  return (
    <div className={`dm-toast-container dm-toast-container--${position}`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            position={position}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
