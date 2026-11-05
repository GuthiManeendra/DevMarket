import api from './api'

export async function fetchProjects(params = {}) {
  const response = await api.get('/projects/', { params })
  return response.data
}

export async function fetchProject(slug) {
  const response = await api.get(`/projects/${slug}/`)
  return response.data
}

export async function fetchFeaturedProjects() {
  const response = await api.get('/projects/featured/')
  return response.data
}

export async function fetchProjectCategories() {
  const response = await api.get('/projects/categories/')
  return response.data
}

export async function fetchPricingConfiguration() {
  const response = await api.get('/pricing/configuration/')
  return response.data
}

export async function fetchPortfolios(params = {}) {
  const response = await api.get('/portfolios/', { params })
  return response.data
}

export async function fetchPortfolio(slug) {
  const response = await api.get(`/portfolios/${slug}/`)
  return response.data
}

export async function fetchPortfolioCategories() {
  const response = await api.get('/portfolios/categories/')
  return response.data
}

const guestTokenKey = 'devmarket_guest_token'

export function getGuestToken() {
  let token = window.localStorage.getItem(guestTokenKey)
  if (!token) {
    token = crypto.randomUUID()
    window.localStorage.setItem(guestTokenKey, token)
  }
  return token
}

function guestHeaders() {
  return { 'X-Guest-Token': getGuestToken() }
}

export async function fetchCart() {
  const response = await api.get('/cart/', { headers: guestHeaders() })
  return response.data
}

export async function removeCartItem(itemId) {
  await api.delete(`/cart/items/${itemId}/`, { headers: guestHeaders() })
  return fetchCart()
}

export async function clearCart() {
  await api.delete('/cart/clear/', { headers: guestHeaders() })
  return fetchCart()
}

export async function fetchCheckoutQuote(couponCode = '') {
  const response = await api.post('/checkout/quote/', { coupon_code: couponCode }, { headers: guestHeaders() })
  return response.data
}

export async function addCartItem(item) {
  const response = await api.post('/cart/items/', item, { headers: guestHeaders() })
  return response.data
}

export async function createCheckoutOrder(couponCode = '', idempotencyKey = '') {
  const key = idempotencyKey || crypto.randomUUID()
  const response = await api.post(
    '/checkout/create-order/',
    { coupon_code: couponCode, idempotency_key: key },
    {
      headers: {
        ...guestHeaders(),
        'Idempotency-Key': key,
      },
    }
  )
  return response.data
}

export async function createPaymentOrder(orderNumber, idempotencyKey = '') {
  const key = idempotencyKey || crypto.randomUUID()
  const response = await api.post(
    '/payments/create/',
    { order_number: orderNumber },
    {
      headers: {
        ...guestHeaders(),
        'Idempotency-Key': key,
      },
    }
  )
  return response.data
}

export async function verifyPayment(paymentData) {
  const response = await api.post(
    '/payments/verify/',
    paymentData,
    { headers: guestHeaders() }
  )
  return response.data
}

export async function fetchPaymentStatus(orderNumber) {
  const response = await api.get(
    `/payments/status/${orderNumber}/`,
    { headers: guestHeaders() }
  )
  return response.data
}
