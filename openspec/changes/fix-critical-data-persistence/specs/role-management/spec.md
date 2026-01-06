# Spec: Role Management

## MODIFIED Requirements

### Requirement: Role salary management
**Priority:** CRITICAL  
**Status:** MODIFIED

Roles MUST support salary range definition that automatically propagates to associated job postings.

#### Scenario: HR defines salary range for a role
**Given** an HR user is editing a role  
**When** they enter a minimum salary of 5000 and maximum salary of 8000  
**And** they save the role  
**Then** the salary values must persist in the database  
**And** all jobs associated with this role must update their salary fields  
**And** the public job pages must display the updated salary range

#### Scenario: Salary validation
**Given** an HR user is editing a role  
**When** they enter a minimum salary greater than the maximum salary  
**Then** the system must show an error message  
**And** prevent saving until corrected

#### Scenario: Salary display in read-only mode
**Given** a user is editing a job  
**When** they view the job's vital data sidebar  
**Then** the salary range must be displayed as read-only  
**And** must match the parent role's salary values

---

### Requirement: Role-to-job relationship
**Priority:** CRITICAL  
**Status:** MODIFIED

Jobs MUST maintain a foreign key reference to their parent role to ensure data consistency.

#### Scenario: Creating a job from a role
**Given** an admin user selects a role to create a job  
**When** they complete the job creation form  
**And** submit the job  
**Then** the job must save with a `role_id` referencing the selected role  
**And** inherit the role's department, salary, mission, and responsibilities

#### Scenario: Orphaned jobs handling
**Given** a job exists with a `role_id` reference  
**When** the parent role is deleted  
**Then** the job's `role_id` must be set to NULL  
**And** the job must retain its last known values  
**And** the job must remain visible and editable

#### Scenario: Role changes propagate to jobs
**Given** multiple jobs exist for a single role  
**When** the role's salary or department is updated  
**Then** all associated jobs must update automatically  
**And** the changes must be visible immediately on public pages

---

## ADDED Requirements

### Requirement: Database schema completeness
**Priority:** CRITICAL  
**Status:** ADDED

The database schema MUST include all fields necessary for role-based salary management.

#### Scenario: Roles table has salary columns
**Given** the database schema is deployed  
**When** querying the `roles` table structure  
**Then** it must include `salary_min` column of type INTEGER  
**And** it must include `salary_max` column of type INTEGER  
**And** both columns must default to 0

#### Scenario: Jobs table has role reference
**Given** the database schema is deployed  
**When** querying the `jobs` table structure  
**Then** it must include `role_id` column of type UUID  
**And** it must have a foreign key constraint to `roles(id)`  
**And** it must use ON DELETE SET NULL behavior

#### Scenario: Performance indexes exist
**Given** the database schema is deployed  
**When** querying database indexes  
**Then** an index must exist on `jobs(role_id)`  
**And** query performance for role-job joins must be acceptable (< 100ms)
