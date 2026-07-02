#!/bin/bash
# Database Reset Script (Linux/macOS)
# WARNING: This script drops and recreates the database
# Only use in development!

echo "WARNING: This will drop and recreate the database!"
read -p "Are you sure you want to continue? (yes/no) " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo "Resetting development database..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create .env with DATABASE_URL."
    exit 1
fi

# Reset database
echo "Running prisma migrate reset..."
npx prisma migrate reset --force

echo "Development database reset complete!"
