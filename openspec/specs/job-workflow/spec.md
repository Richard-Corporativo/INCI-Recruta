# job-workflow Specification

## Purpose
TBD - created by archiving change implementar-workflow-vagas. Update Purpose after archive.
## Requirements
### Requirement: Job Approval Lifecycle
Jobs MUST follow a strict approval workflow before becoming public.

#### Scenario: Manager requests approval
- **WHEN** a Manager creates a Job
- **THEN** the status defaults to `Rascunho`
- **AND** they can only transition it to `Pendente Aprovação`

#### Scenario: Quality approves job
- **WHEN** a Quality/Admin user reviews a `Pendente Aprovação` Job
- **THEN** they can approve it to `Publicada`
- **AND** the job becomes visible in the Public Portal

### Requirement: Granular Audit Logging
The system MUST record detailed differences (diffs) for every change in Jobs and Roles.

#### Scenario: Auditing a salary change
- **WHEN** a user changes a Job's salary
- **THEN** the system logs the event
- **AND** captures specifically: "Salary changed from 5000 to 6000"

