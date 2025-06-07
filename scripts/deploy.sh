#!/bin/bash
set -e
set -x

echo "Starting deploy script..."
echo "DEPLOY_USER: $DEPLOY_USER"
echo "APP_NAME: $APP_NAME"
echo "PWD at start: $(pwd)"

# Set PATH to include Node.js and PM2
export PATH=$PATH:/usr/local/bin:/home/$DEPLOY_USER/.nvm/versions/node/*/bin

# Ensure project directory exists and is a git repo
if [ ! -d "/mnt/data/$APP_NAME/.git" ]; then
  echo "/mnt/data/$APP_NAME does not exist or is not a git repo. Cloning from GIT_REPO_URL..."
  if [ -z "$GIT_REPO_URL" ]; then
    echo "Error: GIT_REPO_URL environment variable is not set. Cannot clone repo."
    exit 1
  fi
  git clone "$GIT_REPO_URL" "/mnt/data/$APP_NAME"
else
  echo "/mnt/data/$APP_NAME exists and is a git repo."
fi

# Navigate to project directory
echo "Attempting to cd to /mnt/data/$APP_NAME"
cd /mnt/data/$APP_NAME
echo "In project directory: $(pwd)"

# Pull latest changes
echo "Running git pull..."
git pull origin main

# Install dependencies
echo "Running npm install..."
npm install

# Build the application
echo "Running npm run build..."
npm run build

# Write/update .env file (preserves other variables if present)
echo "Updating .env file..."
touch .env
set +e
grep -v '^NEXT_PUBLIC_SUPABASE_URL=' .env | \
grep -v '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' | \
grep -v '^NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=' | \
grep -v '^POSTGRES_PASSWORD=' | \
grep -v '^SUPABASE_SERVICE_KEY=' | \
grep -v '^PGRST_JWT_SECRET=' | \
grep -v '^JWT_SECRET=' > .env.tmp
set -e
mv .env.tmp .env
echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" >> .env
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> .env
echo "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=$NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY" >> .env
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
echo "SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY" >> .env
echo "PGRST_JWT_SECRET=$PGRST_JWT_SECRET" >> .env
echo "JWT_SECRET=$JWT_SECRET" >> .env

echo "Restarting or starting PM2 process..."
pm2 restart app || pm2 start npm --name "app" -- run start

echo "Finished deploy script"