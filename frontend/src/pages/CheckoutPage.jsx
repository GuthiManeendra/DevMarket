import { useEffect, useMemo, useRef, useState } from 'react'
import { FaExclamationTriangle, FaLock, FaShoppingBag } from 'react-icons/fa'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useMarketplace from '../context/useMarketplace'
import {
  addCartItem,
  clearCart,
  createCheckoutOrder,
  createPaymentOrder,
  fetchCheckoutQuote,
  fetchPaymentStatus,
  verifyPayment,
} from '../services/projectService'
import { EmptyState, PriceDisplay } from '../components/common/Feedback'
import { PageHeader } from '../components/common/PageHeader'
import PaymentMethodPicker, { getRazorpayMethod } from '../components/payment/PaymentMethodPicker'
import PaymentSuccessCelebration from '../components/payment/PaymentSuccessCelebration'
import {
  PaymentConfirmedScreen,
  PaymentFailureScreen,
  PaymentPendingScreen,
  PaymentVerifyingScreen,
} from '../components/payment/PaymentStatusScreens'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'
import { trackEvent } from '../utils/analytics'
import { loadRazorpayScript } from '../utils/razorpay'
import { formatInr } from '../utils/currency'
import '../styles/checkout.css'

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')

function resolveImageUrl(src) {
  if (!src) return null
  if (/^https?:\/\//i.test(src)) return src
  return `${API_ORIGIN}${src.startsWith('/') ? '' : '/'}${src}`
}

function OrderItemRow({ item }) {
  const image = resolveImageUrl(item.image)
  return (
    <div className="dm-order-item">
      <div className="dm-order-item__thumb">
        {image ? <img alt={item.title} src={image} /> : <FaShoppingBag aria-hidden="true" />}
      </div>
      <div className="flex-grow-1">
        <span className="dm-order-item__title">{item.title}</span>
        <span className="dm-order-item__meta">
          {item.product_type}
          {item.quantity > 1 ? ` × ${item.quantity}` : ''}
        </span>
      </div>
      <span className="dm-order-item__price">
        <PriceDisplay amount={item.total} />
      </span>
    </div>
  )
}

function CheckoutPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, authLoading } = useMarketplace()
  const buyParam = searchParams.get('buy') // e.g. "project:10" or "portfolio:6"
  const itemIdsParam = searchParams.get('items')
  const itemIds = useMemo(
    () => (itemIdsParam ? itemIdsParam.split(',').map((v) => parseInt(v, 10)).filter(Number.isFinite) : null),
    [itemIdsParam]
  )
  const buyProcessedRef = useRef(false)
  const paymentInitiatedRef = useRef(false)

  const [coupon, setCoupon] = useState('')
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentState, setPaymentState] = useState(null) // null | 'verifying' | 'success' | 'pending' | 'failed' | 'dismissed'
  const [activeOrder, setActiveOrder] = useState(null)
  const [verifiedResult, setVerifiedResult] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [customer, setCustomer] = useState({ name: '', email: '' })

  const productName = useMemo(
    () => (quote?.items || []).map((item) => item.title).join(', ') || 'Repohaus Purchase',
    [quote]
  )

  const purchasePath = useMemo(() => {
    const first = quote?.items?.[0]
    if (!first?.slug) return '/projects'
    return first.product_type === 'portfolio' ? `/portfolios/${first.slug}` : `/projects/${first.slug}`
  }, [quote])

  const buildTransaction = (base, statusInfo = null) => {
    const latestPayment = statusInfo?.payments?.[0] || null
    return {
      orderNumber: base.orderNumber || statusInfo?.order_number,
      paymentId: latestPayment?.gateway_payment_id || base.paymentId || '—',
      paymentMethod: latestPayment?.payment_method || base.paymentMethod || '',
      amount: latestPayment?.amount ?? base.amount ?? statusInfo?.total_amount ?? quote?.total,
      paidAt: latestPayment?.verified_at
        ? new Date(latestPayment.verified_at).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
        : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      customerName: customer.name,
      productName,
      status: 'Paid',
    }
  }

  const fetchVerifiedTransaction = async (orderNumber, base) => {
    try {
      const statusInfo = await fetchPaymentStatus(orderNumber)
      return buildTransaction(base, statusInfo)
    } catch {
      return buildTransaction(base)
    }
  }

  // Resolve ?buy=type:id → ensure the product is in the cart, then scope
  // checkout to that single cart item via ?items=<id>.
  useEffect(() => {
    if (buyProcessedRef.current || !buyParam || authLoading) return

    // Buy Now requires an authenticated customer.
    if (!user?.isLoggedIn) {
      navigate('/login', {
        replace: true,
        state: { from: { pathname: '/checkout', search: location.search } },
      })
      return
    }

    buyProcessedRef.current = true
    const [type, rawId] = buyParam.split(':')
    const productId = parseInt(rawId, 10)
    if (!productId || !['project', 'portfolio'].includes(type)) {
      setError('Invalid purchase reference.')
      return
    }

    const payload = type === 'project' ? { project_id: productId } : { portfolio_template_id: productId }
    addCartItem(payload)
      .then((data) => {
        const cartItemId = data?.id
        if (!cartItemId) throw new Error('missing cart item')
        setSearchParams({ items: String(cartItemId) }, { replace: true })
      })
      .catch(() => {
        setError('Unable to prepare this product for checkout. Please try again.')
      })
  }, [buyParam, authLoading, user, navigate, location.search, setSearchParams])

  const handleApplyCoupon = () => {
    setLoading(true)
    fetchCheckoutQuote(coupon, itemIds)
      .then((data) => {
        setQuote(data)
        setError('')
      })
      .catch((requestError) => {
        setQuote(null)
        setError(requestError.response?.data?.errors?.coupon?.[0] || 'Unable to calculate checkout quote.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (buyParam && !itemIdsParam) return // wait until buy resolves to ?items=
    let isMounted = true
    fetchCheckoutQuote(coupon, itemIds)
      .then((data) => {
        if (isMounted) {
          setQuote(data)
          setError('')
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setQuote(null)
          setError(requestError.response?.data?.errors?.coupon?.[0] || 'Unable to calculate checkout quote.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    loadRazorpayScript()
    return () => {
      isMounted = false
      paymentInitiatedRef.current = false
    }
  }, [coupon, itemIds, buyParam, itemIdsParam])

  const handleStartPayment = async () => {
    // Prevent multiple simultaneous payment initiations
    if (paymentInitiatedRef.current) {
      return
    }
    paymentInitiatedRef.current = true

    setProcessing(true)
    setError('')
    setPaymentState('processing')

    try {
      // Step 1: Ensure Razorpay SDK is loaded
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded || typeof window.Razorpay === 'undefined') {
        setError('Unable to load the Razorpay checkout script. Please check your internet connection.')
        setProcessing(false)
        return
      }

      // Step 2: Retrieve or create Repohaus Order
      let order = activeOrder
      if (!order) {
        order = await createCheckoutOrder(coupon, '', itemIds)
        setActiveOrder(order)
      }

      // Step 3: Create Razorpay Order via Backend API
      const sessionData = await createPaymentOrder(order.order_number)
      setCustomer(sessionData.customer || { name: '', email: '' })

      // Step 4: Configure Razorpay Checkout options
      const razorpayMethod = getRazorpayMethod(selectedMethod)
      // For UPI, don't pass method to allow Razorpay to show both Intent and QR code options
      const options = {
        key: sessionData.key_id,
        amount: sessionData.amount,
        currency: sessionData.currency || 'INR',
        name: 'Repohaus',
        description: `Order ${sessionData.devmarket_order_number}`,
        order_id: sessionData.razorpay_order_id,
        method: razorpayMethod === 'upi' ? undefined : razorpayMethod || undefined,
        prefill: {
          name: sessionData.customer?.name || '',
          email: sessionData.customer?.email || '',
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            setPaymentState('dismissed')
          },
        },
        handler: async (response) => {
          // Step 5: Frontend callback is NOT proof of payment.
          // Send signature to backend for cryptographic verification & capture.
          setPaymentState('verifying')
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (verification.payment_status === 'captured' || verification.status === 'success') {
              const transaction = await fetchVerifiedTransaction(verification.order_number, {
                orderNumber: verification.order_number,
                paymentId: response.razorpay_payment_id,
                paymentMethod: verification.payment_method,
                amount: verification.amount ?? quote?.total,
              })
              setVerifiedResult(transaction)
              setPaymentState('success')
              // GA4 purchase event — fired only after backend-verified capture.
              // No customer PII or payment credentials are sent.
              trackEvent('purchase', {
                transaction_id: transaction.orderNumber,
                value: Number(transaction.amount) || undefined,
                currency: 'INR',
                items: (quote?.items || []).map((item) => ({
                  item_id: String(item.id),
                  item_name: item.title,
                  price: Number(item.total) || undefined,
                })),
              })
              try {
                await clearCart()
              } catch {
                // Ignore silent cart clear error
              }
            } else if (verification.payment_status === 'authorized' || verification.status === 'authorized') {
              const transaction = await fetchVerifiedTransaction(verification.order_number, {
                orderNumber: verification.order_number,
                paymentId: response.razorpay_payment_id,
                paymentMethod: verification.payment_method,
              })
              setVerifiedResult(transaction)
              setPaymentState('pending')
            } else {
              setError('Payment outcome unconfirmed. Please check your bank transaction or refresh.')
              setPaymentState('failed')
            }
          } catch (verifyError) {
            const detail =
              verifyError.response?.data?.detail ||
              'Payment verification failed. If money was debited, your order will be reconciled via gateway webhook.'
            setError(detail)
            setPaymentState('failed')
          } finally {
            setProcessing(false)
            paymentInitiatedRef.current = false
          }
        },
      }

      const rzpInstance = new window.Razorpay(options)

      rzpInstance.on('payment.failed', (failureResponse) => {
        const reason =
          failureResponse.error?.description ||
          failureResponse.error?.reason ||
          'Payment declined or failed at gateway.'
        setError(`Payment declined: ${reason}`)
        setPaymentState('failed')
        setProcessing(false)
        paymentInitiatedRef.current = false
      })

      rzpInstance.open()
    } catch (err) {
      const errDetail =
        err.response?.data?.detail ||
        err.message ||
        'Unable to initialize payment session. Please check your cart and try again.'
      setError(errDetail)
      setProcessing(false)
      setPaymentState('failed')
      paymentInitiatedRef.current = false
    }
  }

  const handleRecheckStatus = async () => {
    if (!activeOrder?.order_number) return
    setProcessing(true)
    try {
      const res = await fetchPaymentStatus(activeOrder.order_number)
      if (res.is_paid || res.status === 'paid') {
        const transaction = await fetchVerifiedTransaction(res.order_number, {
          orderNumber: res.order_number,
          paymentId: res.payments?.[0]?.gateway_payment_id,
          paymentMethod: res.payments?.[0]?.payment_method,
          amount: res.total_amount,
        })
        setVerifiedResult(transaction)
        setPaymentState('success')
        clearCart().catch(() => {})
      } else {
        setError('Payment has not been confirmed yet. Please allow a few moments or retry.')
      }
    } catch {
      setError('Unable to fetch updated status.')
    } finally {
      setProcessing(false)
    }
  }

  const handleBackToCheckout = () => {
    setPaymentState(null)
    setError('')
  }

  // --- Success State (celebration runs once per order) ---
  if (paymentState === 'success' && verifiedResult) {
    const celebrateKey = `dm_celebrated_${verifiedResult.orderNumber}`
    const alreadyCelebrated = window.sessionStorage.getItem(celebrateKey)
    if (!alreadyCelebrated) {
      window.sessionStorage.setItem(celebrateKey, '1')
    }

    if (alreadyCelebrated) {
      return (
        <>
          <SEO noindex title="Order confirmed" />
          <PaymentConfirmedScreen
            dashboardTo="/"
            transaction={verifiedResult}
            viewPurchaseTo={purchasePath}
          />
        </>
      )
    }

    return (
      <>
        <SEO noindex title="Order confirmed" />
        <PaymentSuccessCelebration
          dashboardTo="/"
          transaction={verifiedResult}
          viewPurchaseTo={purchasePath}
        />
      </>
    )
  }

  // --- Failure State ---
  if (paymentState === 'failed') {
    return (
      <>
        <SEO noindex title="Payment failed" />
        <PaymentFailureScreen
          message={error}
          onBackToCheckout={handleBackToCheckout}
          onRetry={handleStartPayment}
        />
      </>
    )
  }

  // --- Verifying / Pending States ---
  if (paymentState === 'verifying') {
    return <><SEO noindex title="Verifying payment" /><PaymentVerifyingScreen /></>
  }

  if (paymentState === 'pending' && verifiedResult) {
    return (
      <>
        <SEO noindex title="Payment pending" />
        <PaymentPendingScreen
          checking={processing}
          message={verifiedResult.paymentMethod ? `Authorized via ${verifiedResult.paymentMethod.toUpperCase()}.` : ''}
          onRecheck={handleRecheckStatus}
          orderNumber={verifiedResult.orderNumber}
        />
      </>
    )
  }

  if (loading && !quote) {
    return (
      <SiteShell>
        <SEO noindex title="Checkout" />
        <main className="dm-section">
          <div className="dm-container">
            <EmptyState title="Preparing checkout" description="Revalidating products and calculating server fees." />
          </div>
        </main>
      </SiteShell>
    )
  }

  // --- Premium Checkout View ---
  return (
    <SiteShell>
      <SEO noindex title="Checkout" />
      <PageHeader
        breadcrumbs={[{ label: 'Checkout' }]}
        description="Select your preferred payment method. Amounts are calculated and verified by the Repohaus backend."
        eyebrow="Secure Razorpay Checkout"
        title="Complete your payment"
      />
      <main className="dm-section dm-checkout pt-4">
        <div className="dm-container">
          <div className="dm-checkout__grid">
            {/* Left: Payment methods */}
            <section className="dm-checkout__main" aria-label="Payment method">
              <div className="dm-checkout__title">
                <span className="dm-checkout__title-icon" aria-hidden="true">
                  <FaLock />
                </span>
                <h2>Payment Method</h2>
              </div>

              <PaymentMethodPicker
                disabled={processing}
                onChange={setSelectedMethod}
                value={selectedMethod}
              />

              <p className="dm-secure-note mt-3 mb-0" style={{ justifyContent: 'flex-start' }}>
                <FaLock aria-hidden="true" size={12} />
                Card, UPI and banking credentials are collected only inside Razorpay's secure checkout — never stored by Repohaus.
              </p>

              {error && (
                <div className="alert alert-danger d-flex align-items-center mt-4 mb-0" role="alert">
                  <FaExclamationTriangle className="me-2 flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}

              {paymentState === 'dismissed' && !error && (
                <div className="alert alert-info d-flex align-items-center mt-4 mb-0" role="alert">
                  <FaLock className="me-2 flex-shrink-0" />
                  <div>
                    The Razorpay payment window was closed. Your order remains pending — you can complete payment
                    whenever you are ready.
                  </div>
                </div>
              )}
            </section>

            {/* Right: Order summary */}
            <aside className="dm-order-card" aria-label="Order summary">
              <div className="dm-order-card__head">
                <h2 className="h5 mb-0">Order Summary</h2>
                <span className="dm-preview-label dm-preview-label--inline">{quote?.items?.length || 0} item(s)</span>
              </div>

              {!quote?.items?.length ? (
                <EmptyState
                  description="Your cart is empty. Add a project or portfolio to continue."
                  title="Nothing to pay for"
                />
              ) : (
                <>
                  {quote.items.map((item) => (
                    <OrderItemRow item={item} key={item.id} />
                  ))}

                  <div className="dm-coupon">
                    <input
                      aria-label="Coupon code"
                      className="form-control"
                      disabled={processing}
                      onChange={(event) => setCoupon(event.target.value)}
                      placeholder="Coupon code"
                      value={coupon}
                    />
                    <button
                      className="btn btn-outline-primary"
                      disabled={processing}
                      onClick={handleApplyCoupon}
                      type="button"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="dm-totals">
                    <div className="dm-summary-row">
                      <span>Subtotal</span>
                      <PriceDisplay amount={quote.subtotal} />
                    </div>
                    <div className="dm-summary-row">
                      <span>Discount</span>
                      <PriceDisplay amount={quote.discount} />
                    </div>
                    <div className="dm-summary-row">
                      <span>Platform fee ({quote.platform_fee_percentage}%)</span>
                      <PriceDisplay amount={quote.platform_fee} />
                    </div>
                    <div className="dm-summary-row">
                      <span>Convenience fee ({quote.convenience_fee_percentage}%)</span>
                      <PriceDisplay amount={quote.convenience_fee} />
                    </div>
                    {quote.taxes?.map((tax) => (
                      <div className="dm-summary-row" key={tax.name}>
                        <span>{tax.name}</span>
                        <PriceDisplay amount={tax.amount} />
                      </div>
                    ))}
                    <div className="dm-total-row">
                      <span className="dm-total-row__label">Total Payable</span>
                      <span className="dm-total-row__amount">{formatInr(quote.total)}</span>
                    </div>
                  </div>

                  {quote.tax_configuration_incomplete && (
                    <p className="dm-purchase-note">Tax configuration is incomplete; no legal tax treatment is claimed.</p>
                  )}

                  <button
                    className={`dm-pay-now mt-3${processing ? ' dm-pay-now--loading' : ''}`}
                    disabled={processing || paymentInitiatedRef.current || !quote.items?.length}
                    onClick={handleStartPayment}
                    type="button"
                  >
                    {processing ? (
                      <>Processing…</>
                    ) : paymentState === 'failed' || paymentState === 'dismissed' ? (
                      <>Retry — Pay {formatInr(quote.total)}</>
                    ) : (
                      <>Pay {formatInr(quote.total)}</>
                    )}
                  </button>

                  <p className="dm-secure-note">
                    <FaLock aria-hidden="true" size={12} /> 256-bit SSL encrypted • Razorpay Secure Payments
                  </p>
                </>
              )}
            </aside>
          </div>

          <div className="text-center mt-4">
            <Link className="dm-text-link" to="/cart">
              ← Back to cart
            </Link>
          </div>
        </div>
      </main>

      {paymentState === 'processing' && (
        <div className="dm-processing-overlay">
          <div className="dm-processing-card">
            <div className="dm-processing-spinner">
              <FaLock className="dm-processing-spinner-icon" />
            </div>
            <h3 className="dm-processing-title">Connecting Securely to Razorpay</h3>
            <p className="dm-processing-desc">
              Please do not close this window. Your payment is being processed securely.
            </p>
            <p className="dm-processing-warning">
              For UPI QR: scan the code within your payment app. For UPI Intent: complete payment in the selected app.
            </p>
          </div>
        </div>
      )}
    </SiteShell>
  )
}

export default CheckoutPage
