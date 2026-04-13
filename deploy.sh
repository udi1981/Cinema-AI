#!/bin/bash
# Auto-deploy to Cloudflare Pages
# Usage: bash deploy.sh

set -e

echo "Building..."
npx vite build

echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=ai-movie-creator

echo "Done! Site is live."
