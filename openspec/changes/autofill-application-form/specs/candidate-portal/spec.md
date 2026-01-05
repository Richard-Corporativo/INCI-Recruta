# candidate-portal Specification Deltas

## MODIFIED Requirements

### Requirement: Job Application Flow
The system MUST allow authenticated candidates to submit their profiles and resumes to specific jobs.

#### Scenario: Authenticated user pre-fill
- **WHEN** an authenticated user clicks "Apply"
- **THEN** the application form is presented with Name, Email, and Phone pre-filled
- **AND** the Password creation fields are hidden
- **AND** a "Logged in as {User.name}" indicator is visible

#### Scenario: Authenticated user submission
- **WHEN** an authenticated user submits the application
- **THEN** the system validates the form without requiring password
- **AND** a new `Candidate` record is created (if one doesn't exist for this job) linked to the existing `User` ID
- **AND** the user is NOT re-registered
