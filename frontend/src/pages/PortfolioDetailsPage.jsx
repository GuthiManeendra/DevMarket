import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import useMarketplace from '../context/useMarketplace'
import { fetchPortfolio } from '../services/projectService'
import { Badge, EmptyState, PriceDisplay } from '../components/common/Feedback'
import { Breadcrumb } from '../components/common/PageHeader'
import { TechnologyBadge } from '../components/common/ProductTools'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'
import useBuyNow from '../hooks/useBuyNow'
import { useFlyingCartAnimation } from '../hooks/useFlyingCartAnimation'
import SiteShell from '../layouts/SiteShell'
import SEO from '../components/seo/SEO'
import { absoluteUrl, breadcrumbJsonLd } from '../utils/seo'
import { trackEvent } from '../utils/analytics'

function PortfolioDetailsPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const { addToCart } = useMarketplace()
  const { buyNow } = useBuyNow()
  const { animateFlyToCart } = useFlyingCartAnimation()
  const previewRef = useRef(null)

  useEffect(() => {
    fetchPortfolio(id).then(setItem).catch(() => setError('This portfolio is unavailable or has not been published.'))
  }, [id])

  const seoData = useMemo(() => {
    if (!item) return null
    const canonicalPath = `/portfolios/${item.slug || id}`
    const previewImage = item.previews?.find((preview) => preview.thumbnail_image)?.thumbnail_image
    const hasPrice = item.base_price !== null && item.base_price !== undefined && item.base_price !== ''

    const productLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: item.title,
      description: item.short_description || item.full_description || '',
      sku: String(item.id),
      category: item.category?.name || item.portfolio_type,
      url: absoluteUrl(canonicalPath),
      ...(previewImage ? { image: previewImage } : {}),
      ...(hasPrice
        ? {
            offers: {
              '@type': 'Offer',
              url: absoluteUrl(canonicalPath),
              priceCurrency: item.currency || 'INR',
              price: Number(item.base_price),
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
    }

    const crumbs = breadcrumbJsonLd([
      { label: 'Home', to: '/' },
      { label: 'Portfolio store', to: '/portfolios' },
      { label: item.title, to: canonicalPath },
    ])

    return {
      title: item.seo_title || `${item.title} — Portfolio Template`,
      description: item.seo_description || item.short_description || item.full_description,
      image: previewImage,
      jsonLd: [productLd, crumbs],
    }
  }, [item, id])

  useEffect(() => {
    if (!item) return
    trackEvent('view_item', {
      currency: item.currency || 'INR',
      value: item.base_price != null ? Number(item.base_price) : undefined,
      items: [
        {
          item_id: String(item.id),
          item_name: item.title,
          item_category: item.category?.name || item.portfolio_type,
          price: item.base_price != null ? Number(item.base_price) : undefined,
        },
      ],
    })
  }, [item])

  const handleAddToCart = async () => {
    if (!item) return
    setAdding(true)

    try {
      // Get cart icon element
      const cartIcon = document.querySelector('a[aria-label="Cart"]')
      if (!cartIcon) {
        await addToCart(item)
        return
      }

      // Get the preview image if available
      const imagePreview = item.previews?.find((preview) => preview.thumbnail_image)
      const imageSrc = imagePreview?.thumbnail_image || createPlaceholderImage(item.title)

      // Start animation
      animateFlyToCart(previewRef.current, cartIcon, imageSrc, async () => {
        await addToCart(item)
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

  // Create a placeholder image if no preview exists
  const createPlaceholderImage = (title) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 100
    canvas.height = 100

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 100, 100)
    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(1, '#8b5cf6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 100, 100)

    // Draw icon
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🎨', 50, 50)

    return canvas.toDataURL()
  }

  if (error) return <SiteShell><SEO noindex title="Portfolio unavailable" /><main className="dm-section"><div className="dm-container"><EmptyState description={error} title="Portfolio unavailable" /></div></main></SiteShell>
  if (!item) return <SiteShell><SEO noindex title="Loading portfolio" /><main className="dm-section"><div className="dm-container"><EmptyState description="Loading the published portfolio details." title="Loading portfolio" /></div></main></SiteShell>
  const technologies = [item.frontend_technology, item.backend_technology, ...(item.programming_languages || []), ...(item.frameworks || []), ...(item.libraries || []), ...(item.animation_technology || [])].filter(Boolean)
  const screenshots = item.previews?.filter((preview) => ['screenshot', 'image_gallery'].includes(preview.preview_type)) || []
  return (
    <SiteShell>
      {seoData && (
        <SEO
          description={seoData.description}
          image={seoData.image}
          jsonLd={seoData.jsonLd}
          path={`/portfolios/${item.slug || id}`}
          title={seoData.title}
          type="product"
        />
      )}
      <main className="dm-section pt-4">
        <div className="dm-container">
          <Breadcrumb items={[{ label: 'Portfolio store', to: '/portfolios' }, { label: item.title }]} />
          <div className="row g-5 mt-1 align-items-start">
            <div className="col-lg-7">
              <div className="dm-gallery-main" ref={previewRef}><span className="dm-preview-label">Protected portfolio preview</span>{item.previews?.find((preview) => preview.preview_type === 'live_demo')?.preview_url ? <a className="dm-btn dm-btn--primary" href={item.previews.find((preview) => preview.preview_type === 'live_demo').preview_url} rel="noreferrer" target="_blank">Open live demo</a> : <span className="dm-gallery-main__word">Portfolio</span>}</div>
              {screenshots.length > 0 && <div className="row g-3 mt-1">{screenshots.map((preview) => <div className="col-4" key={preview.id}>{preview.thumbnail_image ? <img alt={preview.description || item.title} className="img-fluid rounded" src={preview.thumbnail_image} /> : <div className="dm-gallery-thumb" />}</div>)}</div>}
            </div>
            <div className="col-lg-5">
              <Badge>{item.category?.name || item.portfolio_type}</Badge>
              <h1 className="mt-3">{item.title}</h1>
              <p className="lead dm-muted">{item.full_description}</p>
              <div className="d-flex flex-wrap gap-2 mb-4">{technologies.map((technology) => <TechnologyBadge key={technology}>{technology}</TechnologyBadge>)}</div>
              <div className="dm-purchase-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="dm-muted">Base price</span>
                  <span className="dm-price-block">
                    {item.compare_at_price && Number(item.compare_at_price) > Number(item.base_price) && (
                      <span className="dm-price-compare"><PriceDisplay amount={item.compare_at_price} /></span>
                    )}
                    <PriceDisplay amount={item.base_price} />
                  </span>
                </div>
                <PrimaryButton className="w-100" onClick={() => buyNow({ type: 'portfolio', id: item.id })}>Buy Now</PrimaryButton>
                <SecondaryButton className="w-100 mt-2" disabled={adding} onClick={handleAddToCart}>{adding ? 'Adding…' : 'Add to cart'}</SecondaryButton>
                <p className="dm-purchase-note mt-3">Additional customization services are listed separately from the base price.</p>
              </div>
            </div>
          </div>
          <section className="dm-detail-content mt-5"><h2>Template details</h2><div className="row g-4"><div className="col-md-6"><h3 className="h5">Features</h3><ul>{(item.features || []).map((feature) => <li key={feature}>{feature}</li>)}</ul><h3 className="h5 mt-4">Included sections</h3><ul>{(item.included_sections || []).map((section) => <li key={section}>{section}</li>)}</ul></div><div className="col-md-6"><p><strong>Responsive:</strong> {item.responsive_support ? 'Yes' : 'No'}</p><p><strong>Dark mode:</strong> {item.dark_mode_support ? 'Yes' : 'No'}</p><p><strong>SEO support:</strong> {item.seo_support ? 'Yes' : 'No'}</p><p><strong>Documentation:</strong> {item.documentation_included ? 'Included' : 'Not included'}</p><h3 className="h5 mt-4">Customization options</h3>{item.customization_options?.length ? <ul>{item.customization_options.map((option) => <li key={option.id}>{option.option_name} — <PriceDisplay amount={option.additional_price} /></li>)}</ul> : <p className="dm-muted">No customization services are currently available.</p>}</div></div></section>
        </div>
      </main>
    </SiteShell>
  )
}

export default PortfolioDetailsPage
