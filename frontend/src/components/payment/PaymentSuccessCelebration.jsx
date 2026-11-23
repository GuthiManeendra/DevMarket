import { useEffect, useMemo, useRef, useState } from 'react'
import { FaEye, FaLock, FaShoppingBag, FaThLarge } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { formatInr } from '../../utils/currency'

const rand = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

// Check for reduced motion preference
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Check if device is mobile for performance optimization
const isMobile = () => window.innerWidth < 768

function MoneyNote({ seed }) {
  const style = {
    left: `${seed.x}%`,
    width: `${seed.size}px`,
    height: `${seed.size * 0.62}px`,
    fontSize: `${seed.size * 0.28}px`,
    animationDuration: `${seed.duration}s`,
    animationDelay: `${seed.delay}s`,
    '--sway': `${seed.sway}vw`,
    '--spin': `${seed.spin}deg`,
  }
  return (
    <div className={`dm-money-note dm-money-note--${seed.tone} dm-note-fall`} style={style} aria-hidden="true">
      <div className="dm-money-note__header">
        <span className="dm-money-note__label">VOUCHER</span>
        <span className="dm-money-note__serial">#{seed.serial}</span>
      </div>
      <div className="dm-money-note__center">
        <span className="dm-money-note__rupee">₹</span>
        <span className="dm-money-note__value">100</span>
      </div>
      <div className="dm-money-note__footer">
        <span className="dm-money-note__brand">Repohaus</span>
        <div className="dm-money-note__ring" />
      </div>
    </div>
  )
}

function Particle({ seed }) {
  const style = {
    left: `${seed.x}%`,
    width: `${seed.size}px`,
    height: `${seed.size}px`,
    animationDuration: `${seed.duration}s`,
    animationDelay: `${seed.delay}s`,
    '--drift': `${seed.drift}vw`,
  }
  return (
    <span
      className={`dm-particle dm-particle--${seed.tone} dm-particle-float`}
      style={style}
      aria-hidden="true"
    />
  )
}

function Confetti({ seed }) {
  const style = {
    left: `${seed.x}%`,
    width: `${seed.size}px`,
    height: `${seed.size * 1.7}px`,
    background: seed.color,
    animationDuration: `${seed.duration}s`,
    animationDelay: `${seed.delay}s`,
    '--sway': `${seed.sway}vw`,
    '--spin': `${seed.spin}deg`,
  }
  return <span className="dm-confetti dm-confetti-fall" style={style} aria-hidden="true" />
}

function PaymentSuccessCelebration({ transaction, viewPurchaseTo = '/projects', dashboardTo = '/' }) {
  const [animationStarted, setAnimationStarted] = useState(false)
  const hasAnimated = useRef(false)

  // Only start animation once per component mount
  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true
      setAnimationStarted(true)
    }
  }, [])

  // Optimize particle counts based on device and motion preference
  const shouldAnimate = !prefersReducedMotion()
  const mobileMode = isMobile()

  const noteCount = shouldAnimate ? (mobileMode ? 15 : 35) : 0
  const particleCount = shouldAnimate ? (mobileMode ? 12 : 30) : 0
  const confettiCount = shouldAnimate ? (mobileMode ? 14 : 28) : 0

  const notes = useMemo(
    () =>
      Array.from({ length: noteCount }, (_, index) => ({
        key: `note-${index}`,
        x: rand(0, 96),
        size: rand(48, 92),
        duration: rand(4.5, 7.8),
        delay: rand(0.8, 2.8),
        sway: rand(-8, 8),
        spin: rand(240, 600),
        tone: Math.random() > 0.35 ? 'green' : 'gold',
        serial: Math.floor(Math.random() * 900000 + 100000),
      })),
    [noteCount]
  )

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => ({
        key: `particle-${index}`,
        x: rand(0, 98),
        size: rand(4, 12),
        duration: rand(5.5, 9.5),
        delay: rand(0.3, 3.5),
        drift: rand(-7, 7),
        tone: pick(['gold', 'emerald']),
      })),
    [particleCount]
  )

  const confetti = useMemo(
    () =>
      Array.from({ length: confettiCount }, (_, index) => ({
        key: `confetti-${index}`,
        x: rand(0, 98),
        size: rand(5, 10),
        duration: rand(4, 7),
        delay: rand(1, 4),
        sway: rand(-7, 7),
        spin: rand(360, 780),
        color: pick(['#34d399', '#f5c542', '#a7f3d0', '#ffffff', '#60a5fa']),
      })),
    [confettiCount]
  )

  const rows = [
    ['Customer', transaction.customerName || '—'],
    ['Product', transaction.productName || '—'],
    ['Order ID', transaction.orderNumber || '—'],
    ['Razorpay Payment ID', transaction.paymentId || '—'],
    ['Payment Method', transaction.paymentMethod ? transaction.paymentMethod.toUpperCase() : '—'],
    ['Amount Paid', formatInr(transaction.amount)],
    ['Transaction Date', transaction.paidAt || '—'],
    ['Payment Status', 'CAPTURED'],
  ]

  return (
    <div className="dm-celebration" role="dialog" aria-modal="true" aria-label="Payment successful">
      {animationStarted && shouldAnimate && (
        <div className="dm-celebration__particles" aria-hidden="true">
          {notes.map((note) => (
            <MoneyNote key={note.key} seed={note} />
          ))}
          {particles.map((particle) => (
            <Particle key={particle.key} seed={particle} />
          ))}
          {confetti.map((piece) => (
            <Confetti key={piece.key} seed={piece} />
          ))}
        </div>
      )}

      <div className="dm-celebration__content">
        {/* Repohaus Logo */}
        <div className="dm-celebration__logo">
          <div className="dm-brand-mark dm-brand-mark--large">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="12" fill="url(#logo-gradient)" />
              <path d="M16 32L28 44L48 20" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="dm-celebration__logo-text">Repohaus</span>
        </div>

        {/* Animated Checkmark */}
        <svg className="dm-checkmark" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="dm-checkmark__circle" cx="50" cy="50" fill="none" r="46" />
          <path className="dm-checkmark__path" d="M30 52 L44 66 L72 36" fill="none" />
        </svg>

        <h1 className="dm-celebration__title">PAYMENT SUCCESSFUL!</h1>
        <p className="dm-celebration__subtitle">
          Congratulations! Your purchase is complete.
        </p>

        {/* Glassmorphism Transaction Card */}
        <div className="dm-txn-card">
          <div className="dm-txn-card__head">
            <h3>Transaction Details</h3>
            <span className="dm-txn-badge">Paid</span>
          </div>
          {rows.map(([label, value]) => (
            <div className="dm-txn-row" key={label}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <div className="dm-txn-row dm-txn-row--amount">
            <span>Total Paid</span>
            <span>{formatInr(transaction.amount)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="dm-celebration__actions">
          <Link className="dm-btn dm-btn--primary" to={viewPurchaseTo}>
            <FaEye aria-hidden="true" className="me-2" /> View My Purchase
          </Link>
          <Link className="dm-btn dm-btn--gold" to={dashboardTo}>
            <FaThLarge aria-hidden="true" className="me-2" /> Go to Dashboard
          </Link>
        </div>

        <p className="dm-secure-note mt-4 mb-0" style={{ opacity: 0, animation: 'dm-rise 0.9s 5s ease forwards' }}>
          <FaLock aria-hidden="true" size={12} /> Secured by Razorpay • 256-bit encrypted transaction
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccessCelebration
