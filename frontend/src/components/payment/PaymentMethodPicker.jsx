import {
  FaBolt,
  FaCreditCard,
  FaHourglassHalf,
  FaMobileAlt,
  FaUniversity,
  FaWallet,
} from 'react-icons/fa'

export const PAYMENT_METHODS = [
  {
    id: 'upi',
    label: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM & more',
    chips: ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Other UPI'],
    icon: FaMobileAlt,
    razorpayMethod: 'upi',
  },
  {
    id: 'card',
    label: 'Credit & Debit Cards',
    description: 'Visa, Mastercard, RuPay & other networks',
    chips: ['Visa', 'Mastercard', 'RuPay'],
    icon: FaCreditCard,
    razorpayMethod: 'card',
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    description: 'All major Indian banks supported by Razorpay',
    icon: FaUniversity,
    razorpayMethod: 'netbanking',
  },
  {
    id: 'wallet',
    label: 'Wallets',
    description: 'Paytm, Amazon Pay, Mobikwik & more',
    icon: FaWallet,
    razorpayMethod: 'wallet',
  },
  {
    id: 'emi',
    label: 'EMI',
    description: 'Pay in monthly installments — subject to eligibility',
    icon: FaBolt,
    razorpayMethod: 'emi',
  },
  {
    id: 'paylater',
    label: 'Pay Later',
    description: 'Pay after delivery — subject to Razorpay eligibility',
    icon: FaHourglassHalf,
    razorpayMethod: 'paylater',
  },
]

function PaymentMethodPicker({ value, onChange, disabled = false }) {
  return (
    <div className="dm-pay-methods" role="radiogroup" aria-label="Payment method">
      {PAYMENT_METHODS.map((method) => {
        const Icon = method.icon
        const selected = value === method.id
        return (
          <label
            className={`dm-pay-method${selected ? ' dm-pay-method--selected' : ''}`}
            key={method.id}
          >
            <input
              checked={selected}
              disabled={disabled}
              name="dm-payment-method"
              onChange={() => onChange(method.id)}
              type="radio"
              value={method.id}
            />
            <span className="dm-pay-method__icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="dm-pay-method__body">
              <span className="dm-pay-method__name">{method.label}</span>
              <span className="dm-pay-method__desc">{method.description}</span>
              {method.chips?.length > 0 && (
                <span className="dm-pay-method__chips">
                  {method.chips.map((chip) => (
                    <span className="dm-pay-method__chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </span>
              )}
            </span>
            <span className="dm-pay-method__radio" aria-hidden="true" />
          </label>
        )
      })}
    </div>
  )
}

export function getRazorpayMethod(methodId) {
  const method = PAYMENT_METHODS.find((entry) => entry.id === methodId)
  return method?.razorpayMethod || ''
}

export default PaymentMethodPicker
