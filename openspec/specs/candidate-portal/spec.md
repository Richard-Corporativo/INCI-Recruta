# candidate-portal Specification

## Purpose
TBD - created by archiving change plan-portal-candidato. Update Purpose after archive.
## Requirements
### Requirement: Public Job Listing
The system MUST provide a publicly accessible list of all open positions.

#### Scenario: User browses jobs
- **WHEN** user navigates to `/vagas`
- **THEN** the system displays a grid of all jobs with 'Open' status
- **AND** allows filtering by category or model (Remote/Hybrid)

### Requirement: Job Application Flow
The system MUST allow authenticated candidates to submit their profiles and resumes to specific jobs.

#### Scenario: User applies for job
- **WHEN** an authenticated user clicks "Apply" on a job page
- **THEN** their profile data and resume link are attached to the job
- **AND** a new application record is created at the first stage of the Kanban

### Requirement: Status Tracking
The system MUST provide a visual progress indicator for candidates to follow their application journey.

#### Scenario: Status update reflected
- **WHEN** a recruiter moves a candidate's card in the Admin Kanban
- **THEN** the candidate's dashboard reflects the new stage (e.g., 'Interview' or 'Feedback')
- **AND** a notification is generated

