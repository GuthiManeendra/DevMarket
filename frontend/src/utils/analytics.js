const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''

let initialized = false

export function initAnalytics() {
  if (initialized || !GA_MEASUREMENT_ID || typeof window === 'undefined') return
  initialized = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackPageView(path) {
  if (!initialized || !GA_MEASUREMENT_ID) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (!initialized || !GA_MEASUREMENT_ID) return
  // Never send PII, payment credentials or order secrets to analytics.
  const safeParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) =>
      ['string', 'number', 'boolean'].includes(typeof value) && value !== ''
    )
  )
  window.gtag('event', name, safeParams)
}
