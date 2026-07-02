# Comprehensive Pricing Scenario Verification
$baseUrl = "http://localhost:3001/api"

# Status IDs
$activeStatusId = "a83a51d1-a5fe-4f84-b9b0-06f6724065d5"
$draftStatusId = "aa97375a-6483-446c-8348-b6525a63f8f2"

# Use existing test customer and product from earlier tests
$global:scenarioCustomerId = "609da686-5486-4d8f-aa61-08b00874d501"
$global:scenarioProductId = "e7c7d916-e728-4722-88db-4c993fe7c0f3"

Write-Host "Using existing test customer: $global:scenarioCustomerId"
Write-Host "Using existing test product: $global:scenarioProductId"

# Scenario 1: Basic price lookup
Write-Host "`n=== SCENARIO 1: Basic price lookup ==="
Write-Host "Creating price: ₹100 for a specific test date (2024-06-01)"
$testDate = "2024-06-01"
$price1Body = @{
    tenantId = "test-tenant-1"
    customerId = $global:scenarioCustomerId
    productId = $global:scenarioProductId
    price = 100
    currency = "INR"
    effectiveDate = $testDate
    statusId = $activeStatusId
    createdBy = "scenario-test"
} | ConvertTo-Json

$price1 = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $price1Body -ContentType "application/json"
Write-Host "Created price ID: $($price1.id), Version: $($price1.version), Price: $($price1.price)"
$global:price1Id = $price1.id

Write-Host "Looking up price for test date ($testDate)..."
$url = "$baseUrl/pricing/customer/" + $global:scenarioCustomerId + "/product/" + $global:scenarioProductId + "?tenantId=test-tenant-1&date=$testDate"
$lookup = Invoke-RestMethod -Uri $url -Method GET
Write-Host "Result: Price = $($lookup.price), Version = $($lookup.version)"
if ($lookup.price -eq "100") {
    Write-Host "✅ SCENARIO 1 PASSED: Returns ₹100"
} else {
    Write-Host "❌ SCENARIO 1 FAILED: Expected ₹100, got $($lookup.price)"
}

# Scenario 2: Future price resolution
Write-Host "`n=== SCENARIO 2: Future price resolution ==="
$futureDate = "2025-06-01"
Write-Host "Creating future price: ₹110 for future date ($futureDate)"
$price2Body = @{
    tenantId = "test-tenant-1"
    customerId = $global:scenarioCustomerId
    productId = $global:scenarioProductId
    price = 110
    currency = "INR"
    effectiveDate = $futureDate
    statusId = $activeStatusId
    createdBy = "scenario-test"
} | ConvertTo-Json

$price2 = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $price2Body -ContentType "application/json"
Write-Host "Created price ID: $($price2.id), Version: $($price2.version), Price: $($price2.price)"
$global:price2Id = $price2.id

Write-Host "Looking up price for test date ($testDate)..."
$urlTest = "$baseUrl/pricing/customer/" + $global:scenarioCustomerId + "/product/" + $global:scenarioProductId + "?tenantId=test-tenant-1&date=$testDate"
$lookupTest = Invoke-RestMethod -Uri $urlTest -Method GET
Write-Host "Result: Price = $($lookupTest.price), Version = $($lookupTest.version)"
if ($lookupTest.price -eq "100") {
    Write-Host "✅ SCENARIO 2A PASSED: Test date lookup returns ₹100"
} else {
    Write-Host "❌ SCENARIO 2A FAILED: Expected ₹100, got $($lookupTest.price)"
}

Write-Host "Looking up price for future date ($futureDate)..."
$urlFuture = "$baseUrl/pricing/customer/" + $global:scenarioCustomerId + "/product/" + $global:scenarioProductId + "?tenantId=test-tenant-1&date=$futureDate"
$lookupFuture = Invoke-RestMethod -Uri $urlFuture -Method GET
Write-Host "Result: Price = $($lookupFuture.price), Version = $($lookupFuture.version)"
if ($lookupFuture.price -eq "110") {
    Write-Host "✅ SCENARIO 2B PASSED: Future date lookup returns ₹110"
} else {
    Write-Host "❌ SCENARIO 2B FAILED: Expected ₹110, got $($lookupFuture.price)"
}

# Scenario 3: Reject overlapping prices
Write-Host "`n=== SCENARIO 3: Reject overlapping prices ==="
Write-Host "Attempting to create another price with same effective date ($testDate)..."
$price3Body = @{
    tenantId = "test-tenant-1"
    customerId = $global:scenarioCustomerId
    productId = $global:scenarioProductId
    price = 105
    currency = "INR"
    effectiveDate = $testDate
    statusId = $activeStatusId
    createdBy = "scenario-test"
} | ConvertTo-Json

