import { useEffect } from 'react'
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  metaDescription,
  pageTitle,
} from '../../utils/seo'

const MANAGED_ATTR = 'data-seo-managed'

function upsertMeta({ attr, key, content }) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(MANAGED_ATTR, 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr, key) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    el.setAttribute(MANAGED_ATTR, 'true')
    document.head.appendChild(el)
  }
  el.href = href
}

function renderJsonLd(jsonLd) {
  let el = document.getElementById('seo-jsonld')
  const blocks = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : []
  if (!blocks.length) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'seo-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(blocks.length === 1 ? blocks[0] : blocks)
}

/**
 * Renders page-level SEO metadata: title, description, canonical URL,
 * Open Graph / Twitter cards, robots directives and JSON-LD structured data.
 *
 * @param {object} props
 * @param {string} [props.title]      Page title (site name is appended).
 * @param {string} [props.description] Meta description (defaults to site description).
 * @param {string} [props.path]       Canonical path (defaults to current pathname).
 * @param {string} [props.image]      Absolute or root-relative OG image URL.
 * @param {'website'|'article'|'product'} [props.type]
 * @param {boolean} [props.noindex]   Emit noindex,nofollow and omit canonical.
 * @param {object|object[]} [props.jsonLd] JSON-LD schema object(s).
 * @param {string} [props.keywords]   Optional meta keywords.
 */
function SEO({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
  keywords,
}) {
  useEffect(() => {
    const canonicalPath = path ?? window.location.pathname
    const canonicalUrl = absoluteUrl(canonicalPath)
    const desc = metaDescription(description || DEFAULT_DESCRIPTION)
    const fullTitle = title ? pageTitle(title) : `${SITE_NAME} | Discover. Create. Innovate.`
    const ogImage = image ? absoluteUrl(image) : undefined

    document.title = fullTitle

    upsertMeta({ attr: 'name', key: 'description', content: desc })
    upsertMeta({ attr: 'name', key: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' })
    if (keywords) upsertMeta({ attr: 'name', key: 'keywords', content: keywords })
    else removeMeta('name', 'keywords')

    // Open Graph
    upsertMeta({ attr: 'property', key: 'og:type', content: type })
    upsertMeta({ attr: 'property', key: 'og:site_name', content: SITE_NAME })
    upsertMeta({ attr: 'property', key: 'og:title', content: fullTitle })
    upsertMeta({ attr: 'property', key: 'og:description', content: desc })
    upsertMeta({ attr: 'property', key: 'og:url', content: canonicalUrl })
    if (ogImage) upsertMeta({ attr: 'property', key: 'og:image', content: ogImage })

    // Twitter Card
    upsertMeta({ attr: 'name', key: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' })
    upsertMeta({ attr: 'name', key: 'twitter:title', content: fullTitle })
    upsertMeta({ attr: 'name', key: 'twitter:description', content: desc })
    if (ogImage) upsertMeta({ attr: 'name', key: 'twitter:image', content: ogImage })

    if (noindex) {
      document.head.querySelector('link[rel="canonical"]')?.remove()
    } else {
      upsertCanonical(canonicalUrl)
    }

    renderJsonLd(jsonLd)

    return () => {
      // Tags are re-managed by the next page's SEO component; remove JSON-LD
      // so stale schema never leaks into the next page while loading.
      document.getElementById('seo-jsonld')?.remove()
    }
  }, [title, description, path, image, type, noindex, jsonLd, keywords])

  return null
}

export default SEO
