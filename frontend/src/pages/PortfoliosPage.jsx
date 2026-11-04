import { useMemo, useState } from 'react'
import { demoPortfolios } from '../data/demoCatalog'
import { PageHeader } from '../components/common/PageHeader'
import { FilterSidebar, ProductGrid, SearchBar } from '../components/common/ProductTools'
import MarketplacePortfolioCard from '../components/cards/MarketplacePortfolioCard'
import SiteShell from '../layouts/SiteShell'

function PortfoliosPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const filtered = useMemo(() => demoPortfolios.filter((item) => `${item.title} ${item.category} ${item.technologies.join(' ')}`.toLowerCase().includes(query.toLowerCase()) && (!category || item.category === category)), [category, query])
  return (
    <SiteShell>
      <PageHeader breadcrumbs={[{ label: 'Portfolio store' }]} description="Explore professional and premium animated portfolio templates designed for developers and technology professionals." eyebrow="The portfolio store" title="Build a portfolio that gets noticed">
        <SearchBar onChange={setQuery} onClear={() => setQuery('')} onSubmit={(event) => event.preventDefault()} value={query} />
      </PageHeader>
      <main className="dm-section pt-4">
        <div className="dm-container">
          <div className="row g-4">
            <div className="col-lg-3"><FilterSidebar categories={['Standard Professional', 'Premium Animated']} onCategoryChange={setCategory} onClear={() => { setCategory(''); setQuery('') }} onSortChange={() => {}} selectedCategory={category} sort="relevance" /></div>
            <div className="col-lg-9">
              <p className="dm-muted mb-4">{filtered.length} design previews available</p>
              <ProductGrid>{filtered.map((item) => <div className="col-md-6" key={item.id}><MarketplacePortfolioCard item={item} /></div>)}</ProductGrid>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default PortfoliosPage
