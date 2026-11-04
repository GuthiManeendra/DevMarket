import { useParams } from 'react-router-dom'
import { FaCheck, FaDownload, FaLock } from 'react-icons/fa'
import { demoProjects } from '../data/demoCatalog'
import useMarketplace from '../context/useMarketplace'
import { Badge, EmptyState, PriceDisplay } from '../components/common/Feedback'
import { Breadcrumb } from '../components/common/PageHeader'
import { TechnologyBadge } from '../components/common/ProductTools'
import { PrimaryButton } from '../components/common/Buttons'
import SiteShell from '../layouts/SiteShell'

function ProjectDetailsPage() {
  const { id } = useParams()
  const item = demoProjects.find((project) => project.id === id) || demoProjects[0]
  const { addToCart } = useMarketplace()
  const sections = [
    ['Overview', 'This design preview shows where the product overview will appear once catalog data is connected.'],
    ['Problem statement', 'The complete problem statement will be supplied by the verified product record.'],
    ['Proposed solution', 'Solution details, features, architecture, and requirements will be displayed here.'],
    ['Installation and license', 'Installation guidance and licensing terms will be provided with the real product data.'],
  ]

  return (
    <SiteShell>
      <main className="dm-section pt-4">
        <div className="dm-container">
          <Breadcrumb items={[{ label: 'Projects', to: '/projects' }, { label: item.title }]} />
          <div className="row g-5 mt-1">
            <div className="col-lg-7">
              <div className="dm-detail-visual"><span className="dm-preview-label">Protected product preview</span><div className="dm-detail-visual__icon">DM</div></div>
              <div className="d-flex flex-wrap align-items-center gap-2 mt-4"><Badge>{item.category}</Badge>{item.technologies.map((technology) => <TechnologyBadge key={technology}>{technology}</TechnologyBadge>)}</div>
              <h1 className="mt-3">{item.title}</h1>
              <p className="lead dm-muted">{item.description}</p>
              <div className="dm-detail-tabs mt-5">
                {sections.map(([title, description]) => <section key={title}><h2 className="h5">{title}</h2><p>{description}</p></section>)}
              </div>
              <EmptyState description="Screenshots, demo video, documentation preview, and system requirements will appear with the verified product record." title="Detailed product content is not connected yet" />
            </div>
            <div className="col-lg-5">
              <aside className="dm-purchase-card">
                <Badge>Design preview</Badge>
                <h2 className="h4 mt-3">Purchase summary</h2>
                <p className="dm-muted">Prices and packages will only be displayed from the backend after integration.</p>
                <div className="d-flex justify-content-between align-items-center border-top border-bottom py-3 my-4"><span className="dm-muted">Price</span><PriceDisplay /></div>
                <PrimaryButton className="w-100" onClick={() => addToCart(item)}>Add preview to cart</PrimaryButton>
                <p className="dm-purchase-note mt-3"><FaLock aria-hidden="true" /> Source files stay protected until verified payment.</p>
                <p className="dm-purchase-note"><FaDownload aria-hidden="true" /> Download access will be enabled after purchase integration.</p>
                <p className="dm-purchase-note"><FaCheck aria-hidden="true" /> AI minimum pricing will be enforced by backend data.</p>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default ProjectDetailsPage
