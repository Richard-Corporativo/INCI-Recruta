# process-intelligence Specification

## Purpose
TBD - created by archiving change implementar-sla-forecast. Update Purpose after archive.
## Requirements
### Requirement: Time Tracking per Stage
The system MUST track exactly when a candidate enters and leaves each stage of the recruitment process to calculate cycle times.

#### Scenario: Candidate moves stage
- **WHEN** a candidate is moved from "Screnning" to "Interview"
- **THEN** the system records the exit time for "Screening"
- **AND** records the entry time for "Interview"

### Requirement: SLA Visual Indicators
The UI MUST provide visual cues (Traffic Light system) on candidate cards based on the configured SLA for the current stage.

#### Scenario: Card expired
- **WHEN** a candidate has been in "Triagem" for 3 days
- **AND** the SLA for "Triagem" is 2 days
- **THEN** the card displays a RED alert/border indicating "Atrasado"

### Requirement: Recruitment Forecast
The system MUST estimate the completion date for a vacancy based on historical average times of remaining stages.

#### Scenario: Manager views job dashboard
- **WHEN** a Manager views an active Job
- **THEN** the system displays "Estimated Closing Date" calculated from current pipeline velocity

