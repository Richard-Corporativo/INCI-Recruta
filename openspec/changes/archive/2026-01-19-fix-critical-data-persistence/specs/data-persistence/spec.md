# Spec: Data Persistence

## MODIFIED Requirements

### Requirement: Data integrity and consistency
**Priority:** CRITICAL  
**Status:** MODIFIED

All data modifications MUST persist correctly and maintain referential integrity across related tables.

#### Scenario: Role data persists after save
**Given** an admin edits a role  
**When** they modify any field including salary  
**And** click save  
**Then** all changes must persist to the database  
**And** reloading the page must show the saved values  
**And** no data must be lost or corrupted

#### Scenario: Job data inherits from role
**Given** a job is created from a role  
**When** the job is saved  
**Then** it must store a reference to the parent role  
**And** it must inherit current role values  
**And** subsequent role updates must propagate automatically

#### Scenario: Candidate application persists
**Given** a candidate submits an application  
**When** the form is submitted  
**Then** the application must be saved to the database  
**And** the resume must be uploaded to storage  
**And** the candidate must be able to view it later

---

### Requirement: Error handling and recovery
**Priority:** HIGH  
**Status:** ADDED

Data operations MUST handle errors gracefully and provide clear feedback to users.

#### Scenario: Database constraint violation
**Given** a user attempts to save invalid data  
**When** a database constraint is violated  
**Then** the system must catch the error  
**And** display a user-friendly error message  
**And** not crash or show technical details

#### Scenario: Network failure during save
**Given** a user is saving data  
**When** the network connection is lost  
**Then** the system must detect the failure  
**And** show a retry option  
**And** preserve the user's input

#### Scenario: Concurrent modification handling
**Given** two users edit the same record simultaneously  
**When** both attempt to save  
**Then** the system must handle the conflict  
**And** notify the second user of the conflict  
**And** allow them to review and merge changes

---

## ADDED Requirements

### Requirement: Data synchronization mechanisms
**Priority:** HIGH  
**Status:** ADDED

Changes to parent records MUST automatically synchronize to dependent records.

#### Scenario: Role update triggers job sync
**Given** a role has 5 associated jobs  
**When** the role's salary is updated  
**Then** all 5 jobs must update within 1 second  
**And** the sync must be atomic (all or none)  
**And** any sync errors must be logged

#### Scenario: Sync failure rollback
**Given** a role update is being synced to jobs  
**When** one job update fails  
**Then** the entire operation must rollback  
**And** the role must revert to previous values  
**And** the user must be notified of the failure

#### Scenario: Sync performance monitoring
**Given** a role has many associated jobs  
**When** the role is updated  
**Then** the sync operation must complete in < 5 seconds  
**And** the UI must show a loading indicator  
**And** the user must receive confirmation when complete

---

### Requirement: Data validation
**Priority:** HIGH  
**Status:** ADDED

All data MUST be validated before persistence to ensure quality and consistency.

#### Scenario: Required field validation
**Given** a user is creating or editing a record  
**When** they leave a required field empty  **Then** the system must prevent submission  
**And** highlight the missing field  
**And** show a clear error message

#### Scenario: Data type validation
**Given** a user enters data in a form field  
**When** the data type is incorrect (e.g., text in number field)  
**Then** the system must reject the input  
**And** show a validation error  
**And** suggest the correct format

#### Scenario: Business rule validation
**Given** a user enters salary values  
**When** minimum salary > maximum salary  
**Then** the system must reject the values  
**And** show an error "Salário mínimo não pode ser maior que o máximo"  
**And** prevent saving until corrected

---

### Requirement: Audit and logging
**Priority:** MEDIUM  
**Status:** ADDED

Critical data changes MUST be logged for audit and debugging purposes.

#### Scenario: Role salary change logging
**Given** an admin updates a role's salary  
**When** the change is saved  
**Then** the system must log the change  
**And** record the old and new values  
**And** record the user who made the change  
**And** record the timestamp

#### Scenario: Application submission logging
**Given** a candidate submits an application  
**When** the submission succeeds or fails  
**Then** the system must log the event  
**And** include relevant context (job_id, user_id, timestamp)  
**And** log any errors with stack traces

#### Scenario: Sync operation logging
**Given** a role-to-job sync is triggered  
**When** the sync runs  
**Then** the system must log the start and end  
**And** log the number of jobs updated  
**And** log any errors encountered  
**And** make logs accessible to admins
