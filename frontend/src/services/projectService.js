import api from './api'

export async function fetchProjects(params = {}, signal) {
  const response = await api.get('/projects/', { params, signal })
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

function requestHeaders() {
  const headers = {}
  // If authenticated, the api interceptor adds Authorization header automatically.
  // Only add X-Guest-Token for unauthenticated users.
  const token = window.localStorage.getItem('devmarket_auth_token')
  if (!token) {
    headers['X-Guest-Token'] = getGuestToken()
  }
  return headers
}

export async function fetchCart() {
  const response = await api.get('/cart/', { headers: requestHeaders() })
  return response.data
}

export async function removeCartItem(itemId) {
  await api.delete(`/cart/items/${itemId}/`, { headers: requestHeaders() })
  return fetchCart()
}

export async function clearCart() {
  await api.delete('/cart/clear/', { headers: requestHeaders() })
  return fetchCart()
}

export async function fetchCheckoutQuote(couponCode = '', itemIds = null) {
  const payload = { coupon_code: couponCode }
  if (itemIds?.length) {
    payload.item_ids = itemIds
  }
  const response = await api.post('/checkout/quote/', payload, { headers: requestHeaders() })
  return response.data
}

export async function addCartItem(item) {
  const response = await api.post('/cart/items/', item, { headers: requestHeaders() })
  return response.data
}

export async function createCheckoutOrder(couponCode = '', idempotencyKey = '', itemIds = null) {
  const key = idempotencyKey || crypto.randomUUID()
  const payload = { coupon_code: couponCode, idempotency_key: key }
  if (itemIds?.length) {
    payload.item_ids = itemIds
  }
  const response = await api.post(
    '/checkout/create-order/',
    payload,
    {
      headers: requestHeaders(),
      ...guestTokenKey && { 'Idempotency-Key': key },
    },
  )
  return response.data
}

export async function createPaymentOrder(orderNumber, idempotencyKey = '') {
  const key = idempotencyKey || crypto.randomUUID()
  const response = await api.post(
    '/payments/create/',
    { order_number: orderNumber },
    {
      headers: requestHeaders(),
      ...guestTokenKey && { 'Idempotency-Key': key },
    },
  )
  return response.data
}

export async function verifyPayment(paymentData) {
  const response = await api.post(
    '/payments/verify/',
    paymentData,
    { headers: requestHeaders() }
  )
  return response.data
}

export async function fetchPaymentStatus(orderNumber) {
  const response = await api.get(
    `/payments/status/${orderNumber}/`,
    { headers: requestHeaders() }
  )
  return response.data
}

export async function fetchMyOrders() {
  const response = await api.get('/orders/')
  return response.data
}
