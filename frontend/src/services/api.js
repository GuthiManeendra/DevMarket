import axios from 'axios'

const AUTH_TOKEN_KEY = 'devmarket_auth_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Attach the Django REST framework token so authenticated endpoints
// (orders, purchases, account actions) can identify the customer.
api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

export default api
