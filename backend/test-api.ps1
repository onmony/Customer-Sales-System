# Test script for Customer APIs

$baseUrl = "http://localhost:3001/api"

# Test 1: Create a customer
Write-Host "Test 1: POST /customers - Create customer"
$body = @{
    tenantId = "test-tenant-1"
    displayName = "Test Customer"
    gstNumber = "27ABCDE1234F1Z5"
    creditLimit = 10000
    statusId = "active"
    createdBy = "test-user"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/customers" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
    $createdCustomer = $response.Content | ConvertFrom-Json
    $customerId = $createdCustomer.id
    Write-Host "Created customer ID: $customerId"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    $customerId = $null
}

# Test 2: Get customer by ID
if ($customerId) {
    Write-Host "`nTest 2: GET /customers/:id - Get customer by ID"
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/customers/$customerId" -Method GET
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 3: List customers
Write-Host "`nTest 3: GET /customers - List customers"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/customers?tenantId=test-tenant-1" -Method GET
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test 4: Search customers
Write-Host "`nTest 4: GET /customers/search - Search customers"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/customers/search?tenantId=test-tenant-1&query=Test" -Method GET
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test 5: Update customer
if ($customerId) {
    Write-Host "`nTest 5: PUT /customers/:id - Update customer"
    $updateBody = @{
        displayName = "Updated Test Customer"
        updatedBy = "test-user"
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/customers/$customerId" -Method PUT -Body $updateBody -ContentType "application/json"
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 6: Archive customer (soft delete)
if ($customerId) {
    Write-Host "`nTest 6: DELETE /customers/:id - Archive customer (soft delete)"
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/customers/$customerId" -Method DELETE -ContentType "application/json"
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

# Test 7: Validation error - missing display name
Write-Host "`nTest 7: POST /customers - Validation error (missing display name)"
$invalidBody = @{
    tenantId = "test-tenant-1"
    gstNumber = "27ABCDE1234F1Z5"
    statusId = "active"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/customers" -Method POST -Body $invalidBody -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}

# Test 8: Validation error - invalid GST number
Write-Host "`nTest 8: POST /customers - Validation error (invalid GST number)"
$invalidBody2 = @{
    tenantId = "test-tenant-1"
    displayName = "Test Customer"
    gstNumber = "123"
    statusId = "active"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/customers" -Method POST -Body $invalidBody2 -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}

Write-Host "`n=== API Tests Complete ==="
