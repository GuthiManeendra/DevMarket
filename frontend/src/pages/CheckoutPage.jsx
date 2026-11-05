import { useEffect, useState } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaLock, FaRedo, FaShoppingBag, FaSyncAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {
  clearCart,
  createCheckoutOrder,
  createPaymentOrder,
  fetchCheckoutQuote,
  fetchPaymentStatus,
  verifyPayment,
} from '../services/projectService'
import { EmptyState, LoadingSpinner, PriceDisplay } from '../components/common/Feedback'
import { PageHeader } from '../components/common/PageHeader'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'
import { loadRazorpayScript } from '../utils/razorpay'

function CheckoutPage() {
  const [coupon, setCoupon] = useState('')
  const [quote, setQuote] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentState, setPaymentState] = useState(null) // null | 'verifying' | 'success' | 'pending' | 'failed' | 'dismissed'
  const [activeOrder, setActiveOrder] = useState(null)
  const [verifiedResult, setVerifiedResult] = useState(null)

  const handleApplyCoupon = () => {
    setLoading(true)
    fetchCheckoutQuote(coupon)
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
    let isMounted = true
    fetchCheckoutQuote(coupon)
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
    }
  }, [coupon])

  const handleStartPayment = async () => {
    setProcessing(true)
    setError('')

    try {
      // Step 1: Ensure Razorpay SDK is loaded
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded || typeof window.Razorpay === 'undefined') {
        setError('Unable to load the Razorpay checkout script. Please check your internet connection.')
        setProcessing(false)
        return
      }

      // Step 2: Retrieve or create DevMarket Order
      let order = activeOrder
      if (!order) {
        order = await createCheckoutOrder(coupon)
        setActiveOrder(order)
      }

      // Step 3: Create Razorpay Order via Backend API
      const sessionData = await createPaymentOrder(order.order_number)

      // Step 4: Configure Razorpay Checkout options
      const options = {
        key: sessionData.key_id,
        amount: sessionData.amount,
        currency: sessionData.currency || 'INR',
        name: 'DevMarket',
        description: `Order ${sessionData.devmarket_order_number}`,
        order_id: sessionData.razorpay_order_id,
        prefill: {
          name: sessionData.customer?.name || '',
          email: sessionData.customer?.email || '',
        },
        theme: {
          color: '#0d6efd',
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
              setVerifiedResult({
                orderNumber: verification.order_number,
                paymentId: response.razorpay_payment_id,
                amount: quote.total,
                status: 'Paid',
                message: verification.message || 'Payment verified and settled successfully.',
              })
              setPaymentState('success')
              try {
                await clearCart()
              } catch {
                // Ignore silent cart clear error
              }
            } else if (verification.payment_status === 'authorized' || verification.status === 'authorized') {
              setVerifiedResult({
                orderNumber: verification.order_number,
                paymentId: response.razorpay_payment_id,
                amount: quote.total,
                status: 'Authorized',
                message: 'Payment authorized by bank. Verification is pending capture confirmation.',
              })
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
    }
  }

  const handleRecheckStatus = async () => {
    if (!activeOrder?.order_number) return
    setProcessing(true)
    try {
      const res = await fetchPaymentStatus(activeOrder.order_number)
      if (res.is_paid || res.status === 'paid') {
        setVerifiedResult({
          orderNumber: res.order_number,
          paymentId: res.payments?.[0]?.gateway_payment_id || 'Captured via Gateway',
          amount: res.total_amount,
          status: 'Paid',
          message: 'Payment has been successfully verified and confirmed.',
        })
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

  if (loading && !quote) {
    return (
      <SiteShell>
        <main className="dm-section">
          <div className="dm-container">
            <EmptyState title="Preparing checkout" description="Revalidating products and calculating server fees." />
          </div>
        </main>
      </SiteShell>
    )
  }

  // --- Success State ---
  if (paymentState === 'success' && verifiedResult) {
    return (
      <SiteShell>
        <PageHeader
          breadcrumbs={[{ label: 'Checkout', to: '/checkout' }, { label: 'Confirmation' }]}
          description="Your payment has been cryptographically verified on the DevMarket backend."
          eyewear="Order Confirmed"
          title="Payment Successful"
        />
        <main className="dm-section pt-4">
          <div className="dm-container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="dm-purchase-card text-center p-5">
                  <FaCheckCircle aria-hidden="true" className="text-success mb-3" size={60} />
                  <h2 className="h4 text-success mb-2">Payment Verified & Settled</h2>
                  <p className="dm-muted mb-4">{verifiedResult.message}</p>

                  <div className="border rounded p-3 mb-4 text-start bg-light">
                    <div className="dm-summary-row mb-2">
                      <span className="text-muted">Order Reference:</span>
                      <strong>{verifiedResult.orderNumber}</strong>
                    </div>
                    <div className="dm-summary-row mb-2">
                      <span className="text-muted">Gateway Payment ID:</span>
                      <code>{verifiedResult.paymentId}</code>
                    </div>
                    <div className="dm-summary-row mb-2">
                      <span className="text-muted">Amount Paid:</span>
                      <strong><PriceDisplay amount={verifiedResult.amount} /></strong>
                    </div>
                    <div className="dm-summary-row mb-0">
                      <span className="text-muted">Order Status:</span>
                      <span className="badge bg-success">PAID</span>
                    </div>
                  </div>

                  <p className="dm-purchase-note mb-4">
                    Thank you for your purchase! A receipt has been registered in the DevMarket system.
                  </p>

                  <div className="d-flex gap-3 justify-content-center">
                    <Link to="/projects">
                      <PrimaryButton>
                        <FaShoppingBag className="me-2" /> Explore More Projects
                      </PrimaryButton>
                    </Link>
                    <Link to="/">
                      <SecondaryButton>Return Home</SecondaryButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SiteShell>
    )
  }

  // --- Verification In Progress State ---
  if (paymentState === 'verifying') {
    return (
      <SiteShell>
        <main className="dm-section">
          <div className="dm-container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="dm-purchase-card text-center p-5">
                  <LoadingSpinner label="Verifying payment..." />
                  <h2 className="h4 mt-4 mb-2">Verifying Payment Signature</h2>
                  <p className="dm-muted">
                    We are verifying cryptographic payment proof and capture status with Razorpay servers.
                    Please do not close or refresh this page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SiteShell>
    )
  }

  // --- Authorized / Pending State ---
  if (paymentState === 'pending' && verifiedResult) {
    return (
      <SiteShell>
        <main className="dm-section">
          <div className="dm-container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="dm-purchase-card text-center p-5">
                  <FaExclamationTriangle className="text-warning mb-3" size={50} />
                  <h2 className="h4 mb-2">Payment Authorized — Pending Capture</h2>
                  <p className="dm-muted mb-4">{verifiedResult.message}</p>
                  <p className="small text-muted">
                    Order Reference: <strong>{verifiedResult.orderNumber}</strong>
                  </p>
                  <PrimaryButton className="w-100 mt-3" disabled={processing} onClick={handleRecheckStatus}>
                    {processing ? <LoadingSpinner label="Checking..." /> : <><FaSyncAlt className="me-2" /> Check Status Now</>}
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SiteShell>
    )
  }

  // --- Standard Review & Checkout View ---
  return (
    <SiteShell>
      <PageHeader
        breadcrumbs={[{ label: 'Checkout' }]}
        description="All amounts below are calculated and verified by the DevMarket backend authority."
        eyebrow="Secure Razorpay Gateway"
        title="Review your order"
      />
      <main className="dm-section pt-4">
        <div className="dm-container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="dm-purchase-card">
                <h2 className="h5 mb-3">Items Snapshot</h2>
                {quote?.items?.map((item) => (
                  <div className="dm-summary-row" key={item.id}>
                    <span>{item.title}</span>
                    <PriceDisplay amount={item.total} />
                  </div>
                ))}

                <div className="input-group my-4">
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

                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <FaExclamationTriangle className="me-2 flex-shrink-0" />
                    <div>{error}</div>
                  </div>
                )}

                {paymentState === 'dismissed' && !error && (
                  <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                    <FaLock className="me-2 flex-shrink-0" />
                    <div>
                      The Razorpay payment window was closed. Your order remains pending and you can complete payment
                      whenever you are ready.
                    </div>
                  </div>
                )}

                {quote && (
                  <>
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
                    <div className="dm-summary-row dm-summary-row--total">
                      <strong>Total Payable</strong>
                      <strong><PriceDisplay amount={quote.total} /></strong>
                    </div>

                    {quote.tax_configuration_incomplete && (
                      <p className="dm-purchase-note">Tax configuration is incomplete; no legal tax treatment is claimed.</p>
                    )}

                    <div className="mt-4">
                      {paymentState === 'failed' || paymentState === 'dismissed' ? (
                        <PrimaryButton
                          className="w-100 py-3"
                          disabled={processing}
                          onClick={handleStartPayment}
                        >
                          {processing ? (
                            <>
                              <LoadingSpinner label="Preparing..." /> Preparing payment...
                            </>
                          ) : (
                            <>
                              <FaRedo className="me-2" /> Retry Payment with Razorpay
                            </>
                          )}
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton
                          className="w-100 py-3"
                          disabled={processing || !quote.items?.length}
                          onClick={handleStartPayment}
                        >
                          {processing ? (
                            <>
                              <LoadingSpinner label="Initializing..." /> Connecting to Razorpay...
                            </>
                          ) : (
                            <>
                              <FaLock className="me-2" /> Pay with Razorpay (<PriceDisplay amount={quote.total} />)
                            </>
                          )}
                        </PrimaryButton>
                      )}
                    </div>

                    <div className="text-center mt-3">
                      <small className="text-muted d-inline-flex align-items-center">
                        <FaLock className="me-1" size={12} /> 256-bit SSL encrypted • Razorpay Secure Payments
                      </small>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default CheckoutPage
