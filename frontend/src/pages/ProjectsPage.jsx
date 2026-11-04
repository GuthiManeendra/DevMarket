import { useMemo, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { demoProjects, projectCategories } from '../data/demoCatalog'
import { PageHeader } from '../components/common/PageHeader'
import { FilterSidebar, Pagination, ProductGrid, SearchBar } from '../components/common/ProductTools'
import MarketplaceProjectCard from '../components/cards/MarketplaceProjectCard'
import SiteShell from '../layouts/SiteShell'

function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const filteredProjects = useMemo(() => {
    const result = demoProjects.filter((item) => {
      const searchable = `${item.title} ${item.category} ${item.description} ${item.technologies.join(' ')}`.toLowerCase()
      return searchable.includes(query.toLowerCase()) && (!category || item.category === category)
    })
    return [...result].sort((a, b) => sort === 'name' ? a.title.localeCompare(b.title) : sort === 'category' ? a.category.localeCompare(b.category) : 0)
  }, [category, query, sort])

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    setSort('relevance')
    setPage(1)
  }

  return (
    <SiteShell>
      <PageHeader breadcrumbs={[{ label: 'Projects' }]} description="Discover projects across modern technology domains and find the right solution for your next development journey." eyebrow="Explore the marketplace" title="Explore technology projects">
        <SearchBar onChange={setQuery} onClear={() => setQuery('')} onSubmit={(event) => event.preventDefault()} value={query} />
      </PageHeader>
      <main className="dm-section pt-4">
        <div className="dm-container">
          <div className="row g-4">
            <div className="col-lg-3"><FilterSidebar categories={projectCategories} onCategoryChange={(value) => { setCategory(value); setPage(1) }} onClear={clearFilters} onSortChange={setSort} selectedCategory={category} sort={sort} /></div>
            <div className="col-lg-9">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4"><p className="dm-muted mb-0">{filteredProjects.length} design previews available</p><span className="dm-preview-label dm-preview-label--inline">Catalog data will come from Django</span></div>
              {filteredProjects.length > 0 ? <ProductGrid>{filteredProjects.map((item) => <div className="col-md-6" key={item.id}><MarketplaceProjectCard item={item} /></div>)}</ProductGrid> : <div className="dm-card p-5 text-center"><h2 className="h5">No previews match those filters</h2><p className="dm-muted">Try another search or clear the current filters.</p><button className="dm-btn dm-btn--primary" onClick={clearFilters} type="button">Clear filters <FaArrowRight aria-hidden="true" /></button></div>}
              <div className="mt-5"><Pagination hasNext={false} onChange={setPage} page={page} /></div>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default ProjectsPage
