# ui-fixes Specification

## Purpose
TBD - created by archiving change improve-backup-and-ui-consistency. Update Purpose after archive.
## Requirements
### Requirement: Interactive Dashboard Controls
All filters and action buttons on the Dashboard SHALL be functional and provide visual feedback.

#### Scenario: Filtering by KPI click
- **WHEN** the user clicks on a KPI card (e.g., "Vagas em Atraso")
- **THEN** the job list below is automatically filtered to show only jobs matching that criteria

### Requirement: Kanban Action Execution
The Kanban board SHALL allow direct execution of hiring, rejection, and stage advancement actions.

#### Scenario: Hiring a finalist
- **WHEN** the user clicks "Contratar" on a candidate card in the Finalist column
- **THEN** the candidate's status is updated to "Contratado"
- **AND** they are moved to the "Hired" column
- **AND** a success notification is shown

### Requirement: Language Consistency
All user-facing text and controls SHALL be in Portuguese (Brazil).

#### Scenario: Standardized terms
- **WHEN** viewing any page
- **THEN** terms like "Match" should appear as "Compatibilidade" or "Aderência"
- **AND** "Action Required" should appear as "Ação Necessária"

