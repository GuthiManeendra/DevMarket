import { useEffect, useState } from 'react'
import { fetchPortfolioCategories, fetchPortfolios } from '../services/projectService'
import { PageHeader } from '../components/common/PageHeader'
import { ErrorState, LoadingSkeleton, Pagination, ProductGrid, SearchBar } from '../components/common/ProductTools'
import MarketplacePortfolioCard from '../components/cards/MarketplacePortfolioCard'
import SiteShell from '../layouts/SiteShell'

function PortfoliosPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [portfolioType, setPortfolioType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [technology, setTechnology] = useState('')
  const [sort, setSort] = useState('-created_at')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ count: 0, next: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPortfolioCategories().then((data) => setCategories(data.results || data)).catch(() => setError('Portfolio categories are temporarily unavailable.'))
  }, [])

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setLoading(true)
      fetchPortfolios({
        page,
        search: query || undefined,
        category: category || undefined,
        portfolio_type: portfolioType || undefined,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        technology: technology || undefined,
        ordering: sort,
      }).then((data) => {
        if (!active) return
        setItems(data.results || data)
        setPagination(data)
        setError('')
      }).catch(() => active && setError('Portfolios are temporarily unavailable. Please try again later.'))
        .finally(() => active && setLoading(false))
    }, 250)
    return () => { active = false; clearTimeout(timer) }
  }, [category, maxPrice, minPrice, page, portfolioType, query, sort, technology])

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    setPortfolioType('')
    setMinPrice('')
    setMaxPrice('')
    setTechnology('')
    setSort('-created_at')
    setPage(1)
  }

  return (
    <SiteShell>
      <PageHeader breadcrumbs={[{ label: 'Portfolio store' }]} description="Explore professional and premium animated portfolio templates designed for developers and technology professionals." eyebrow="The portfolio store" title="Build a portfolio that gets noticed">
        <SearchBar onChange={(value) => { setQuery(value); setPage(1) }} onClear={() => setQuery('')} onSubmit={(event) => event.preventDefault()} value={query} />
      </PageHeader>
      <main className="dm-section pt-4">
        <div className="dm-container">
          <div className="row g-4">
            <div className="col-lg-3">
              <aside className="dm-filter-sidebar">
                <div className="d-flex justify-content-between align-items-center mb-4"><h2 className="h5 mb-0">Filters</h2><button className="dm-text-button" onClick={clearFilters} type="button">Clear all</button></div>
                <label className="form-label fw-semibold" htmlFor="portfolio-type">Portfolio type</label>
                <select className="dm-input mb-3" id="portfolio-type" onChange={(event) => { setPortfolioType(event.target.value); setPage(1) }} value={portfolioType}><option value="">All types</option><option value="standard">Standard Professional</option><option value="premium_animated">Premium Animated</option></select>
                <label className="form-label fw-semibold" htmlFor="portfolio-category">Category</label>
                <select className="dm-input mb-3" id="portfolio-category" onChange={(event) => { setCategory(event.target.value); setPage(1) }} value={category}><option value="">All categories</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>
                <label className="form-label fw-semibold" htmlFor="portfolio-technology">Technology</label>
                <input className="dm-input mb-3" id="portfolio-technology" onChange={(event) => { setTechnology(event.target.value); setPage(1) }} placeholder="React, GSAP..." value={technology} />
                <div className="row g-2 mb-3"><div className="col-6"><input className="dm-input" min="0" onChange={(event) => setMinPrice(event.target.value)} placeholder="Min INR" type="number" value={minPrice} /></div><div className="col-6"><input className="dm-input" min="0" onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max INR" type="number" value={maxPrice} /></div></div>
                <label className="form-label fw-semibold" htmlFor="portfolio-sort">Sort by</label>
                <select className="dm-input" id="portfolio-sort" onChange={(event) => setSort(event.target.value)} value={sort}><option value="-created_at">Newest</option><option value="base_price">Price: low to high</option><option value="-base_price">Price: high to low</option><option value="title">Title</option></select>
              </aside>
            </div>
            <div className="col-lg-9">
              <p className="dm-muted mb-4">{pagination.count || 0} published portfolios</p>
              {loading ? <ProductGrid><div className="col-md-6"><LoadingSkeleton /></div><div className="col-md-6"><LoadingSkeleton /></div></ProductGrid> : error ? <ErrorState message={error} /> : items.length ? <ProductGrid>{items.map((item) => <div className="col-md-6" key={item.id}><MarketplacePortfolioCard item={item} /></div>)}</ProductGrid> : <div className="dm-card p-5 text-center"><h2 className="h5">No published portfolios yet</h2><p className="dm-muted mb-0">Portfolio templates will appear here after they are published from Django Admin.</p></div>}
              <div className="mt-5"><Pagination hasNext={Boolean(pagination.next)} onChange={setPage} page={page} /></div>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default PortfoliosPage
