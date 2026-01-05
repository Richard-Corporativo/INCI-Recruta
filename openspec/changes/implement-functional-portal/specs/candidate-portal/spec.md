## MODIFIED Requirements
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
