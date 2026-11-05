# DevMarket backend setup

## 1. Create and activate the virtual environment

From the repository root:

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use the environment directly:

```powershell
.\.venv\Scripts\python.exe manage.py check
```

## 2. Install dependencies

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## 3. Create the MySQL database

Open MySQL Workbench, connect to your local MySQL Server, and run:

```sql
CREATE DATABASE devmarket_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

The database name is fixed by the example configuration. You must enter your own MySQL username and password in the root `.env` file.

## 4. Configure environment variables

Copy the example file from the repository root:

```powershell
Copy-Item ..\.env.example ..\.env
```

Edit `..\.env` and replace:

```dotenv
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
```

The remaining MySQL values are:

```dotenv
DB_ENGINE=django.db.backends.mysql
DB_NAME=devmarket_db
DB_HOST=127.0.0.1
DB_PORT=3306
```

The repository does not include `.env`. Never commit real credentials.

When `.env` is absent, the backend safely uses the existing local SQLite fallback so system checks and frontend work can be exercised before MySQL is configured. This fallback does not verify MySQL connectivity.

## 5. Run checks and migrations

With valid MySQL credentials configured:

```powershell
python manage.py check
python manage.py migrate
```

Phase 5 has no business models. The migration command applies Django's built-in tables only.

## 6. Start Django

```powershell
python manage.py runserver 127.0.0.1:8000
```

Test the health endpoint:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/api/health/
```

With a working database connection, the JSON response is:

```json
{
  "status": "success",
  "message": "DevMarket API is running",
  "database": "connected"
}
```

If the database cannot be reached, the endpoint returns HTTP 503 with `status: "error"` and `database: "disconnected"`. It never reports a successful database connection without calling Django's real connection check.

## Common errors

- **Access denied:** verify `DB_USER` and `DB_PASSWORD` in `.env`.
- **Unknown database:** create `devmarket_db` in MySQL Workbench.
- **Can't connect to MySQL server:** start MySQL Server and confirm `DB_HOST` and `DB_PORT`.
- **CORS error:** ensure the frontend origin is included in `CORS_ALLOWED_ORIGINS`, then restart Django.
- **PowerShell activation error:** run `.\.venv\Scripts\python.exe` directly or adjust the user execution policy.
