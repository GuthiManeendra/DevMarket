# DevMarket project marketplace API

Phase 6 provides the project catalog foundation only. It does not implement accounts, checkout, payments, downloads, or purchase entitlements.

## Models

- `ProjectCategory`: active taxonomy with a unique name and slug.
- `Project`: published project metadata, structured technology fields, Decimal prices, flags, and publication state.
- `ProjectImage`: project screenshots and previews stored separately from project metadata. Uploads are limited to JPG, JPEG, PNG, and WEBP files up to 5 MB.

Project source files are not modeled or exposed by this API.

## Endpoints

All endpoints are under `/api/projects/`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/categories/` | List active categories |
| GET | `/categories/{slug}/` | Read one active category |
| GET | `/` | List published active projects |
| GET | `/{slug}/` | Read one published active project |
| GET | `/featured/` | List published featured projects |
| GET | `/popular/` | List published bestseller projects |
| GET | `/latest/` | List newest published projects |

List responses use DRF page-number pagination:

```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

## Filtering and sorting

Project list endpoints support:

- `category=python-projects`
- `project_type=academic`
- `difficulty_level=beginner`
- `min_price=7500`
- `max_price=15000`
- `programming_language=Python`
- `technology=Django`
- `featured=true`
- `search=machine learning`
- `ordering=price`, `ordering=-price`, `ordering=-created_at`, or `ordering=title`
- `page=2`

Only staff users may create, update, or delete projects through the API. Public requests are read-only and can see only active projects with `publication_status=published`.

## AI minimum price rule

Projects in these category slugs must have a price of at least ₹7,500.00:

`artificial-intelligence`, `machine-learning`, `deep-learning`, `generative-ai`, `large-language-models-llm`, `natural-language-processing`, `computer-vision`, `ai-chatbot`, and `agentic-ai`.

The rule is enforced by model validation and serializer validation, so it applies to API writes, admin forms, category changes, and direct model saves. The backend is authoritative.

## Admin usage

1. Create a staff user with `python manage.py createsuperuser`.
2. Open `/admin/`.
3. Create or edit categories.
4. Create a project and add its structured fields.
5. Add screenshots through the inline image form.
6. Select `Published` and `Active` only after the project is ready for public visibility.

To create the initial taxonomy safely:

```powershell
python manage.py seed_project_categories
```

The command uses `get_or_create` and does not duplicate existing category names.

## Testing

```powershell
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py test apps.products
```
