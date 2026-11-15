import { motion } from 'framer-motion'

function PrimaryButton({ children, className = '', type = 'button', loading = false, disabled = false, ...props }) {
  const baseClass = 'dm-btn dm-btn--primary'
  const combinedClass = `${baseClass} ${className}`.trim()
  const isDisabled = disabled || loading

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  }

  const content = loading ? (
    <>
      <motion.span
        style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          marginRight: '8px',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      Loading...
    </>
  ) : children

  return (
    <motion.button
      className={combinedClass}
      type={type}
      disabled={isDisabled}
      variants={buttonVariants}
      initial="idle"
      whileHover={!isDisabled ? 'hover' : 'idle'}
      whileTap={!isDisabled ? 'tap' : 'idle'}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {content}
    </motion.button>
  )
}

function SecondaryButton({ children, className = '', type = 'button', loading = false, disabled = false, ...props }) {
  const baseClass = 'dm-btn dm-btn--secondary'
  const combinedClass = `${baseClass} ${className}`.trim()
  const isDisabled = disabled || loading

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  }

  const content = loading ? 'Loading...' : children

  return (
    <motion.button
      className={combinedClass}
      type={type}
      disabled={isDisabled}
      variants={buttonVariants}
      initial="idle"
      whileHover={!isDisabled ? 'hover' : 'idle'}
      whileTap={!isDisabled ? 'tap' : 'idle'}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {content}
    </motion.button>
  )
}

export { PrimaryButton, SecondaryButton }
