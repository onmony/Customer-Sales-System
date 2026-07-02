#!/bin/bash
# Database Migration Script (Linux/macOS)
# This script applies pending migrations

set -e

echo "Applying database migrations..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create .env with DATABASE_URL."
    exit 1
fi

# Apply migrations
echo "Running prisma migrate deploy..."
npx prisma migrate deploy

# Regenerate Prisma client
echo "Regenerating Prisma client..."
npx prisma generate

echo "Migrations applied successfully!"
