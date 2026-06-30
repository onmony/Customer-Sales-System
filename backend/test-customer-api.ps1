# Simple test for Customer API
$baseUrl = "http://localhost:3001/api"

# Test 1: Create customer
Write-Host "Test 1: Create customer"
$body = @{
    tenantId = "test-tenant-1"
    displayName = "Test Customer"
    gstNumber = "27ABCDE1234F1Z5"
    creditLimit = 10000
    statusId = "533a6b28-0c79-40ee-8946-22abe090b53c"
    createdBy = "test-user"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/customers" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success! Customer created:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
    $global:customerId = $response.id
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}

# Test 2: Get customer by ID
if ($global:customerId) {
    Write-Host "`nTest 2: Get customer by ID"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/customers/$global:customerId" -Method GET
        Write-Host "Success! Customer retrieved:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 3: List customers
Write-Host "`nTest 3: List customers"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/customers?tenantId=test-tenant-1" -Method GET
    Write-Host "Success! Customers listed:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test 4: Search customers
Write-Host "`nTest 4: Search customers"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/customers/search?tenantId=test-tenant-1&query=Test" -Method GET
    Write-Host "Success! Search results:"
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test 5: Update customer
if ($global:customerId) {
    Write-Host "`nTest 5: Update customer"
    $updateBody = @{
        displayName = "Updated Test Customer"
        updatedBy = "test-user"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/customers/$global:customerId" -Method PUT -Body $updateBody -ContentType "application/json"
        Write-Host "Success! Customer updated:"
        Write-Host ($response | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 6: Archive customer (soft delete)
if ($global:customerId) {
    Write-Host "`nTest 6: Archive customer (soft delete)"
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/customers/$global:customerId" -Method DELETE -ContentType "application/json"
        Write-Host "Success! Customer archived:"
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
    gstNumber = "27ABCDE1234F1Z5"
    statusId = "533a6b28-0c79-40ee-8946-22abe090b53c"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/customers" -Method POST -Body $invalidBody -ContentType "application/json"
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
