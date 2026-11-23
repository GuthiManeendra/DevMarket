export const SITE_NAME = 'Repohaus'
export const SITE_TAGLINE = 'The House of Repositories'
export const DEFAULT_DESCRIPTION =
  'Repohaus is a curated marketplace for production-ready software projects and professional portfolio templates for developers, students, and technology professionals.'

const envSiteUrl = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')
export const SITE_URL = envSiteUrl || (typeof window !== 'undefined' ? window.location.origin : '')

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL || ''
  if (/^https?:\/\//i.test(path)) return path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

export function pageTitle(title) {
  if (!title) return `${SITE_NAME} | ${SITE_TAGLINE}`
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
}

export function metaDescription(text, max = 160) {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.to || '/'),
    })),
  }
}
