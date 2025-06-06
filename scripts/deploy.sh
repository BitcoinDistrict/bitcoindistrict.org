#!/bin/bash
cd /home/deploy/bitcoin-district
git pull origin main
npm install
npm run build
pm2 restart bitcoin-district --update-env