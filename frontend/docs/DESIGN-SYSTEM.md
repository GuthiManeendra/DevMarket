# DevMarket design system

## Color palette

| Token | Value | Use |
| --- | --- | --- |
| `--dm-navy-950` | `#080D1B` | Brand mark and premium background |
| `--dm-navy-900` | `#0D1428` | Dark surface and navigation |
| `--dm-surface` | `#111A30` | Dark cards |
| `--dm-blue` | `#3B82F6` | Primary action and links |
| `--dm-violet` | `#8B5CF6` | Gradient partner and premium accent |
| `--dm-cyan` | `#22D3EE` | Focused accent and data highlights |
| `--dm-light` | `#F5F7FC` | Public light background |
| `--dm-border` | `#27334D` | Dark-theme borders and form outlines |
| `--dm-muted` | `#94A3B8` | Secondary text on dark surfaces |

Tokens live in `src/styles/variables.css`. Use the variables instead of hard-coded colors in components.

## Typography

Inter is used for interface and body text. Space Grotesk is used for headings and the wordmark. The scale favors large, compact headings, readable 16px body copy, and 14px navigation labels. Use 700–800 weights for headings and 600–700 for actions.

## Spacing and shape

The system uses Bootstrap’s responsive grid and spacing utilities alongside a small token set: 8px-ish control rhythm, `0.5rem` small radius, `0.875rem` card radius, and `1.25rem` feature radius. Use `--dm-shadow-sm` for cards and reserve `--dm-shadow-lg` for hero or modal surfaces.

## Components

- **Navigation:** `MainNavbar` provides sticky desktop navigation, responsive collapse, active links, search, wishlist, cart, and account entry points.
- **Common:** `BrandLogo`, `PrimaryButton`, `SecondaryButton`, `Badge`, `SectionHeading`, `LoadingSpinner`, `EmptyState`, `PriceDisplay`, and `RatingDisplay`.
- **Cards:** `ProjectCard`, `PortfolioCard`, and `CategoryCard` provide consistent media, metadata, actions, and responsive sizing.
- **Forms:** `TextInput`, `PasswordInput`, `SearchInput`, and `SelectInput` generate usable labels and visible focus states.
- **Layout:** `SiteShell` keeps navigation and footer consistent without adding page-specific business behavior.

## Motion and accessibility

Use CSS transitions for ordinary feedback. Framer Motion, GSAP, and Three.js can be introduced in later phases only where the interaction needs them. Respect `prefers-reduced-motion`, avoid motion-only meaning, keep keyboard focus visible, and provide alt text when real product imagery is added.
