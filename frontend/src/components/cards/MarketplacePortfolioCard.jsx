import { FaBolt, FaDesktop } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import useBuyNow from '../../hooks/useBuyNow'
import useMarketplace from '../../context/useMarketplace'
import { Badge, PriceDisplay } from '../common/Feedback'
import {
  TechnologyBadge,
  WishlistButton,
} from '../common/ProductTools'
import { SecondaryButton } from '../common/Buttons'
import { toast } from '../../utils/toastBus'
import { useFlyingCartAnimation } from '../../hooks/useFlyingCartAnimation'
import { ScrollReveal } from '../animations/ScrollReveal'

function MarketplacePortfolioCard({ item }) {
  const { addToCart, toggleWishlist, wishlist } = useMarketplace()
  const { buyNow } = useBuyNow()
  const { animateFlyToCart } = useFlyingCartAnimation()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const previewRef = useRef(null)

  const inWishlist = wishlist.some(
    (entry) => entry.id === item.id
  )

  const technologies = [
    item.frontend_technology,
    ...(item.frameworks || []),
    ...(item.libraries || []),
    ...(item.animation_technology || []),
  ].filter(Boolean)

  const previews = item.previews || []

  const imagePreview = previews.find(
    (preview) => preview.thumbnail_image
  )

  const liveDemo = previews.find(
    (preview) =>
      preview.preview_type === 'live_demo' &&
      preview.preview_url
  )

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true)

      // Get cart icon element
      const cartIcon = document.querySelector('a[aria-label="Cart"]')
      if (!cartIcon) {
        await addToCart(item)
        return
      }

      // Get the preview image if available
      const imagePreview = previews.find((preview) => preview.thumbnail_image)
      const imageSrc = imagePreview?.thumbnail_image || createPlaceholderImage(item.title)

      // Start animation
      animateFlyToCart(previewRef.current, cartIcon, imageSrc, async () => {
        await addToCart(item)
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast('Failed to add to cart. Please try again.', 'error')
    } finally {
      // Delay state reset to allow animation to complete
      setTimeout(() => {
        setIsAddingToCart(false)
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
    gradient.addColorStop(0, '#34e0a1')
    gradient.addColorStop(1, '#8b7cff')
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

  return (
    <ScrollReveal once={true} distance={20}>
      <motion.article
        className="dm-card dm-market-card h-100"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
      <div className="dm-portfolio-preview__screen dm-market-card__preview" ref={previewRef}>
        {imagePreview ? (
          <img
            src={imagePreview.thumbnail_image}
            alt={`${item.title} portfolio preview`}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <>
            <FaDesktop
              aria-hidden="true"
              className="text-primary"
              size={30}
            />
            <span className="dm-preview-label">
              Preview coming soon
            </span>
          </>
        )}
      </div>

      <div className="dm-card__body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
          <Badge>
            {item.category?.name || item.portfolio_type}
          </Badge>

          <WishlistButton
            active={inWishlist}
            onClick={() => toggleWishlist(item)}
          />
        </div>

        <h2 className="h5">{item.title}</h2>

        <p className="dm-muted small">
          {item.short_description}
        </p>

        <div className="d-flex flex-wrap gap-1 mb-4">
          {technologies.map((technology) => (
            <TechnologyBadge key={technology}>
              {technology}
            </TechnologyBadge>
          ))}
        </div>

        <div className="d-flex align-items-center justify-content-between gap-2 mt-auto">
          <span className="dm-price-block">
            {item.compare_at_price && Number(item.compare_at_price) > Number(item.base_price) && (
              <span className="dm-price-compare"><PriceDisplay amount={item.compare_at_price} /></span>
            )}
            <PriceDisplay amount={item.base_price} />
          </span>

          <div className="d-flex gap-2">
            {liveDemo && (
              <a
                className="dm-btn dm-btn--secondary"
                href={liveDemo.preview_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live demo
              </a>
            )}

            <Link to={`/portfolios/${item.slug}`}>
              <SecondaryButton>
                Details
              </SecondaryButton>
            </Link>

            <button
              className="dm-btn dm-btn--primary"
              onClick={() => buyNow({ type: 'portfolio', id: item.id })}
              type="button"
            >
              <FaBolt aria-hidden="true" className="me-1" /> Buy Now
            </button>
          </div>
        </div>

        <button
          className="dm-btn dm-btn--secondary w-100 mt-2"
          disabled={isAddingToCart}
          onClick={handleAddToCart}
          type="button"
        >
          {isAddingToCart ? 'Adding...' : 'Add to cart'}
        </button>
      </div>
    </motion.article>
    </ScrollReveal>
  )
}

export default MarketplacePortfolioCard