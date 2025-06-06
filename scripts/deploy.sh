#!/bin/bash
set -e
set -x

echo

# Set PATH to include Node.js and PM2
export PATH=$PATH:/usr/local/bin:/home/$DEPLOY_USER/.nvm/versions/node/*/bin

# Navigate to project directory
cd /home/$DEPLOY_USER/$APP_NAME

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build

# Write/update .env file (preserves other variables if present)
touch .env
grep -v '^NEXT_PUBLIC_SUPABASE_URL=' .env | grep -v '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' | grep -v '^NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=' > .env.tmp
mv .env.tmp .env
echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" >> .env
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> .env
echo "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=$NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY" >> .env

# Restart or start PM2 process
pm2 restart app || pm2 start npm --name "app" -- run start