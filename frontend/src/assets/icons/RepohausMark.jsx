function RepohausMark({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={`dm-brand-mark ${className}`.trim()}
      fill="none"
      viewBox="0 0 40 40"
    >
      <defs>
        <linearGradient id="repohaus-mark-gradient" x1="4" x2="36" y1="4" y2="36">
          <stop stopColor="#34E0A1" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect fill="#0F172A" height="38" rx="11" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="1.5" width="38" x="1" y="1" />
      <path
        d="M11 25 20 14l9 11M14 25v7h12v-7"
        stroke="url(#repohaus-mark-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <path
        d="M15.5 18.5 14 17M24.5 18.5 26 17"
        stroke="url(#repohaus-mark-gradient)"
        strokeLinecap="round"
        strokeWidth="1.8"
        opacity="0.55"
      />
    </svg>
  )
}

export default RepohausMark
