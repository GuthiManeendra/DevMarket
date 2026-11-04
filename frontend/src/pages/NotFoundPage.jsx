import { Link } from 'react-router-dom'
import { PrimaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'

function NotFoundPage() {
  return <SiteShell><main className="dm-section"><div className="dm-container dm-container--narrow text-center"><div className="dm-eyebrow">404</div><h1 className="display-4">This page is off the roadmap.</h1><p className="lead dm-muted">The link may be incorrect, or this part of DevMarket may be coming in a later phase.</p><Link to="/"><PrimaryButton>Return home</PrimaryButton></Link></div></main></SiteShell>
}

export default NotFoundPage
