## MODIFIED Requirements
### Requirement: Administrative Portal Access
The system SHALL provide a centralized administrative portal for managing recruitment processes, including jobs, candidates, and system settings.

#### Scenario: Ported implementation access
- **WHEN** an administrator navigates to `/admin/dashboard`
- **THEN** they MUST see the fully implemented dashboard with real-time statistics and navigation.

#### Scenario: Job Management Functional
- **WHEN** an administrator views the jobs listing or kanban
- **THEN** they MUST be able to manage candidate status transitions and job details.

#### Scenario: Role Management Parity
- **WHEN** an administrator creates or edits a role
- **THEN** the interface MUST support full requirement definition and configuration as per the standalone implementation.
