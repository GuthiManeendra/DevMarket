# DevMarket Phase 9 cart and checkout engine

## Architecture

`apps.cart` owns guest/user carts, cart items, fee configuration, coupons, and tax rules. `apps.orders` owns immutable order and order-item snapshots. A cart item references exactly one project or portfolio template, and digital quantity is always one.

Guest carts use a random `X-Guest-Token` header. The frontend persists this token locally. Authenticated users use their active Django user cart. `POST /api/cart/merge/` accepts a guest token for future authentication flows and merges its items into the signed-in user's cart.

## Authoritative calculation

The backend recalculates current product prices whenever a cart is read, changed, quoted, or converted to an order:

1. Base product subtotal plus selected portfolio customization prices.
2. Coupon discount.
3. Platform fee: 3% by default, calculated on the discounted subtotal.
4. Convenience fee: 4% by default, calculated on the discounted subtotal.
5. Active administrator-configured taxes.
6. Final total.

All amounts use Python `Decimal`, quantized to INR paise with `ROUND_HALF_UP`. React never supplies authoritative prices or percentages.

Illustrative example: an INR 7,500 AI project produces a ₹225 platform fee, ₹300 convenience fee, and ₹8,025 subtotal before tax. Tax is only added when an active, reviewed tax rule exists.

## Tax configuration

Tax rates and treatment are intentionally not invented. Staff configure tax name, rate, type, category applicability, fee applicability, product-subtotal applicability, inclusive/exclusive treatment, effective date, and active status in Django Admin. If no active tax rule exists, the quote returns `tax_configuration_incomplete: true` and applies no tax.

## APIs

- `GET /api/cart/`
- `POST /api/cart/items/`
- `PATCH /api/cart/items/{id}/`
- `DELETE /api/cart/items/{id}/`
- `DELETE /api/cart/clear/`
- `POST /api/cart/merge/`
- `POST /api/coupons/validate/`
- `POST /api/checkout/quote/`
- `POST /api/checkout/create-order/`

Use `X-Guest-Token` for guest requests. Use `Idempotency-Key` when creating an order. Order creation returns a pending-payment order and never marks it paid.

## Coupons

Coupons support percentage/fixed discounts, minimum totals, maximum discounts, dates, usage limits, product types, and categories. Validation never increments usage. Coupon stacking is not supported. Coupon and product prices are recalculated server-side.

## Order snapshots

Orders preserve subtotal, discount, discounted subtotal, fee percentages, fees, tax snapshots, coupon code, currency, product title/slug, base price, customization data, and line totals. Future fee or product changes do not recalculate existing orders.

## Admin

Staff manage fee configurations, coupons, and tax rules in Django Admin. Orders and order items are inspectable; order snapshots are protected from ordinary editing and deletion. Payment verification, Razorpay, refunds, downloads, and entitlements are intentionally excluded from Phase 9.
