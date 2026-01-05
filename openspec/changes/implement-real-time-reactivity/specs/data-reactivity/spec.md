# Spec Delta: Data Reactivity

## ADDED Requirements

### Requirement: Automatic UI Updates After Mutations
The system MUST automatically update the UI to reflect data changes without requiring manual page refreshes.

#### Scenario: User creates a new job
- **GIVEN** an admin user is on the jobs list page
- **WHEN** they create a new job via the "Create Job" form
- **THEN** the new job appears in the jobs list immediately
- **AND** no manual page refresh is required
- **AND** the job appears with all correct details

#### Scenario: Candidate applies to a job
- **GIVEN** a candidate submits a job application
- **WHEN** the application is successfully submitted
- **THEN** the candidate appears in the admin Kanban board immediately
- **AND** the candidate is in the "Received" column
- **AND** no manual refresh is required for admin to see the new candidate

#### Scenario: Admin moves candidate in Kanban
- **GIVEN** an admin is viewing the Kanban board
- **WHEN** they drag a candidate to a different column
- **THEN** the candidate stays in the new column immediately
- **AND** the position persists after page reload
- **AND** no manual refresh is required

#### Scenario: User updates data
- **GIVEN** a user updates any data (job, candidate, profile, etc.)
- **WHEN** the update is successfully saved
- **THEN** the changes reflect immediately in all relevant views
- **AND** no manual refresh is required

### Requirement: Optimistic UI Updates
The system MUST provide instant visual feedback for user actions before server confirmation.

#### Scenario: Drag-and-drop operations
- **GIVEN** a user performs a drag-and-drop operation
- **WHEN** they release the dragged item
- **THEN** the UI updates immediately to show the new position
- **AND** the change persists to the server in the background
- **AND** if the server operation fails, the UI reverts to the previous state

### Requirement: Error Handling for Failed Mutations
The system MUST handle mutation failures gracefully and inform the user.

#### Scenario: Mutation fails due to network error
- **GIVEN** a user performs a data-changing action
- **WHEN** the server request fails
- **THEN** the system displays an error notification
- **AND** any optimistic UI updates are reverted
- **AND** the user can retry the operation

## MODIFIED Requirements

### Requirement: Data Fetching
The system MUST fetch data on component mount AND automatically refetch after mutations to ensure UI consistency.

**Previous Behavior**: The system fetched data only on component mount.

**New Behavior**: The system MUST fetch data on component mount AND automatically refetch after mutations.

#### Scenario: Data refetch after mutation
- **GIVEN** a user performs a data-changing operation
- **WHEN** the operation completes successfully
- **THEN** the system automatically refetches affected data
- **AND** the UI updates to reflect the latest server state

## Performance Implications

### Network Efficiency
- Only refetch data that was actually changed
- Use optimistic updates to minimize perceived latency
- Batch multiple mutations when possible

### User Experience
- Instant feedback for all user actions
- No loading spinners for optimistic updates
- Clear error messages when operations fail

## Related Specifications
- `kanban-board`: Drag-and-drop candidate management
- `job-management`: Creating and editing jobs
- `candidate-portal`: Candidate applications and profile updates
