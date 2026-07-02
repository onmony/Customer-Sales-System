# Database Setup Script (PowerShell)
# This script sets up a new database from scratch

Write-Host "Setting up database..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found. Please create .env with DATABASE_URL." -ForegroundColor Red
    exit 1
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to generate Prisma client." -ForegroundColor Red
    exit 1
}

# Apply migrations
Write-Host "Applying migrations..." -ForegroundColor Yellow
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to apply migrations." -ForegroundColor Red
    exit 1
}

# Seed master data
Write-Host "Seeding master data..." -ForegroundColor Yellow
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Seed failed or not configured." -ForegroundColor Yellow
}

Write-Host "Database setup complete!" -ForegroundColor Green
