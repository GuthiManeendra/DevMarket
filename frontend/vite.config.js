import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const API_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'

// Emits a static robots.txt at build time so the deployed SPA always serves
// crawl directives even if /robots.txt is not proxied to Django. The Sitemap
// URL is absolute, built from VITE_SITE_URL (the public frontend origin).
function robotsTxtPlugin(env) {
  return {
    name: 'devmarket-robots-txt',
    apply: 'build',
    generateBundle() {
      const siteUrl = (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/+$/, '')
      const source = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        'Disallow: /cart',
        'Disallow: /checkout',
        'Disallow: /purchases',
        'Disallow: /login',
        'Disallow: /register',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
        '',
      ].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), robotsTxtPlugin(env)],
    server: {
      proxy: {
        // Serve Django's dynamic sitemap.xml / robots.txt on the frontend
        // origin during development (mirrors the production proxy rules).
        '/sitemap.xml': API_TARGET,
        '/robots.txt': API_TARGET,
      },
    },
  }
})
