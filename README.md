# DevMarket

DevMarket is a digital marketplace for developer projects and professional portfolio products. The repository currently contains the initialized frontend, a professional React marketplace interface, and a Django REST backend foundation. Product catalogs, authentication, payments, downloads, customization, and administration are intentionally not connected yet.

## Technology stack

- Frontend: React, Vite, JavaScript, Bootstrap 5, React Router DOM, Axios, React Icons
- Backend: Python, Django, Django REST Framework, django-cors-headers
- Database preparation: MySQL and MySQL Workbench

## Project structure

```text
DevMarket/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       └── utils/
├── backend/
│   ├── apps/
│   │   ├── core/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── portfolios/
│   │   ├── products/
│   │   └── users/
│   ├── config/
│   ├── .venv/
│   ├── manage.py
│   └── requirements.txt
├── .env.example
├── docs/
│   └── backend-setup.md
└── README.md
```

## Prerequisites

- Node.js and npm
- Python 3.13 (or a compatible supported Python version)
- MySQL Server and MySQL Workbench

## Frontend setup

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Backend setup

From the repository root:

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py check
python manage.py migrate
python manage.py runserver
```

The backend runs at [http://127.0.0.1:8000](http://127.0.0.1:8000).

If PowerShell script execution blocks activation, use the environment directly:

```powershell
.\.venv\Scripts\python.exe manage.py check
```

## MySQL configuration

Follow [docs/backend-setup.md](docs/backend-setup.md). Create the `devmarket_db` database in MySQL Workbench, copy `.env.example` to `.env`, and enter your actual MySQL username and password. The health endpoint at `http://127.0.0.1:8000/api/health/` reports whether Django can actually connect.

## Backend health API

```text
GET http://127.0.0.1:8000/api/health/
```

The endpoint returns `database: "connected"` only after Django successfully opens the configured database connection. It returns HTTP 503 when the database is unavailable.

## Troubleshooting

- **`npm` is blocked in PowerShell:** use `npm.cmd` instead, for example `npm.cmd install`.
- **Virtual environment activation is blocked:** run the backend with `.\.venv\Scripts\python.exe`, or adjust your user-level PowerShell execution policy.
- **MySQL connection errors:** confirm MySQL Server is running, the credentials are correct, and the database exists.
- **CORS errors:** confirm the frontend URL appears in `CORS_ALLOWED_ORIGINS` and restart Django after changing environment variables.
- **Port already in use:** stop the process using port 5173 or 8000, or start the relevant development server on another port.
