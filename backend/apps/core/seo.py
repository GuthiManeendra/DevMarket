from xml.sax.saxutils import escape

from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone

from apps.portfolios.models import PortfolioTemplate
from apps.portfolios.services import public_portfolio_queryset
from apps.products.models import Project

FRONTEND_ROUTES = [
    ('/', '1.0', 'weekly'),
    ('/projects', '0.9', 'daily'),
    ('/portfolios', '0.9', 'daily'),
    ('/offers', '0.6', 'weekly'),
    ('/about', '0.5', 'monthly'),
    ('/contact', '0.5', 'monthly'),
]

PRIVATE_ROBOTS_DISALLOWED = [
    '/admin/',
    '/api/',
    '/cart',
    '/checkout',
    '/purchases',
    '/login',
    '/register',
]


def _site_url():
    return getattr(settings, 'SITE_URL', 'http://127.0.0.1:5173').rstrip('/')


def _url_entry(loc, lastmod=None, changefreq='weekly', priority='0.5'):
    parts = [f'  <loc>{escape(loc)}</loc>']
    if lastmod:
        parts.append(f'  <lastmod>{lastmod}</lastmod>')
    parts.append(f'  <changefreq>{changefreq}</changefreq>')
    parts.append(f'  <priority>{priority}</priority>')
    return '  <url>\n' + '\n'.join(parts) + '\n  </url>'


def sitemap_xml(request):
    site_url = _site_url()
    today = timezone.now().date().isoformat()

    entries = [
        _url_entry(f'{site_url}{path}', today, changefreq, priority)
        for path, priority, changefreq in FRONTEND_ROUTES
    ]

    projects = Project.objects.filter(
        is_active=True,
        publication_status=Project.PublicationStatus.PUBLISHED,
    ).only('slug', 'updated_at')
    for project in projects:
        entries.append(_url_entry(
            f'{site_url}/projects/{project.slug}',
            project.updated_at.date().isoformat(),
            'weekly',
            '0.8',
        ))

    portfolios = public_portfolio_queryset()
    for portfolio in portfolios:
        entries.append(_url_entry(
            f'{site_url}/portfolios/{portfolio.slug}',
            portfolio.updated_at.date().isoformat(),
            'weekly',
            '0.8',
        ))

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + '\n'.join(entries)
        + '\n</urlset>\n'
    )
    return HttpResponse(xml, content_type='application/xml; charset=utf-8')


def robots_txt(request):
    site_url = _site_url()
    lines = [
        'User-agent: *',
        'Allow: /',
        *[f'Disallow: {path}' for path in PRIVATE_ROBOTS_DISALLOWED],
        '',
        f'Sitemap: {site_url}/sitemap.xml',
        '',
    ]
    return HttpResponse('\n'.join(lines), content_type='text/plain; charset=utf-8')
