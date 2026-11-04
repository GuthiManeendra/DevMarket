# DevMarket page layout specifications

These are design specifications for future phases. No marketplace data, API calls, authentication, payment flow, or admin behavior is implemented in Phase 2.

| Page | Layout direction |
| --- | --- |
| Home | Sticky navigation, value proposition hero, category entry points, featured sections, trust signals, and footer. |
| Explore Projects | Filter/search toolbar, responsive project grid, pagination, and an empty/loading state. |
| Project Details | Breadcrumbs, preview gallery, title and technology metadata, price/action panel, description, support information, and related work. |
| Portfolio Store | Collection header, standard/premium filters, portfolio card grid, and curated collection callouts. |
| Portfolio Details | Large preview, live-demo action, technology list, creator/product information, price panel, and related portfolios. |
| Offers | Offer header, clearly dated promotion cards, eligibility copy, and terms link. |
| About Us | Brand story, principles, team or creator ecosystem, and support promise. |
| Contact | Short contact form, support categories, response expectations, and accessible contact details. |
| Login / Register | Centered, narrow form surface with labels, validation messages, password help, and a low-friction switch between flows. |
| Cart | Item list, quantity/price summary, remove controls, trust note, and checkout action. |
| Checkout | Progress indicator, customer/payment sections, order summary, and clear success/error states. |
| Customer Dashboard | Account navigation, orders/downloads, saved items, support requests, and profile settings. |
| Admin Dashboard | Protected information architecture only: overview, catalog, orders, users, offers, and support. Functionality is out of scope for Phase 2. |

All pages should use the same `SiteShell`, container width, card radius, focus treatment, and responsive grid. On mobile, controls stack before content, touch targets remain at least 44px, and no section depends on horizontal scrolling.
