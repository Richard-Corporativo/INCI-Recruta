## ADDED Requirements
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
