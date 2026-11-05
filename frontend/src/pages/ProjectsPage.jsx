import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { fetchPricingConfiguration, fetchProjectCategories, fetchProjects } from '../services/projectService'
import { PageHeader } from '../components/common/PageHeader'
import { ErrorState, FilterSidebar, LoadingSkeleton, Pagination, ProductGrid, SearchBar } from '../components/common/ProductTools'
import MarketplaceProjectCard from '../components/cards/MarketplaceProjectCard'
import SiteShell from '../layouts/SiteShell'

function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pricing, setPricing] = useState(null)

  useEffect(() => {
    let active = true
    fetchProjectCategories()
      .then((categoryData) => {
        if (!active) return
        setCategories(categoryData.results || categoryData)
      })
      .catch(() => active && setError('Projects are temporarily unavailable. Please try again later.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  useEffect(() => {
    fetchPricingConfiguration().then(setPricing).catch(() => setPricing(null))
  }, [])

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setLoading(true)
      const params = {
        page,
        search: query || undefined,
        category: category || undefined,
        ordering: sort === 'name' ? 'title' : sort === 'category' ? 'category' : undefined,
      }
      fetchProjects(params)
        .then((data) => {
          if (!active) return
          setProjects(data.results || data)
          setPagination(data)
          setError('')
        })
        .catch(() => active && setError('Projects are temporarily unavailable. Please try again later.'))
        .finally(() => active && setLoading(false))
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [category, page, query, sort])

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
          {pricing && <div className="alert alert-info mb-4" role="status">AI projects start at {new Intl.NumberFormat('en-IN', { style: 'currency', currency: pricing.currency || 'INR' }).format(Number(pricing.ai_minimum_price))}.</div>}
          <div className="row g-4">
            <div className="col-lg-3"><FilterSidebar categories={categories} onCategoryChange={(value) => { setCategory(value); setPage(1) }} onClear={clearFilters} onSortChange={setSort} selectedCategory={category} sort={sort} /></div>
            <div className="col-lg-9">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4"><p className="dm-muted mb-0">{pagination.count || 0} published projects</p><span className="dm-preview-label dm-preview-label--inline">Live catalog</span></div>
              {loading ? <ProductGrid><div className="col-md-6"><LoadingSkeleton /></div><div className="col-md-6"><LoadingSkeleton /></div></ProductGrid> : error ? <ErrorState message={error} /> : projects.length > 0 ? <ProductGrid>{projects.map((item) => <div className="col-md-6" key={item.id}><MarketplaceProjectCard item={item} /></div>)}</ProductGrid> : <div className="dm-card p-5 text-center"><h2 className="h5">No published projects yet</h2><p className="dm-muted">Try another filter or check back after the first project is published.</p><button className="dm-btn dm-btn--primary" onClick={clearFilters} type="button">Clear filters <FaArrowRight aria-hidden="true" /></button></div>}
              <div className="mt-5"><Pagination hasNext={Boolean(pagination.next)} onChange={setPage} page={page} /></div>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default ProjectsPage
