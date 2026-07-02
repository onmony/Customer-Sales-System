#!/bin/bash
# Database Seed Script (Linux/macOS)
# This script seeds master data into the database

set -e

echo "Seeding database..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create .env with DATABASE_URL."
    exit 1
fi

# Seed master data
echo "Running prisma db seed..."
npx prisma db seed

echo "Database seeded successfully!"
