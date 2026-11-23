import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaBolt,
  FaLayerGroup,
} from 'react-icons/fa'
import { formatInr } from '../../utils/currency'
import useMarketplace from '../../context/useMarketplace'
import { useFlyingCartAnimation } from '../../hooks/useFlyingCartAnimation'
import { ScrollReveal } from '../animations/ScrollReveal'
import { toast } from '../../utils/toastBus'

function PremiumProjectCard({ project, index, onBuyNow }) {
  const { addToCart } = useMarketplace()
  const { animateFlyToCart } = useFlyingCartAnimation()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const thumbnailRef = useRef(null)
  const {
    id,
    number,
    title,
    name,
    category,
    difficulty = 'Intermediate',
    shortDescription,
    description,
    technologies = [],
    icon: ProjectIcon,
    Icon,
    accentColor = '#34e0a1',
    slug,
    price,
    compareAtPrice,
    discountPercentage = 0,
  } = project

  const hasPrice = price !== null && price !== undefined && price !== ''
  const detailsTo = slug ? `/projects/${slug}` : `/projects/${id}`

  const displayTitle = title || name || 'Project'
  const displayDesc = shortDescription || description || ''
  const ResolvedIcon = ProjectIcon || Icon || FaLayerGroup

  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Moderate tilt angles in degrees
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6

    setTilt({ rotateX, rotateY })
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true)

      // Get cart icon element
      const cartIcon = document.querySelector('a[aria-label="Cart"]')
      if (!cartIcon) {
        await addToCart(project)
        return
      }

      // Create a temporary canvas to render the icon as an image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 80
      canvas.height = 80

      // Draw background
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
      animateFlyToCart(thumbnailRef.current, cartIcon, iconImage, async () => {
        await addToCart(project)
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

  return (
    <ScrollReveal delay={(index % 6) * 0.08} distance={30} once={true}>
      <motion.div
        className="dm-project-card-wrapper"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
      <div
        className="dm-project-card"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        ref={cardRef}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${
            tilt.rotateX || tilt.rotateY ? 1.015 : 1
          }, ${tilt.rotateX || tilt.rotateY ? 1.015 : 1}, 1)`,
        }}
      >
        {/* Specular Glare Layer */}
        <div
          className="dm-card-glare"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 65%)`,
          }}
        />

        {/* Project Thumbnail / Illustration Header */}
        <div className="dm-card-thumbnail" ref={thumbnailRef}>
          <div
            className="dm-thumbnail-glow"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            }}
          />
          <div className="dm-thumbnail-grid-overlay" />
          <div className="dm-thumbnail-content">
            <div
              className="dm-thumbnail-icon-bubble"
              style={{
                borderColor: `${accentColor}55`,
                boxShadow: `0 0 20px ${accentColor}33`,
              }}
            >
              <ResolvedIcon size={26} style={{ color: accentColor }} />
            </div>
          </div>

          {/* Badges on Thumbnail */}
          <div className="dm-thumbnail-badge-row">
            <span className="dm-project-number-badge">
              #{number || (index + 1).toString().padStart(2, '0')}
            </span>
            <span
              className="dm-card-category-pill"
              style={{
                borderColor: `${accentColor}44`,
                background: `${accentColor}18`,
                color: '#e2e8f0',
              }}
            >
              {category}
            </span>
            <span className={`dm-card-difficulty-badge dm-difficulty--${difficulty.toLowerCase()}`}>
              {difficulty}
            </span>
          </div>
        </div>

        <div className="dm-card-inner">
          {/* Project Title */}
          <h3 className="dm-project-name" title={displayTitle}>
            {displayTitle}
          </h3>

          {/* Short Project Description */}
          <p className="dm-project-desc">{displayDesc}</p>

          {/* Technology Stack Tags */}
          <div className="dm-tech-badges-wrap">
            {technologies.slice(0, 5).map((tech) => (
              <span className="dm-tech-pill" key={tech}>
                <span
                  className="dm-tech-pill-dot"
                  style={{ backgroundColor: accentColor }}
                />
                {tech}
              </span>
            ))}
            {technologies.length > 5 && (
              <span className="dm-tech-pill dm-tech-pill--more">
                +{technologies.length - 5}
              </span>
            )}
          </div>

          {/* Price Row (API products only) */}
          {hasPrice && (
            <div className="dm-card-price-row">
              {compareAtPrice && Number(compareAtPrice) > Number(price) && (
                <span className="dm-price-compare">{formatInr(compareAtPrice)}</span>
              )}
              <span className="dm-card-price">{formatInr(price)}</span>
              {discountPercentage > 0 && (
                <span className="dm-discount-badge">{discountPercentage}% off</span>
              )}
            </div>
          )}

          {/* Card Action Row: View Details button */}
          <div className="dm-card-action-row">
            <Link
              className="dm-view-details-btn"
              to={detailsTo}
              title="View full project details"
            >
              View Details <FaArrowRight aria-hidden="true" size={12} />
            </Link>

            {hasPrice && onBuyNow && (
              <button
                className="dm-buy-now-btn"
                onClick={onBuyNow}
                title="Buy this project now"
                type="button"
              >
                <FaBolt aria-hidden="true" size={12} /> Buy Now
              </button>
            )}
          </div>

          {/* Add to Cart Button */}
          {hasPrice && (
            <button
              className="dm-btn dm-btn--secondary w-100 mt-3"
              disabled={isAddingToCart}
              onClick={handleAddToCart}
              type="button"
            >
              {isAddingToCart ? 'Adding...' : 'Add to cart'}
            </button>
          )}
        </div>
      </div>
      </motion.div>
    </ScrollReveal>
  )
}

export default PremiumProjectCard
