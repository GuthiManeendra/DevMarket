import { Link, useLocation } from 'react-router-dom'
import SectionHeading from '../components/common/SectionHeading'
import SiteShell from '../layouts/SiteShell'

function PlaceholderPage() {
  const { pathname } = useLocation()
  const title = pathname.slice(1).replace('-', ' ') || 'page'

  return (
    <SiteShell>
      <main className="dm-section">
        <div className="dm-container dm-container--narrow text-center">
          <SectionHeading
            align="center"
            description="This area is part of the Repohaus product roadmap and will be built in a later phase."
            eyebrow="Coming next"
            title={`${title.charAt(0).toUpperCase()}${title.slice(1)} is being prepared`}
          />
          <Link className="dm-btn dm-btn--primary" to="/">Return home</Link>
        </div>
      </main>
    </SiteShell>
  )
}

export default PlaceholderPage
