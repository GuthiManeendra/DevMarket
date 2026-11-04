# DevMarket

DevMarket is a digital marketplace for developer projects and professional portfolio products. This repository currently contains **Phase 1 initialization only**: a Vite/React entry screen and a Django REST-ready backend configuration. Product catalogs, authentication, payments, downloads, customization, and administration are intentionally not implemented yet.

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
│   ├── config/
│   ├── .venv/
│   ├── manage.py
│   └── requirements.txt
├── .env.example
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
python manage.py runserver
```

The backend runs at [http://127.0.0.1:8000](http://127.0.0.1:8000).

If PowerShell script execution blocks activation, use the environment directly:

```powershell
.\.venv\Scripts\python.exe manage.py check
```

## MySQL configuration

1. Open MySQL Workbench and connect to your local MySQL Server.
2. Open a new SQL tab and run `CREATE DATABASE devmarket CHARACTER SET utf8mb4;`.
3. Copy the root `.env.example` to `.env`.
4. Replace the database placeholders with your local MySQL database name, username, password, host, and port.
5. Do not commit `.env`; it is excluded by `.gitignore`.

Phase 1 does not claim database connectivity. A real connection should be tested after MySQL is running and the environment variables contain valid credentials.

## Troubleshooting

- **`npm` is blocked in PowerShell:** use `npm.cmd` instead, for example `npm.cmd install`.
- **Virtual environment activation is blocked:** run the backend with `.\.venv\Scripts\python.exe`, or adjust your user-level PowerShell execution policy.
- **MySQL connection errors:** confirm MySQL Server is running, the credentials are correct, and the database exists.
- **CORS errors:** confirm the frontend URL appears in `CORS_ALLOWED_ORIGINS` and restart Django after changing environment variables.
- **Port already in use:** stop the process using port 5173 or 8000, or start the relevant development server on another port.
