# candidate-portal Specification

## Purpose
TBD - created by archiving change plan-portal-candidato. Update Purpose after archive.
## Requirements
### Requirement: Public Job Listing
The system MUST provide a publicly accessible list of all open positions synchronized with the Admin panel.

#### Scenario: User browses real jobs
- **WHEN** a recruiter creates a job in the Admin panel
- **AND** a user navigates to `/vagas`
- **THEN** the system displays the newly created job
- **AND** allows filtering by category or model (Remote/Hybrid)

### Requirement: Job Application Flow
The system MUST allow candidates to submit their profiles and resumes, persisting the application in the shared storage and linking it to the specific job.

#### Scenario: User applies for job and appears in Kanban
- **WHEN** a candidate submits the application form on `/vagas/:id/candidatar`
- **THEN** a new `Candidate` record is saved in `localStorage`
- **AND** the recruiter sees the new candidate in the "Received" column of the respective job's Kanban

### Requirement: Status Tracking
The system MUST provide a real-time progress indicator for candidates based on Admin Kanban stages.

#### Scenario: Stage change reflection
- **WHEN** a recruiter moves a candidate's card in the Admin Kanban
- **THEN** the candidate's dashboard reflects the new stage immediately upon refresh or navigation

### Requirement: Spontaneous Candidacy
The system MUST allow candidates to register their profiles without linking to a specific job opening (Job ID).

#### Scenario: User registers in Talent Pool
- **WHEN** a user navigates to `/talentos` (or equivalent "Register CV" route)
- **AND** submits the profile form without a job context
- **THEN** the system creates a candidate record with `job_id` as NULL
- **AND** the candidate appears in the global "Talent Bank" view for recruiters

### Requirement: Talent Pool Visibility
Candidates in the Talent Pool MUST be searchable and viewable across the system, independent of specific job pipelines.

#### Scenario: Recruiter searches talent pool
- **WHEN** a Recruiter accesses the "Talent Bank" or "All Candidates" view
- **THEN** they can see candidates who applied spontaneously
- **AND** can filter them alongside job-specific applicants

