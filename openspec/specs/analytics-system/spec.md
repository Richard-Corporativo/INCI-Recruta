# analytics-system Specification

## Purpose
TBD - created by archiving change implementar-analytics-diversidade. Update Purpose after archive.
## Requirements
### Requirement: Segregated & Optional Collection
The system MUST collect diversity data (Gender, Race, PcD) in a segregated manner, strictly optional, ensuring no impact on the application process.

#### Scenario: Candidate applies
- **WHEN** a candidate reaches the Diversity step
- **THEN** fields for Gender, Race/Color (IBGE), and PcD are shown
- **AND** all default to "Prefer not to say" or remain empty
- **AND** a clear disclaimer about aggregated usage/LGPD is displayed

### Requirement: K-Anonymity & Aggregation
The system MUST NEVER display diversity data for groups smaller than 10 individuals in any dashboard view to preserve anonymity.

#### Scenario: Viewing Diversity Dashboard with low volume
- **WHEN** the Admin views the "Conversion by Race" chart
- **AND** the "Indigenous" group has only 4 candidates in the "Interview" stage
- **THEN** the system displays "Insufficient Data" or merges into "Other/Unknown" for that specific datapoint
- **AND** does NOT show the raw count or percentage.

### Requirement: Strict Access Control & Blocking
The system MUST prevent diversity data from leaking into operational views (Kanban, Profile, Lists).

#### Scenario: Recruiter evaluating
- **WHEN** a Recruiter opens a Candidate Card
- **THEN** no field related to Race, Gender or PcD is visible
- **AND** the network request for candidate details does NOT contain this payload.

### Requirement: Audit Logging
The system MUST log every access to the Diversity Dashboard.

#### Scenario: Admin checks metrics
- **WHEN** an Admin opens the Analytics page
- **THEN** an entry is created in `audit_logs` with who, when, and what filters were used.

