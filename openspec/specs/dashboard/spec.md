# dashboard Specification

## Purpose
TBD - created by archiving change remove-mock-data. Update Purpose after archive.
## Requirements
### Requirement: Average hire time calculation should handle empty data
#### Scenario: No hired candidates exist
- GIVEN there are no candidates in the 'hired' status
- WHEN the dashboard calculates the average hire time
- THEN it should return 0 (zero) instead of a mock value
- AND the metric should display "0 dias corridos" or an appropriate empty state message

#### Scenario: Hired candidates without complete timestamps
- GIVEN there are hired candidates
- BUT some are missing `applied_at` or `hired_at` timestamps
- WHEN calculating average hire time
- THEN only candidates with both timestamps should be included in the calculation
- AND the result should be mathematically accurate

### Requirement: Dashboard should display empty states gracefully
#### Scenario: No jobs exist
- GIVEN there are no jobs in the system
- WHEN viewing the dashboard
- THEN the "Vagas Abertas" metric should show 0
- AND the jobs table should display an appropriate empty state

#### Scenario: No candidates exist
- GIVEN there are no candidates in the system
- WHEN viewing the dashboard
- THEN the "Candidatos Ativos" metric should show 0
- AND the recent candidates section should display an appropriate empty state

