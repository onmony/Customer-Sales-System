# Simple test for Product API
$baseUrl = "http://localhost:3001/api"

# Test 1: Create product
Write-Host "Test 1: Create product"
$uniqueSku = "SKU-" + (Get-Date).Ticks
$body = @{
    tenantId = "test-tenant-1"
    displayName = "Test Product"
    sku = $uniqueSku
    unit = "PCS"
    isActive = $true
    createdBy = "test-user"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success! Product created:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
    $global:productId = $response.id
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

# Test 2: Get product by ID
if ($global:productId) {
    Write-Host "`nTest 2: Get product by ID"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/products/$global:productId" -Method GET
        Write-Host "Success! Product retrieved:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 3: List products
Write-Host "`nTest 3: List products"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products?tenantId=test-tenant-1" -Method GET
    Write-Host "Success! Products listed:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test 4: Search products
Write-Host "`nTest 4: Search products"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products/search?tenantId=test-tenant-1&query=Test" -Method GET
    Write-Host "Success! Search results:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test 5: Update product
if ($global:productId) {
    Write-Host "`nTest 5: Update product"
    $updateBody = @{
        displayName = "Updated Test Product"
        updatedBy = "test-user"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/products/$global:productId" -Method PUT -Body $updateBody -ContentType "application/json"
        Write-Host "Success! Product updated:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 6: Archive product (soft delete)
if ($global:productId) {
    Write-Host "`nTest 6: Archive product (soft delete)"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/products/$global:productId" -Method DELETE -ContentType "application/json"
        Write-Host "Success! Product archived:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
        Write-Host "deletedAt should be set: $($response.deletedAt)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 7: Validation error - missing display name
Write-Host "`nTest 7: Validation error (missing display name)"
$invalidBody = @{
    tenantId = "test-tenant-1"
    sku = "SKU-123"
    unit = "PCS"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $invalidBody -ContentType "application/json"
    Write-Host "Unexpected success!"
} catch {
    Write-Host "Expected error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

# Test 8: Validation error - missing unit
Write-Host "`nTest 8: Validation error (missing unit)"
$invalidBody2 = @{
    tenantId = "test-tenant-1"
    displayName = "Test Product"
    sku = "SKU-123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $invalidBody2 -ContentType "application/json"
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
