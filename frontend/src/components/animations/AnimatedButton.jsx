import { motion } from 'framer-motion'
import { forwardRef } from 'react'

/**
 * Animated button with hover, active, and loading states
 * Wraps existing button styles with animation
 */
export const AnimatedButton = forwardRef(
  (
    {
      children,
      className = '',
      loading = false,
      disabled = false,
      variant = 'primary',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const buttonVariants = {
      idle: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    }

    const loadingVariants = {
      animate: { rotate: 360 },
    }

    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        className={`dm-btn dm-btn--${variant} dm-btn--${size} ${className}`.trim()}
        disabled={isDisabled}
        variants={buttonVariants}
        initial="idle"
        whileHover={!isDisabled ? 'hover' : 'idle'}
        whileTap={!isDisabled ? 'tap' : 'idle'}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        {...props}
      >
        {loading && (
          <motion.span
            className="dm-spinner"
            variants={loadingVariants}
            animate="animate"
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              marginRight: '8px',
            }}
          />
        )}
        {children}
      </motion.button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

/**
 * Animated link button
 */
export function AnimatedLink({ children, className = '', ...props }) {
  const linkVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
  }

  return (
    <motion.a
      className={className}
      variants={linkVariants}
      initial="idle"
      whileHover="hover"
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.a>
  )
}
