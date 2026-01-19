## ADDED Requirements
### Requirement: Universal Candidate Search
The system MUST provide a unified search interface to query both job-specific applicants and the talent pool.

#### Scenario: Filtering by skills and experience
- **WHEN** a Recruiter uses the Advanced Search
- **AND** selects "JavaScript" (Skill) and "Sênior" (Level)
- **THEN** the system returns matching candidates from ALL sources (specific jobs + talent pool)

### Requirement: Candidate Invite
Recruiters MUST be able to invite a candidate from the search results to apply for a specific vacancy.

#### Scenario: Inviting a candidate
- **WHEN** a Recruiter finds a candidate in the search
- **THEN** they can select "Link to Job"
- **AND** the candidate becomes associated with that Job's pipeline
