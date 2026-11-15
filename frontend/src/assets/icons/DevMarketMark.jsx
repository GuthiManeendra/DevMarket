function DevMarketMark({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={`dm-brand-mark ${className}`.trim()}
      fill="none"
      viewBox="0 0 40 40"
    >
      <defs>
        <linearGradient id="devmarket-mark-gradient" x1="4" x2="36" y1="4" y2="36">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect fill="#111a30" height="38" rx="11" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="1.5" width="38" x="1" y="1" />
      <path
        d="m16 13-7 7 7 7M24 13l7 7-7 7M22 10l-4 20"
        stroke="url(#devmarket-mark-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  )
}

export default DevMarketMark
