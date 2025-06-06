#!/bin/bash
set -e
set -x

echo "Starting deploy script..."
echo "DEPLOY_USER: $DEPLOY_USER"
echo "APP_NAME: $APP_NAME"
echo "PWD at start: $(pwd)"

# Set PATH to include Node.js and PM2
export PATH=$PATH:/usr/local/bin:/home/$DEPLOY_USER/.nvm/versions/node/*/bin

echo "Attempting to cd to /home/$DEPLOY_USER/$APP_NAME"
# Navigate to project directory
cd /home/$DEPLOY_USER/$APP_NAME
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
grep -v '^NEXT_PUBLIC_SUPABASE_URL=' .env | grep -v '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' | grep -v '^NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=' > .env.tmp || true
mv .env.tmp .env
echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" >> .env
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> .env
echo "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=$NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY" >> .env

echo "Restarting or starting PM2 process..."
pm2 restart app || pm2 start npm --name "app" -- run start

echo "Finished deploy script"