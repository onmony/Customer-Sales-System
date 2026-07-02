# Simple test for Pricing API
$baseUrl = "http://localhost:3001/api"

# Status IDs from database
$activeStatusId = "a83a51d1-a5fe-4f84-b9b0-06f6724065d5"
$draftStatusId = "aa97375a-6483-446c-8348-b6525a63f8f2"

# Test customer and product IDs (from database)
$customerId = "609da686-5486-4d8f-aa61-08b00874d501"
$productId = "e7c7d916-e728-4722-88db-4c993fe7c0f3"

# Test 1: Create pricing (with today's date for resolution test)
Write-Host "Test 1: Create pricing (with today's date)"
$today = Get-Date -Format "yyyy-MM-dd"
$body = @{
    tenantId = "test-tenant-1"
    customerId = $customerId
    productId = $productId
    price = 150.50
    currency = "INR"
    effectiveDate = $today
    statusId = $activeStatusId
    createdBy = "test-user"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success! Pricing created:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
    $global:pricingId = $response.id
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

# Test 2: Get pricing by ID
if ($global:pricingId) {
    Write-Host "`nTest 2: Get pricing by ID"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/pricing/$global:pricingId" -Method GET
        Write-Host "Success! Pricing retrieved:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 3: List pricing
Write-Host "`nTest 3: List pricing"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pricing?tenantId=test-tenant-1" -Method GET
    Write-Host "Success! Pricing listed:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test 4: Resolve pricing (without date parameter - uses current date)
Write-Host "`nTest 4: Resolve pricing (without date parameter)"
Write-Host "Customer ID: $customerId"
Write-Host "Product ID: $productId"
$url = "$baseUrl/pricing/customer/" + $customerId + "/product/" + $productId + "?tenantId=test-tenant-1"
Write-Host "URL: $url"
try {
    $response = Invoke-RestMethod -Uri $url -Method GET
    Write-Host "Success! Pricing resolved:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

# Test 5: Activate pricing
if ($global:pricingId) {
    Write-Host "`nTest 5: Activate pricing"
    $activateBody = @{
        updatedBy = "test-user"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/pricing/$global:pricingId/activate" -Method PUT -Body $activateBody -ContentType "application/json"
        Write-Host "Success! Pricing activated:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 6: Deactivate pricing
if ($global:pricingId) {
    Write-Host "`nTest 6: Deactivate pricing"
    $deactivateBody = @{
        updatedBy = "test-user"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/pricing/$global:pricingId/deactivate" -Method PUT -Body $deactivateBody -ContentType "application/json"
        Write-Host "Success! Pricing deactivated:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 7: Validation error - missing tenant ID
Write-Host "`nTest 7: Validation error (missing tenant ID)"
$invalidBody = @{
    customerId = $customerId
    productId = $productId
    price = 100
    currency = "INR"
    effectiveDate = "2024-01-01"
    statusId = $activeStatusId
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $invalidBody -ContentType "application/json"
    Write-Host "Unexpected success!"
} catch {
    Write-Host "Expected error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

# Test 8: Validation error - invalid price (zero)
Write-Host "`nTest 8: Validation error (invalid price - zero)"
$invalidBody2 = @{
    tenantId = "test-tenant-1"
    customerId = $customerId
    productId = $productId
    price = 0
    currency = "INR"
    effectiveDate = "2024-01-01"
    statusId = $activeStatusId
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $invalidBody2 -ContentType "application/json"
    Write-Host "Unexpected success!"
} catch {
    Write-Host "Expected error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

# Test 9: Validation error - invalid currency
Write-Host "`nTest 9: Validation error (invalid currency - lowercase)"
$invalidBody3 = @{
    tenantId = "test-tenant-1"
    customerId = $customerId
    productId = $productId
    price = 100
    currency = "inr"
    effectiveDate = "2024-01-01"
    statusId = $activeStatusId
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pricing" -Method POST -Body $invalidBody3 -ContentType "application/json"
    Write-Host "Unexpected success!"
} catch {
    Write-Host "Expected error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

Write-Host "`n=== Tests Complete ==="
