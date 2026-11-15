import { useRef, useCallback } from 'react'

/**
 * Custom hook for flying add-to-cart animation
 * Creates a smooth animation of a product image flying to the cart icon
 */
export function useFlyingCartAnimation() {
  const animationIdRef = useRef(0)

  /**
   * Animates an element flying from start position to end position
   * @param {HTMLElement} startElement - The element to animate from (product image)
   * @param {HTMLElement} targetElement - The cart icon element
   * @param {string} imageSrc - The image source to clone
   * @param {Function} onComplete - Callback when animation completes
   */
  const animateFlyToCart = useCallback((startElement, targetElement, imageSrc, onComplete) => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      if (onComplete) onComplete()
      return
    }

    if (!startElement || !targetElement) {
      if (onComplete) onComplete()
      return
    }

    const currentAnimationId = ++animationIdRef.current

    // Get positions
    const startRect = startElement.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()

    // Calculate start and end positions
    const startX = startRect.left + startRect.width / 2
    const startY = startRect.top + startRect.height / 2
    const endX = targetRect.left + targetRect.width / 2
    const endY = targetRect.top + targetRect.height / 2

    // Create flying element
    const flyingElement = document.createElement('div')
    flyingElement.style.cssText = `
      position: fixed;
      top: ${startY}px;
      left: ${startX}px;
      width: ${startRect.width}px;
      height: ${startRect.height}px;
      pointer-events: none;
      z-index: 9999;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `

    // Add image to flying element
    const img = document.createElement('img')
    img.src = imageSrc
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `
    flyingElement.appendChild(img)

    document.body.appendChild(flyingElement)

    // Animation parameters
    const duration = 750 // 750ms for smooth animation
    const startTime = performance.now()

    // Bounce animation function for cart icon
    const animateCartBounce = () => {
      if (currentAnimationId !== animationIdRef.current) return

      targetElement.style.transition = 'transform 0.15s ease-out'
      targetElement.style.transform = 'scale(1.3)'

      setTimeout(() => {
        if (currentAnimationId !== animationIdRef.current) return
        targetElement.style.transform = 'scale(1)'
      }, 150)

      setTimeout(() => {
        if (currentAnimationId !== animationIdRef.current) return
        targetElement.style.transform = 'scale(1.15)'
      }, 300)

      setTimeout(() => {
        if (currentAnimationId !== animationIdRef.current) return
        targetElement.style.transform = 'scale(1)'
        targetElement.style.transition = ''
      }, 450)
    }

    // Animate badge scale
    const animateBadgeScale = () => {
      const badge = targetElement.querySelector('.dm-cart-badge')
      if (badge && currentAnimationId === animationIdRef.current) {
        badge.style.transition = 'transform 0.2s ease-out'
        badge.style.transform = 'scale(1.5)'

        setTimeout(() => {
          if (currentAnimationId !== animationIdRef.current) return
          badge.style.transform = 'scale(1)'
          badge.style.transition = ''
        }, 200)
      }
    }

    // Main animation loop
    const animate = (currentTime) => {
      if (currentAnimationId !== animationIdRef.current) {
        // Animation was cancelled, clean up
        flyingElement.remove()
        return
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      // Calculate current position
      const currentX = startX + (endX - startX) * easeOut
      const currentY = startY + (endY - startY) * easeOut

      // Calculate scale (shrink as it approaches target)
      const scale = 1 - (progress * 0.6) // Shrink to 40% of original size
      const opacity = 1 - (progress * 0.3) // Fade to 70% opacity

      // Apply transforms
      flyingElement.style.transform = `translate(${currentX - startX}px, ${currentY - startY}px) scale(${scale})`
      flyingElement.style.opacity = opacity

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Animation complete
        flyingElement.remove()
        animateCartBounce()
        animateBadgeScale()
        if (onComplete) onComplete()
      }
    }

    requestAnimationFrame(animate)
  }, [])

  return { animateFlyToCart }
}
