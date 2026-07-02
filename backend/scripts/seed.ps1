# Database Seed Script (PowerShell)
# This script seeds master data into the database

Write-Host "Seeding database..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found. Please create .env with DATABASE_URL." -ForegroundColor Red
    exit 1
}

# Seed master data
Write-Host "Running prisma db seed..." -ForegroundColor Yellow
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Seed failed." -ForegroundColor Red
    exit 1
}

Write-Host "Database seeded successfully!" -ForegroundColor Green
