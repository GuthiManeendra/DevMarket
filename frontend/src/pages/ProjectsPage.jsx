import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaArrowRight,
  FaFilter,
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaRedo,
  FaLayerGroup,
} from 'react-icons/fa'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { Pagination } from '../components/common/ProductTools'
import PremiumProjectCard from '../components/projects/PremiumProjectCard'
import {
  fetchProjectCategories,
  fetchProjects,
} from '../services/projectService'
import { projectToCard } from '../utils/projectMapping'
import useBuyNow from '../hooks/useBuyNow'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'
import { breadcrumbJsonLd } from '../utils/seo'
import '../styles/premium-projects.css'

const PAGE_SIZE = 8

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest first' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: 'title', label: 'Title (A - Z)' },
  { value: '-title', label: 'Title (Z - A)' },
]

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || ''

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [sort, setSort] = useState('-created_at')
  const [difficulty, setDifficulty] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [technology, setTechnology] = useState('')
  const [page, setPage] = useState(1)

  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ count: 0, next: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { buyNow } = useBuyNow()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    fetchProjectCategories()
      .then((data) => setCategories(data.results || data || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchProjects({
      page,
      page_size: PAGE_SIZE,
      search: debouncedQuery || undefined,
      category: categoryParam || undefined,
      ordering: sort,
      difficulty_level: difficulty || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      technology: technology || undefined,
    })
      .then((data) => {
        if (!active) return
        const list = data.results || data || []
        setProjects(list.map(projectToCard))
        setPagination(data)
        setError('')
      })
      .catch(() => {
        if (active) setError('Projects are temporarily unavailable. Please try again later.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [categoryParam, debouncedQuery, difficulty, maxPrice, minPrice, page, sort, technology])

  const handleCategorySelect = (slug) => {
    setPage(1)
    if (!slug) {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category: slug })
    }
  }

  const handleClearFilters = () => {
    setQuery('')
    setDebouncedQuery('')
    setSort('-created_at')
    setDifficulty('')
    setMinPrice('')
    setMaxPrice('')
    setTechnology('')
    setPage(1)
    setSearchParams({})
  }

  const activeCategoryName = useMemo(
    () => categories.find((cat) => cat.slug === categoryParam)?.name || 'All Projects',
    [categories, categoryParam]
  )

  const hasActiveFilters = Boolean(
    query || categoryParam || difficulty || minPrice || maxPrice || technology || sort !== '-created_at'
  )

  return (
    <SiteShell>
      <SEO
        description="Explore production-grade software projects — Python, JavaScript, AI/ML, web and mobile applications — with transparent pricing and secure Razorpay checkout."
        jsonLd={breadcrumbJsonLd([{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }])}
        keywords="software projects, source code, programming projects, web development, AI projects, Python projects"
        path="/projects"
        title="Explore Software Projects for Sale"
      />
      <PageHeader
        breadcrumbs={[{ label: 'Projects' }]}
        description="Explore production-grade projects with transparent pricing and secure Razorpay checkout."
        eyebrow="Curated Project Catalogue"
        title="Explore Projects by Category"
      >
        <div className="dm-search-bar-wrap w-100 max-w-700 mx-auto">
          <form className="dm-search-bar" onSubmit={(e) => e.preventDefault()}>
            <FaSearch aria-hidden="true" />
            <input
              aria-label="Search projects by title or technology"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by project title or technology (e.g. Python, YOLO, React)..."
              value={query}
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery('')} type="button">
                <FaTimes aria-hidden="true" />
              </button>
            )}
          </form>
        </div>
      </PageHeader>

      <main className="dm-section pt-4">
        <div className="dm-container">
          <div className="row g-4">
            {/* Filter Controls Sidebar */}
            <div className="col-lg-3">
              <aside className="dm-filter-sidebar">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 mb-0 d-flex align-items-center gap-2">
                    <FaSlidersH className="text-primary" /> Filter Projects
                  </h2>
                  {hasActiveFilters && (
                    <button
                      className="dm-text-button d-flex align-items-center gap-1"
                      onClick={handleClearFilters}
                      type="button"
                    >
                      <FaRedo size={11} /> Reset
                    </button>
                  )}
                </div>

                {/* 1. Category Dropdown */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-light d-flex align-items-center gap-2" htmlFor="category-dropdown-select">
                    <FaFilter size={12} className="text-info" /> Category
                  </label>
                  <select
                    className="dm-input dm-select-styled w-100"
                    id="category-dropdown-select"
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    value={categoryParam}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Sort Dropdown */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-light" htmlFor="sort-filter-select">
                    Sort By
                  </label>
                  <select
                    className="dm-input dm-select-styled w-100"
                    id="sort-filter-select"
                    onChange={(e) => { setSort(e.target.value); setPage(1) }}
                    value={sort}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Difficulty */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-light" htmlFor="difficulty-select">
                    Difficulty
                  </label>
                  <select
                    className="dm-input dm-select-styled w-100"
                    id="difficulty-select"
                    onChange={(e) => { setDifficulty(e.target.value); setPage(1) }}
                    value={difficulty}
                  >
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Price Range */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-light">Price Range (₹)</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        className="dm-input"
                        min="0"
                        onChange={(e) => { setMinPrice(e.target.value); setPage(1) }}
                        placeholder="Min"
                        type="number"
                        value={minPrice}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        className="dm-input"
                        min="0"
                        onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
                        placeholder="Max"
                        type="number"
                        value={maxPrice}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Technology */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-light" htmlFor="technology-input">
                    Technology
                  </label>
                  <input
                    className="dm-input"
                    id="technology-input"
                    onChange={(e) => { setTechnology(e.target.value); setPage(1) }}
                    placeholder="React, Django, Python..."
                    value={technology}
                  />
                </div>

                {/* Quick Category Navigation */}
                <div className="dm-category-list-nav mt-4 pt-3 border-top border-secondary border-opacity-25">
                  <label className="form-label fw-bold text-light small text-uppercase mb-2">
                    Quick Category Filter
                  </label>
                  <div className="d-flex flex-column gap-1">
                    <button
                      className={`dm-category-nav-link text-start ${!categoryParam ? 'active' : ''}`}
                      onClick={() => handleCategorySelect('')}
                      type="button"
                    >
                      <span>All Categories</span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        className={`dm-category-nav-link text-start ${categoryParam === cat.slug ? 'active' : ''}`}
                        key={cat.slug}
                        onClick={() => handleCategorySelect(cat.slug)}
                        type="button"
                      >
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            {/* Main Projects Section */}
            <div className="col-lg-9">
              {/* Status Header */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                <div>
                  <h2 className="h4 text-white mb-1">{activeCategoryName}</h2>
                  <p className="dm-muted small mb-0">
                    Showing <strong className="text-white">{projects.length}</strong> projects
                    {pagination.count ? ` of ${pagination.count} total` : ''}
                    {query && <> matching "<strong>{query}</strong>"</>}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="dm-preview-label dm-preview-label--inline">
                    <FaLayerGroup size={11} className="me-1" />
                    {activeCategoryName}
                  </span>
                  {hasActiveFilters && (
                    <button className="dm-btn dm-btn--secondary btn-sm" onClick={handleClearFilters} type="button">
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Projects Grid */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="loading">
                    <div className="dm-projects-grid">
                      {[0, 1, 2, 3].map((i) => (
                        <div className="dm-card p-4" key={i} style={{ minHeight: '220px' }} />
                      ))}
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 15 }}>
                    <div className="dm-card p-5 text-center my-4">
                      <h3 className="h5 text-white mb-2">Projects unavailable</h3>
                      <p className="dm-muted mb-4">{error}</p>
                      <button className="dm-btn dm-btn--primary" onClick={handleClearFilters} type="button">
                        Reset Filters <FaArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                ) : projects.length > 0 ? (
                  <motion.div
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key={`${categoryParam}-${debouncedQuery}-${sort}-${page}`}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="dm-projects-grid">
                      {projects.map((project, index) => (
                        <PremiumProjectCard
                          index={index}
                          key={project.id}
                          onBuyNow={() => buyNow({ type: 'project', id: project.id })}
                          project={project}
                        />
                      ))}
                    </div>
                    <div className="mt-4">
                      <Pagination hasNext={Boolean(pagination.next)} onChange={setPage} page={page} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 15 }} transition={{ duration: 0.3 }}>
                    <div className="dm-card p-5 text-center my-4">
                      <h3 className="h5 text-white mb-2">No projects found</h3>
                      <p className="dm-muted mb-4">
                        No published projects matched your filters.
                      </p>
                      <button className="dm-btn dm-btn--primary" onClick={handleClearFilters} type="button">
                        Reset All Filters <FaArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default ProjectsPage
