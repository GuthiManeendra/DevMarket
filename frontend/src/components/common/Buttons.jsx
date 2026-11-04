function PrimaryButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button className={`dm-btn dm-btn--primary ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  )
}

function SecondaryButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button className={`dm-btn dm-btn--secondary ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  )
}

export { PrimaryButton, SecondaryButton }
