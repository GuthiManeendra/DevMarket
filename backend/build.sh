#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Seed catalog data only when explicitly requested. Running loaddata on
# every deploy overwrites admin-managed records that share primary keys.
# Set SEED_INITIAL_DATA=true in the environment for first-time bootstrap.
if [ "${SEED_INITIAL_DATA:-false}" = "true" ]; then
  python manage.py loaddata initial_data.json
fi
