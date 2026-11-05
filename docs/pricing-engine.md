# DevMarket pricing engine

## AI minimum rule

Projects in these categories must have a base price of at least INR 7,500:

Artificial Intelligence, Machine Learning, Deep Learning, Generative AI, Large Language Models (LLM), Natural Language Processing, Computer Vision, AI Chatbot, and Agentic AI.

The backend uses `Decimal` values and applies this rule during model validation, project API writes, publication, admin saves, and pricing validation. The INR 7,500 floor is absolute; configuration may only increase it.

## Configuration and admin controls

Staff can edit the active configuration at **Django Admin > Pricing > Pricing configurations** or through the staff-only configuration update endpoint. Only one active configuration is allowed. Existing projects below a newly configured minimum are not silently changed; they remain invalid and cannot be published or sold.

Price history is read-only in admin and records each changed base price, the staff user, timestamp, and optional reason. Unchanged prices do not create history entries.

## API

- `GET /api/pricing/configuration/` — public active configuration, with a safe INR 7,500 fallback.
- `GET /api/pricing/ai-minimum/` — public current minimum.
- `POST /api/pricing/validate/` — validate `{ "category_slug": "artificial-intelligence", "price": "7500.00" }`.
- `POST /api/pricing/configuration/update/` — staff-only configuration update.
- `GET /api/pricing/projects/<project_id>/history/` — staff-only audit history.

Successful validation returns the minimum, submitted price, currency, and `Price is valid.`. Invalid requests return field-level DRF validation errors.

## Future checkout compatibility

The project `price` remains the base price only. Cart, checkout, platform fees, convenience fees, coupons, taxes, and Razorpay orders are intentionally outside Phase 7. A future order flow should calculate additional charges server-side and snapshot the base price and charges on the order.
