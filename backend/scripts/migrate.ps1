# Database Migration Script (PowerShell)
# This script applies pending migrations

Write-Host "Applying database migrations..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found. Please create .env with DATABASE_URL." -ForegroundColor Red
    exit 1
}

# Apply migrations
Write-Host "Running prisma migrate deploy..." -ForegroundColor Yellow
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to apply migrations." -ForegroundColor Red
    exit 1
}

# Regenerate Prisma client
Write-Host "Regenerating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to generate Prisma client." -ForegroundColor Red
    exit 1
}

Write-Host "Migrations applied successfully!" -ForegroundColor Green
