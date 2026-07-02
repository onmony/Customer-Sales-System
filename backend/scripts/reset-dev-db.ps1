# Database Reset Script (PowerShell)
# WARNING: This script drops and recreates the database
# Only use in development!

Write-Host "WARNING: This will drop and recreate the database!" -ForegroundColor Red
$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

Write-Host "Resetting development database..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found. Please create .env with DATABASE_URL." -ForegroundColor Red
    exit 1
}

# Reset database
Write-Host "Running prisma migrate reset..." -ForegroundColor Yellow
npx prisma migrate reset --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to reset database." -ForegroundColor Red
    exit 1
}

Write-Host "Development database reset complete!" -ForegroundColor Green
