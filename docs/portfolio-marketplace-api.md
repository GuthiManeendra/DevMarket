# Portfolio marketplace API

## Architecture

Portfolio products are separate from B.Tech projects in `apps.portfolios`. The domain contains `PortfolioCategory`, `PortfolioTemplate`, `PortfolioPreview`, and `PortfolioCustomizationOption`. Template `base_price` is a Decimal base price in INR by default; future platform fees, taxes, and checkout charges are deliberately excluded.

## Portfolio types

- `standard` — standard professional developer portfolios.
- `premium_animated` — animated and interactive portfolios.

Categories carry a portfolio type, and every template must match its category. Animation metadata is stored per template in `animation_technology`; premium templates are not assumed to contain any particular library.

## Public endpoints

- `GET /api/portfolios/categories/`
- `GET /api/portfolios/categories/{slug}/`
- `GET /api/portfolios/`
- `GET /api/portfolios/{slug}/`
- `GET /api/portfolios/featured/`
- `GET /api/portfolios/latest/`
- `GET /api/portfolios/standard/`
- `GET /api/portfolios/premium/`
- `GET /api/portfolios/{slug}/customization-options/`
- `GET /api/portfolios/{slug}/previews/`

Public responses contain only active, published templates and active preview metadata. They never contain source-code files or private storage paths.

## Filtering and sorting

Portfolio listing supports `search`, `category`, `portfolio_type`, `min_price`, `max_price`, `technology`, `framework`, `animation_technology`, `featured`, `responsive`, and `dark_mode`. Use `ordering=base_price`, `ordering=-base_price`, `ordering=created_at`, or `ordering=-created_at`. Results use the configured DRF pagination.

Example:

```text
/api/portfolios/?portfolio_type=premium_animated&technology=GSAP&ordering=-base_price
```

## Previews and customization

Admins add live demo URLs, video URLs, screenshots, and image galleries through inline admin forms. A preview must contain a URL or image. Preview endpoints expose only public preview metadata and thumbnails. They do not provide downloadable source files.

Customization options have an option type, availability flag, required flag, and Decimal `additional_price`. They are informational and reusable for future checkout; no order or payment is created in Phase 8.

## Admin usage

Create a category first and choose `Standard Professional` or `Premium Animated`. Create a matching template, set its individual base price and metadata, then add previews and customization options using the inline sections. Set `publication_status` to `Published` only after required information is complete. Public users cannot create, edit, publish, or delete templates.

## Pricing rules

Portfolio prices may be any non-negative Decimal amount configured per template. The Phase 7 INR 7,500 AI minimum applies only to AI-related B.Tech project categories and is not applied to portfolios.
