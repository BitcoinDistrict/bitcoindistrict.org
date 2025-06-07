#!/bin/bash
set -e

ENV_PATH="$(dirname "$0")/../.env"

if [ -f "$ENV_PATH" ]; then
  echo "Warning: $ENV_PATH already exists."
  read -p "Overwrite? (y/N): " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborting."
    exit 1
  fi
fi

echo "Generating .env file for Supabase Docker Compose..."

read -sp "Enter POSTGRES_PASSWORD: " POSTGRES_PASSWORD; echo
read -sp "Enter SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY; echo
read -sp "Enter SUPABASE_SERVICE_KEY: " SUPABASE_SERVICE_KEY; echo
read -sp "Enter PGRST_JWT_SECRET: " PGRST_JWT_SECRET; echo
read -sp "Enter JWT_SECRET: " JWT_SECRET; echo

echo "Writing secrets to $ENV_PATH..."
cat > "$ENV_PATH" <<EOF
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
PGRST_JWT_SECRET=$PGRST_JWT_SECRET
JWT_SECRET=$JWT_SECRET
EOF

echo ".env file created at $ENV_PATH." 