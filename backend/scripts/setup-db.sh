#!/bin/bash
# Database Setup Script (Linux/macOS)
# This script sets up a new database from scratch

set -e

echo "Setting up database..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create .env with DATABASE_URL."
    exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Apply migrations
echo "Applying migrations..."
npx prisma migrate deploy

# Seed master data
echo "Seeding master data..."
npx prisma db seed || echo "Warning: Seed failed or not configured."

echo "Database setup complete!"