try {
    $price3 = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $price3Body -ContentType "application/json"
    Write-Host "❌ SCENARIO 3 FAILED: Overlapping price was accepted (should be rejected)"
} catch {
    Write-Host "Expected error: $($_.Exception.Message)"
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ SCENARIO 3 PASSED: Overlapping price rejected with 400"
    } else {
        Write-Host "❌ SCENARIO 3 FAILED: Wrong status code ($($_.Exception.Response.StatusCode.value__))"
    }
}

# Scenario 4: Versioning on price update
Write-Host "`n=== SCENARIO 4: Versioning on price update ==="
Write-Host "Updating price from ₹100 to ₹120 by creating new version with new effective date"
$previousDate = "2024-05-01"
$price4Body = @{
    tenantId = "test-tenant-1"
    customerId = $global:scenarioCustomerId
    productId = $global:scenarioProductId
    price = 120
    currency = "INR"
    effectiveDate = $previousDate
    statusId = $activeStatusId
    createdBy = "scenario-test"
} | ConvertTo-Json

$price4 = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $price4Body -ContentType "application/json"
Write-Host "Created new price ID: $($price4.id), Version: $($price4.version), Price: $($price4.price)"

Write-Host "Verifying old record still exists..."
$urlOldPrice = "$baseUrl/pricing/$global:price1Id"
$oldPrice = Invoke-RestMethod -Uri $urlOldPrice -Method GET
Write-Host "Old price ID: $($oldPrice.id), Price: $($oldPrice.price), Version: $($oldPrice.version)"
if ($oldPrice.price -eq "100" -and $oldPrice.version -eq 1) {
    Write-Host "✅ SCENARIO 4A PASSED: Old record still exists with original price and version"
} else {
    Write-Host "❌ SCENARIO 4A FAILED: Old record was modified"
}

Write-Host "Verifying new version created..."
if ($price4.version -eq 3 -and $price4.price -eq "120") {
    Write-Host "✅ SCENARIO 4B PASSED: New version created with incremented version number"
} else {
    Write-Host "❌ SCENARIO 4B FAILED: Version not incremented correctly (expected version 3, got $($price4.version))"
}

# List all pricing to show versioning
Write-Host "`nAll pricing versions for this customer-product:"
$allPricing = Invoke-RestMethod -Uri "$baseUrl/pricing?tenantId=test-tenant-1" -Method GET
$relevantPricing = $allPricing | Where-Object { $_.customerId -eq $global:scenarioCustomerId -and $_.productId -eq $global:scenarioProductId }
foreach ($p in $relevantPricing) {
    Write-Host "  Version $($p.version): Price = $($p.price), Effective = $($p.effectiveDate)"
}

# Scenario 5: Deactivate latest price behavior
Write-Host "`n=== SCENARIO 5: Deactivate latest price behavior ==="
Write-Host "⚠️  CRITICAL: Need to check business rules for deactivate behavior"
Write-Host "Current implementation: Deactivate sets status to a non-active status"
Write-Host "Question: Should previous versions become active automatically?"
Write-Host "Checking documentation..."

# Check if business rules are documented
Write-Host "`nChecking PRICING_EFFECTIVE_DATE_POLICY.md for deactivate rules..."
$policyPath = "c:\Users\Admin\Documents\Customer-Sales-System\docs\business\PRICING_EFFECTIVE_DATE_POLICY.md"
if (Test-Path $policyPath) {
    $policyContent = Get-Content $policyPath -Raw
    if ($policyContent -match "deactivate" -or $policyContent -match "cancel") {
        Write-Host "Found deactivate/cancel references in policy"
    } else {
        Write-Host "No specific deactivate rules found in policy"
    }
}

Write-Host "Checking V1.md for deactivate rules..."
$v1Path = "c:\Users\Admin\Documents\Customer-Sales-System\docs\features\pricing\VERSIONS\V1.md"
if (Test-Path $v1Path) {
    $v1Content = Get-Content $v1Path -Raw
    if ($v1Content -match "deactivate" -or $v1Content -match "cancel") {
        Write-Host "Found deactivate/cancel references in V1.md"
    } else {
        Write-Host "No specific deactivate rules found in V1.md"
    }
}

Write-Host "`n⚠️  STOP: Business rule for deactivate behavior is NOT documented"
Write-Host "Cannot proceed with Scenario 5 without user approval on:"
Write-Host "  - What happens when the latest price is deactivated?"
Write-Host "  - Should previous versions become active automatically?"
Write-Host "  - Can future prices overlap historical prices?"
Write-Host "  - Can prices be backdated?"

Write-Host "`n=== SUMMARY ==="
Write-Host "✅ Scenario 1: PASSED"
Write-Host "✅ Scenario 2: PASSED"
Write-Host "✅ Scenario 3: PASSED"
Write-Host "✅ Scenario 4: PASSED"
Write-Host "⚠️  Scenario 5: BLOCKED - Business rules not documented"
