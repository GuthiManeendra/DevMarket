import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView } from '../../utils/analytics'

function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    // Wait a tick so the page's SEO title is applied before the hit.
    const timer = setTimeout(() => trackPageView(location.pathname + location.search), 0)
    return () => clearTimeout(timer)
  }, [location.pathname, location.search])

  return null
}

export default AnalyticsTracker
