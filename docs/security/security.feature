Feature: Authorization System
  As a system administrator
  I want to manage roles and permissions
  So that users can be granted appropriate access to system resources

  Background:
    Given the authorization system is bootstrapped
    And the following default roles exist:
      | name          | description                              | is_system | is_enabled |
      | Administrator | Full system access with all permissions  | true      | true       |
      | Sales         | Sales team access for customer management| true      | true       |
      | Warehouse     | Warehouse operations for inventory        | true      | true       |
      | Finance       | Finance team access for invoicing        | true      | true       |
      | Manager       | Manager access with oversight            | true      | true       |

  Scenario: Bootstrap creates default roles from YAML
    Given the application is starting for the first time
    And config/roles.yaml contains default role definitions
    When the bootstrap process runs
    Then the Administrator role should be created in the database
    And the Sales role should be created in the database
    And the Warehouse role should be created in the database
    And the Finance role should be created in the database
    And the Manager role should be created in the database
    And the bootstrap complete flag should be set to true
    And the database should become the source of truth

  Scenario: Bootstrap skips if already completed
    Given the application has been bootstrapped previously
    And the bootstrap complete flag is set to true
    When the application starts
    Then the bootstrap process should be skipped
    And config/roles.yaml should not be read
    And existing roles should remain unchanged

  Scenario: Role creation through UI
    Given a user with "role.create" permission
    When the user creates a new role named "Support"
    And sets the description to "Customer support team"
    And assigns the "customer.view" permission
    And assigns the "customer.edit" permission
    Then the "Support" role should be created
    And the role should have the "customer.view" permission
    And the role should have the "customer.edit" permission
    And the role creation should be logged in audit history

  Scenario: Permission assignment to role
    Given a "Sales" role exists
    And a user with "role.edit" permission
    When the user adds the "customer.delete" permission to the "Sales" role
    Then the "Sales" role should have the "customer.delete" permission
    And the permission assignment should be logged in audit history

  Scenario: Permission removal from role
    Given a "Sales" role exists with "customer.delete" permission
    And a user with "role.edit" permission
    When the user removes the "customer.delete" permission from the "Sales" role
    Then the "Sales" role should not have the "customer.delete" permission
    And the permission removal should be logged in audit history

  Scenario: Role cloning
    Given a "Sales" role exists with permissions
    And a user with "role.create" permission
    When the user clones the "Sales" role as "Sales Senior"
    Then the "Sales Senior" role should be created
    And the "Sales Senior" role should have the same permissions as "Sales"
    And the "Sales Senior" role should have no members assigned
    And the role cloning should be logged in audit history

  Scenario: Role duplication
    Given a "Sales" role exists with permissions
    And a user with "role.create" permission
    When the user duplicates the "Sales" role
    Then a new role should be created with "Sales Copy" name
    And the new role should have the same permissions as "Sales"
    And the new role should have no members assigned

  Scenario: Role disabling
    Given a "Sales" role exists and is enabled
    And the "Sales" role has 5 members
    And a user with "role.edit" permission
    When the user disables the "Sales" role
    Then the "Sales" role should be disabled
    And all members of the "Sales" role should lose permissions
    And the role disabling should be logged in audit history

  Scenario: Role enabling
    Given a "Sales" role exists and is disabled
    And a user with "role.edit" permission
    When the user enables the "Sales" role
    Then the "Sales" role should be enabled
    And members of the "Sales" role should regain permissions
    And the role enabling should be logged in audit history

  Scenario: Prevent disabling last administrator role
    Given the "Administrator" role is the only enabled role with admin permissions
    And a user with "role.edit" permission
    When the user attempts to disable the "Administrator" role
    Then the operation should be denied
    And an error message should indicate this is the last admin role

  Scenario: Permission validation for user
    Given a user "john" exists
    And "john" is assigned the "Sales" role
    And the "Sales" role has "customer.view" permission
    When checking if "john" has "customer.view" permission
    Then the check should return true

  Scenario: Permission denial for user
    Given a user "john" exists
    And "john" is assigned the "Sales" role
    And the "Sales" role does not have "customer.delete" permission
    When checking if "john" has "customer.delete" permission
    Then the check should return false

  Scenario: Wildcard permission expansion
    Given a "Sales" role exists
    And the "Sales" role has "customer.*" permission
    When the user's permissions are resolved
    Then the user should have "customer.view" permission
    And the user should have "customer.create" permission
    And the user should have "customer.edit" permission
    And the user should have "customer.delete" permission

  Scenario: Global wildcard permission
    Given an "Administrator" role exists
    And the "Administrator" role has "*" permission
    When the user's permissions are resolved
    Then the user should have all permissions in the system

  Scenario: User authorization with multiple roles
    Given a user "john" exists
    And "john" is assigned the "Sales" role
    And "john" is assigned the "Manager" role
    And the "Sales" role has "customer.view" permission
    And the "Manager" role has "order.view" permission
    When checking if "john" has "customer.view" permission
    Then the check should return true
    When checking if "john" has "order.view" permission
    Then the check should return true

  Scenario: Inactive user authorization denial
    Given a user "john" exists
    And "john" is assigned the "Sales" role
    And "john" is inactive
    When checking if "john" has "customer.view" permission
    Then the check should return false

  Scenario: Disabled role authorization denial
    Given a user "john" exists
    And "john" is assigned the "Sales" role
    And the "Sales" role is disabled
    When checking if "john" has "customer.view" permission
    Then the check should return false

  Scenario: Deleted role authorization denial
    Given a user "john" exists
    And "john" has an assignment to a deleted role
    When checking if "john" has any permissions
    Then the check should return false
    And the orphaned assignment should be ignored

  Scenario: System role deletion prevention
    Given the "Sales" role is a system role
    And a user with "role.delete" permission
    When the user attempts to delete the "Sales" role
    Then the operation should be denied
    And an error message should indicate system roles cannot be deleted

  Scenario: System role rename prevention
    Given the "Sales" role is a system role
    And a user with "role.edit" permission
    When the user attempts to rename the "Sales" role
    Then the operation should be denied
    And an error message should indicate system roles cannot be renamed

  Scenario: Assign users to role
    Given a "Sales" role exists
    And a user "john" exists
    And a user with "role.assign_users" permission
    When the user assigns "john" to the "Sales" role
    Then "john" should be a member of the "Sales" role
    And the assignment should be logged in audit history

  Scenario: Remove user from role
    Given a "Sales" role exists
    And "john" is a member of the "Sales" role
    And a user with "role.assign_users" permission
    When the user removes "john" from the "Sales" role
    Then "john" should not be a member of the "Sales" role
    And the removal should be logged in audit history

  Scenario: View role members
    Given a "Sales" role exists
    And "john" is a member of the "Sales" role
    And "jane" is a member of the "Sales" role
    And a user with "role.view" permission
    When the user views the members of the "Sales" role
    Then the member list should include "john"
    And the member list should include "jane"
    And the assignment dates should be displayed

  Scenario: Audit history tracking
    Given a "Sales" role exists
    And a user with "role.edit" permission
    When the user adds "customer.delete" permission to the "Sales" role
    And the user removes "customer.create" permission from the "Sales" role
    And the user disables the "Sales" role
    Then the audit history should show the permission addition
    And the audit history should show the permission removal
    And the audit history should show the role disable
    And each entry should include the user who made the change
    And each entry should include the timestamp

  Scenario: Permission matrix view
    Given multiple roles exist with various permissions
    And a user with "role.view" permission
    When the user views the permission matrix
    Then all roles should be displayed as columns
    And all permissions should be displayed as rows
    And granted permissions should be marked
    And denied permissions should be marked
    And wildcard permissions should be indicated

  Scenario: Permission search
    Given multiple permissions exist in the system
    And a user with "role.view" permission
    When the user searches for "customer" permissions
    Then all permissions starting with "customer" should be displayed
    And the domain should be shown for each permission
    And the action should be shown for each permission
    And the number of roles using each permission should be shown

  Scenario: Role list filtering
    Given multiple roles exist
    And a user with "role.view" permission
    When the user filters roles by status "enabled"
    Then only enabled roles should be displayed
    When the user filters roles by type "system"
    Then only system roles should be displayed
    When the user filters roles by name containing "Sales"
    Then only roles with "Sales" in the name should be displayed

  Scenario: Future tenant override
    Given the system is in multi-tenant mode
    And a global "Sales" role exists with "customer.view" permission
    And a tenant "Acme Corp" exists
    And a tenant-specific "Sales" role exists for "Acme Corp"
    And the tenant-specific role has "customer.edit" permission
    When checking permissions for a user in "Acme Corp"
    Then the user should have "customer.view" permission from global role
    And the user should have "customer.edit" permission from tenant role
    And tenant permissions should override global permissions

  Scenario: Bootstrap synchronization
    Given the system has been bootstrapped
    And config/roles.yaml has been updated with new roles
    When the administrator runs the bootstrap sync command
    Then new roles from YAML should be added to the database
    And new permissions from YAML should be added to the database
    And existing roles should not be modified
    And existing permissions should not be removed
    And the synchronization should be logged

  Scenario: Bootstrap force re-run
    Given the system has been bootstrapped
    And roles have been modified through the UI
    When the administrator runs the bootstrap force command with confirmation
    Then a backup of the current database state should be created
    And all roles should be reset to YAML defaults
    And all permissions should be reset to YAML defaults
    And all custom roles should be removed
    And the bootstrap version should be updated

  Scenario: Cache invalidation on role change
    Given a user "john" has cached permissions
    And "john" is assigned the "Sales" role
    When the "Sales" role permissions are modified
    Then "john"'s permission cache should be invalidated
    And the next permission check should query the database
    And the cache should be updated with new permissions

  Scenario: Cache invalidation on user role assignment
    Given a user "john" has cached permissions
    When "john" is assigned a new role
    Then "john"'s permission cache should be invalidated
    And the next permission check should include the new role

  Scenario: Permission check error handling
    Given the database is unavailable
    When a permission check is attempted
    Then the check should return DENY
    And an error should be logged
    And the system should continue operating in fail-safe mode

  Scenario: Unknown permission handling
    Given a user has "customer.*" wildcard permission
    When checking for "customer.archive" permission that doesn't exist
    Then the check should return ALLOW
    Because the wildcard matches the permission pattern

  Scenario: Role details view
    Given a "Sales" role exists with permissions
    And the "Sales" role has 5 members
    And a user with "role.view" permission
    When the user views the "Sales" role details
    Then the role name should be displayed
    And the role description should be displayed
    And the role type should be displayed
    And the role status should be displayed
    And all permissions should be listed
    And the member count should be displayed
    And the audit history should be displayed

  Scenario: Bulk permission assignment
    Given a "Sales" role exists
    And a user with "role.edit" permission
    When the user selects multiple permissions
    And assigns them to the "Sales" role
    Then all selected permissions should be assigned
    And the assignment should be logged in audit history

  Scenario: Bulk user assignment
    Given a "Sales" role exists
    And multiple users exist
    And a user with "role.assign_users" permission
    When the user selects multiple users
    And assigns them to the "Sales" role
    Then all selected users should be assigned to the role
    And the assignments should be logged in audit history

  Scenario: Export permission matrix
    Given a user with "role.view" permission
    When the user exports the permission matrix
    Then a CSV file should be generated
    And the file should contain all roles as columns
    And the file should contain all permissions as rows
    And the file should indicate granted permissions

  Scenario: Export audit history
    Given a user with "role.view" permission
    When the user exports the audit history
    Then a CSV file should be generated
    And the file should contain all audit entries
    And the file should include timestamps
    And the file should include user information
    And the file should include change details

  Scenario: Role creation validation
    Given a user with "role.create" permission
    When the user attempts to create a role with an existing name
    Then the operation should be denied
    And an error message should indicate the role name already exists
    When the user attempts to create a role with an empty name
    Then the operation should be denied
    And an error message should indicate the name is required

  Scenario: Permission naming validation
    Given a user with "role.edit" permission
    When the user attempts to add a permission with invalid format
    Then the operation should be denied
    And an error message should indicate the correct format
    And the error message should show an example

  Scenario: Frontend page visibility based on permissions
    Given a user "john" has "customer.view" permission
    And "john" does not have "customer.delete" permission
    When "john" views the customer page
    Then the customer list should be visible
    And the customer details should be visible
    And the delete button should not be visible

  Scenario: API endpoint authorization
    Given a user "john" has "customer.view" permission
    And "john" does not have "customer.delete" permission
    When "john" requests GET /api/customers
    Then the request should be allowed
    When "john" requests DELETE /api/customers/123
    Then the request should be denied
    And a 403 status code should be returned

  Scenario: Feature visibility based on permissions
    Given a user "john" has "order.view" permission
    And "john" does not have "pricing.view" permission
    When "john" views the dashboard
    Then the orders menu item should be visible
    And the pricing menu item should not be visible

  Scenario: Role description update
    Given a "Sales" role exists
    And a user with "role.edit" permission
    When the user updates the role description
    Then the description should be updated
    And the change should be logged in audit history

  Scenario: Search users for role assignment
    Given a "Sales" role exists
    And multiple users exist in the system
    And a user with "role.assign_users" permission
    When the user searches for users to assign
    And filters by name "john"
    Then users matching "john" should be displayed
    And users already in the role should be excluded
