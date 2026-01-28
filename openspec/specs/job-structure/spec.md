# job-structure Specification

## Purpose
TBD - created by archiving change implementar-banco-talentos. Update Purpose after archive.
## Requirements
### Requirement: Job Salary Definition
The system MUST allow defining salary ranges (Min/Max) specifically at the Job (Vacancy) level, decoupling it from the Role definition.

#### Scenario: Recruiter sets salary for a job
- **WHEN** a Recruiter creates or edits a Job
- **THEN** they MUST be able to define specific `salary_min` and `salary_max` values
- **AND** these values apply only to this specific vacancy instance

### Requirement: Role Inheritance
The system MUST pre-fill Job details based on the selected Role but allow specific overrides for operational fields (like urgency, salary).

#### Scenario: Creating job from role
- **WHEN** a Recruiter selects a Role (e.g., "Frontend Developer")
- **THEN** the Job inherits technical requirements and mission
- **BUT** the Recruiter manually defines the budget (salary) for this opening

