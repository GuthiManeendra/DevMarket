import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FaArrowLeft,
  FaBolt,
  FaCheckCircle,
  FaCode,
  FaDatabase,
  FaLayerGroup,
  FaProjectDiagram,
  FaServer,
  FaTools,
  FaListUl,
} from 'react-icons/fa'
import { Breadcrumb } from '../components/common/PageHeader'
import { EmptyState, PriceDisplay } from '../components/common/Feedback'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'
import { fetchProject } from '../services/projectService'
import { projectToCard } from '../utils/projectMapping'
import { formatInr } from '../utils/currency'
import useBuyNow from '../hooks/useBuyNow'
import useMarketplace from '../context/useMarketplace'
import { useFlyingCartAnimation } from '../hooks/useFlyingCartAnimation'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'
import { absoluteUrl, breadcrumbJsonLd } from '../utils/seo'
import { trackEvent } from '../utils/analytics'
import '../styles/premium-projects.css'

function ProjectDetailsPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { buyNow } = useBuyNow()
  const { addToCart } = useMarketplace()
  const { animateFlyToCart } = useFlyingCartAnimation()
  const projectImageRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    let active = true
    setLoading(true)
    setError('')
    fetchProject(id)
      .then((data) => {
        if (active) setProject(projectToCard(data))
      })
      .catch(() => {
        if (active) setError('This project is unavailable or has not been published.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [id])

  const seoData = useMemo(() => {
    if (!project) return null
    const api = project._api || {}
    const hasPrice = project.price !== null && project.price !== undefined && project.price !== ''
    const image = project.primaryImage?.image
      ? (project.primaryImage.image.startsWith('http')
          ? project.primaryImage.image
          : `${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')}${project.primaryImage.image}`)
      : undefined
    const canonicalPath = `/projects/${project.slug || id}`

    const productLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: project.title,
      description: project.shortDescription || project.overview || '',
      sku: String(project.id),
      category: project.category,
      url: absoluteUrl(canonicalPath),
      ...(image ? { image } : {}),
      ...(hasPrice
        ? {
            offers: {
              '@type': 'Offer',
              url: absoluteUrl(canonicalPath),
              priceCurrency: 'INR',
              price: Number(project.price),
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
    }

    const crumbs = breadcrumbJsonLd([
      { label: 'Home', to: '/' },
      { label: 'Projects', to: '/projects' },
      { label: project.title, to: canonicalPath },
    ])

    return {
      title: api.seo_title || `${project.title} — ${project.category} Project`,
      description: api.seo_description || project.shortDescription || project.overview,
      jsonLd: [productLd, crumbs],
    }
  }, [project, id])

  useEffect(() => {
    if (!project) return
    trackEvent('view_item', {
      currency: 'INR',
      value: project.price != null ? Number(project.price) : undefined,
      items: [
        {
          item_id: String(project.id),
          item_name: project.title,
          item_category: project.category,
          price: project.price != null ? Number(project.price) : undefined,
        },
      ],
    })
  }, [project])

  const handleAddToCart = async () => {
    if (!project) return
    setAdding(true)

    try {
      // Get cart icon element
      const cartIcon = document.querySelector('a[aria-label="Cart"]')
      if (!cartIcon) {
        await addToCart(project)
        return
      }

      // Create a canvas to render the project icon as an image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 80
      canvas.height = 80

      // Draw background with accent color
      const accentColor = project.accentColor || '#3b82f6'
      ctx.fillStyle = accentColor + '33'
      ctx.beginPath()
      ctx.arc(40, 40, 38, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = accentColor + '55'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw icon
      ctx.fillStyle = accentColor
      ctx.font = 'bold 36px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('DM', 40, 40)

      const iconImage = canvas.toDataURL()

      // Start animation
      animateFlyToCart(projectImageRef.current, cartIcon, iconImage, async () => {
        await addToCart(project)
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      // Delay state reset to allow animation to complete
      setTimeout(() => {
        setAdding(false)
      }, 800)
    }
  }

  if (loading) {
    return (
      <SiteShell>
        <SEO noindex title="Loading project" />
        <main className="dm-section pt-5">
          <div className="dm-container text-center py-5">
            <EmptyState description="Fetching the latest project details." title="Loading project" />
          </div>
        </main>
      </SiteShell>
    )
  }

  if (error || !project) {
    return (
      <SiteShell>
        <SEO noindex title="Project not found" />
        <main className="dm-section pt-5">
          <div className="dm-container text-center py-5">
            <EmptyState
              description={error || 'The requested project could not be found.'}
              title="Project Not Found"
            />
            <div className="mt-4">
              <Link className="dm-btn dm-btn--primary" to="/projects">
                <FaArrowLeft className="me-2" /> Back to All Projects
              </Link>
            </div>
          </div>
        </main>
      </SiteShell>
    )
  }

  const {
    title,
    category,
    difficulty,
    projectType,
    shortDescription,
    overview,
    problemStatement,
    keyFeatures = [],
    technologies = [],
    requirements = [],
    installationInstructions,
    documentationDescription,
    architectureDescription,
    liveDemoUrl,
    accentColor = '#3b82f6',
    price,
    compareAtPrice,
    discountPercentage = 0,
  } = project

  const hasPrice = price !== null && price !== undefined && price !== ''
  const primaryImage = project.primaryImage?.image
    ? (project.primaryImage.image.startsWith('http')
        ? project.primaryImage.image
        : `${(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')}${project.primaryImage.image}`)
    : null

  return (
    <SiteShell>
      {seoData && (
        <SEO
          description={seoData.description}
          image={primaryImage}
          jsonLd={seoData.jsonLd}
          keywords={`${project.title}, ${project.technologies.slice(0, 5).join(', ')}`}
          path={`/projects/${project.slug || id}`}
          title={seoData.title}
          type="product"
        />
      )}
      <main className="dm-section pt-4">
        <div className="dm-container">
          {/* Breadcrumb Navigation */}
          <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <Breadcrumb
              items={[
                { label: 'Projects', to: '/projects' },
                { label: category, to: category ? `/projects?category=${encodeURIComponent(project.categorySlug || category)}` : '/projects' },
                { label: title },
              ]}
            />
            <Link className="dm-btn dm-btn--secondary btn-sm" to="/projects">
              <FaArrowLeft className="me-1" /> Back to Catalog
            </Link>
          </div>

          {/* Project Hero Header */}
          <div className="dm-detail-hero-card mb-5">
            <div
              className="dm-detail-glow"
              style={{
                background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
              }}
            />
            <div className="dm-detail-hero-inner">
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <span className="dm-project-number-badge">
                  <FaLayerGroup size={12} /> Project #{project.id}
                </span>
                <span className="dm-card-category-pill">{category}</span>
                {projectType && <span className="dm-card-category-pill">{projectType}</span>}
                <span className={`dm-card-difficulty-badge dm-difficulty--${String(difficulty).toLowerCase()}`}>
                  {difficulty} Level
                </span>
              </div>

              <div className="d-flex align-items-start gap-4 flex-wrap flex-md-nowrap">
                <div ref={projectImageRef}>
                  {primaryImage ? (
                    <img
                      alt={title}
                      className="rounded"
                      src={primaryImage}
                      style={{ width: '88px', height: '88px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="dm-detail-icon-box"
                      style={{
                        borderColor: `${accentColor}55`,
                        boxShadow: `0 0 25px ${accentColor}33`,
                      }}
                    >
                      <FaLayerGroup size={36} style={{ color: accentColor }} />
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <h1 className="dm-detail-title">{title}</h1>
                  <p className="dm-detail-subtitle lead">{shortDescription}</p>
                </div>
              </div>

              {/* Quick Tech Ribbon */}
              <div className="dm-detail-tech-ribbon mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center gap-2 flex-wrap">
                <span className="dm-muted small fw-bold me-2">CORE TECHNOLOGIES:</span>
                {technologies.map((t) => (
                  <span className="dm-tech-pill" key={t}>
                    <span className="dm-tech-pill-dot" style={{ backgroundColor: accentColor }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-8">
              <section className="dm-detail-section mb-4">
                <h2 className="dm-detail-section-title">
                  <FaProjectDiagram size={18} className="text-info" /> Project Overview
                </h2>
                <div className="dm-detail-card-box">
                  <p className="dm-detail-prose">{overview || shortDescription}</p>
                </div>
              </section>

              {problemStatement && (
                <section className="dm-detail-section mb-4">
                  <h2 className="dm-detail-section-title">
                    <FaTools size={18} className="text-warning" /> Problem Statement
                  </h2>
                  <div className="dm-detail-card-box border-warning-subtle">
                    <p className="dm-detail-prose mb-0">{problemStatement}</p>
                  </div>
                </section>
              )}

              {keyFeatures.length > 0 && (
                <section className="dm-detail-section mb-4">
                  <h2 className="dm-detail-section-title">
                    <FaTools size={18} className="text-success" /> Key Features
                  </h2>
                  <div className="row g-3">
                    {keyFeatures.map((feat, idx) => (
                      <div className="col-md-6" key={idx}>
                        <div className="dm-feature-card h-100">
                          <span className="dm-feature-idx">0{idx + 1}</span>
                          <p className="mb-0 text-light fw-medium">{feat}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {requirements.length > 0 && (
                <section className="dm-detail-section mb-4">
                  <h2 className="dm-detail-section-title">
                    <FaListUl size={18} className="text-info" /> Requirements
                  </h2>
                  <div className="dm-detail-card-box">
                    <ul className="dm-detail-checklist mb-0">
                      {requirements.map((req, i) => (
                        <li key={i}>
                          <FaCheckCircle className="text-primary me-2 flex-shrink-0" size={15} />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {(installationInstructions || documentationDescription) && (
                <section className="dm-detail-section mb-4">
                  <h2 className="dm-detail-section-title">
                    <FaCode size={18} className="text-info" /> Setup & Documentation
                  </h2>
                  <div className="dm-detail-card-box">
                    {installationInstructions && <p className="dm-detail-prose">{installationInstructions}</p>}
                    {documentationDescription && <p className="dm-muted mb-0">{documentationDescription}</p>}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Purchase + Architecture */}
            <div className="col-lg-4">
              {/* Purchase Card */}
              <aside className="dm-detail-aside-card dm-purchase-card mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="dm-muted">Price</span>
                  {hasPrice ? (
                    <span className="dm-price-block">
                      {compareAtPrice && Number(compareAtPrice) > Number(price) && (
                        <span className="dm-price-compare"><PriceDisplay amount={compareAtPrice} /></span>
                      )}
                      <PriceDisplay amount={price} />
                      {discountPercentage > 0 && <span className="dm-discount-badge">{discountPercentage}% off</span>}
                    </span>
                  ) : (
                    <span className="dm-muted small">Price unavailable</span>
                  )}
                </div>
                {hasPrice ? (
                  <>
                    <PrimaryButton className="w-100" onClick={() => buyNow({ type: 'project', id: project._api.id })}>
                      <FaBolt aria-hidden="true" className="me-2" /> Buy Now — {formatInr(price)}
                    </PrimaryButton>
                    <SecondaryButton className="w-100 mt-2" disabled={adding} onClick={handleAddToCart}>
                      {adding ? 'Adding…' : 'Add to cart'}
                    </SecondaryButton>
                  </>
                ) : (
                  <p className="dm-purchase-note mb-0">This project is not currently available for purchase.</p>
                )}
                <p className="dm-purchase-note mt-3">
                  Secure payment via Razorpay. Instant access after verified payment.
                </p>
              </aside>

              {/* Architecture */}
              <aside className="dm-detail-aside-card mb-4">
                <h3 className="h5 text-white mb-3 d-flex align-items-center gap-2">
                  <FaServer className="text-info" /> Architecture
                </h3>
                <p className="dm-muted small mb-0">{architectureDescription || 'Full-stack architecture with REST APIs and a modern frontend.'}</p>
                {liveDemoUrl && (
                  <a className="dm-btn dm-btn--secondary w-100 mt-3" href={liveDemoUrl} rel="noreferrer" target="_blank">
                    Open Live Demo
                  </a>
                )}
              </aside>

              <aside className="dm-detail-aside-card mb-4">
                <h3 className="h5 text-white mb-3 d-flex align-items-center gap-2">
                  <FaCode className="text-primary" /> Technology Stack
                </h3>
                <div className="d-flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span className="dm-modal-tech-badge" key={tech}>{tech}</span>
                  ))}
                </div>
              </aside>

              <div className="dm-card p-4 text-center">
                <h4 className="h6 text-white mb-2">Explore more projects</h4>
                <p className="dm-muted small mb-3">
                  Browse other projects in the {category} category.
                </p>
                <Link className="dm-btn dm-btn--primary w-100" to="/projects">
                  Explore All Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  )
}

export default ProjectDetailsPage
