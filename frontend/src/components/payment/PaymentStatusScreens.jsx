import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaRedo, FaShoppingBag, FaSyncAlt, FaThLarge } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { PrimaryButton, SecondaryButton } from '../common/Buttons'
import { LoadingSpinner } from '../common/Feedback'
import SiteShell from '../../layouts/SiteShell'

function ScreenShell({ children }) {
  return (
    <SiteShell>
      <main className="dm-section">
        <div className="dm-container">
          <div className="dm-status-screen">{children}</div>
        </div>
      </main>
    </SiteShell>
  )
}

export function PaymentFailureScreen({ message, onRetry, onBackToCheckout }) {
  return (
    <ScreenShell>
      <div className="dm-status-card">
        <span className="dm-status-icon dm-status-icon--error" aria-hidden="true">
          <FaExclamationTriangle />
        </span>
        <h1>Payment Failed</h1>
        <p>
          Unfortunately, your payment could not be completed.
          {message ? ` ${message}` : ''} No amount has been captured for this order.
        </p>
        <div className="dm-status-actions">
          <PrimaryButton disabled={!onRetry} onClick={onRetry}>
            <FaRedo aria-hidden="true" className="me-2" /> Retry Payment
          </PrimaryButton>
          <SecondaryButton onClick={onBackToCheckout}>
            <FaArrowLeft aria-hidden="true" className="me-2" /> Back to Checkout
          </SecondaryButton>
        </div>
      </div>
    </ScreenShell>
  )
}

export function PaymentPendingScreen({ message, orderNumber, onRecheck, checking = false }) {
  return (
    <ScreenShell>
      <div className="dm-status-card">
        <span className="dm-status-icon dm-status-icon--pending" aria-hidden="true">
          <FaSyncAlt className={checking ? 'fa-spin' : ''} />
        </span>
        <h1>Payment Processing</h1>
        <p>
          Your payment is being verified. Please wait — your purchase will unlock
          automatically once Razorpay confirms the transaction.
        </p>
        {message && <p className="small text-muted">{message}</p>}
        {orderNumber && (
          <p className="small text-muted">
            Order Reference: <strong>{orderNumber}</strong>
          </p>
        )}
        <div className="dm-status-actions">
          <PrimaryButton disabled={checking || !onRecheck} onClick={onRecheck}>
            {checking ? (
              <>
                <LoadingSpinner label="Checking..." /> Checking status...
              </>
            ) : (
              <>
                <FaSyncAlt aria-hidden="true" className="me-2" /> Check Status Now
              </>
            )}
          </PrimaryButton>
          <Link className="dm-btn dm-btn--secondary" to="/projects">
            Continue browsing while we verify
          </Link>
        </div>
      </div>
    </ScreenShell>
  )
}

export function PaymentConfirmedScreen({ transaction, viewPurchaseTo = '/projects', dashboardTo = '/' }) {
  return (
    <ScreenShell>
      <div className="dm-status-card">
        <span className="dm-status-icon dm-status-icon--success" aria-hidden="true">
          <FaCheckCircle />
        </span>
        <h1>Payment Successful</h1>
        <p>Congratulations! Your purchase is complete and has been verified.</p>
        <div className="dm-status-actions">
          <Link className="dm-btn dm-btn--primary" to={viewPurchaseTo}>
            <FaShoppingBag aria-hidden="true" className="me-2" /> View My Purchase
          </Link>
          <Link className="dm-btn dm-btn--secondary" to={dashboardTo}>
            <FaThLarge aria-hidden="true" className="me-2" /> Go to Dashboard
          </Link>
        </div>
        {transaction?.orderNumber && (
          <p className="small text-muted mt-3 mb-0">
            Order Reference: <strong>{transaction.orderNumber}</strong>
          </p>
        )}
      </div>
    </ScreenShell>
  )
}

export function PaymentVerifyingScreen() {
  return (
    <ScreenShell>
      <div className="dm-status-card">
        <span className="dm-status-icon dm-status-icon--pending" aria-hidden="true">
          <FaSyncAlt className="fa-spin" />
        </span>
        <h1>Verifying Payment</h1>
        <p>
          We are verifying the payment signature and capture status with Razorpay
          servers. Please do not close or refresh this page.
        </p>
      </div>
    </ScreenShell>
  )
}
