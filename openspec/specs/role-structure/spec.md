# role-structure Specification

## Purpose
TBD - created by archiving change implementar-banco-talentos. Update Purpose after archive.
## Requirements
### Requirement: Role Definition Scope
The Role definition MUST focus on technical and behavioral competencies and MUST NOT include salary ranges, as market rates fluctuate per vacancy.

#### Scenario: Defining a Role
- **WHEN** an Admin defines a Role (e.g., "Senior Designer")
- **THEN** the form DOES NOT request salary range information
- **AND** focuses on Mission, Responsibilities, and Skills

### Requirement: Extended Role Definition
The Role entity MUST encapsulate the complete technical and behavioral profile required for the function.

#### Scenario: Admin views detailed role
- **WHEN** an Admin views a Role detail
- **THEN** they see Mission, Responsibilities, Key Competencies, and KPIs
- **AND** the specific seniority level (Júnior, Pleno, or Sênior)

### Requirement: Role Immutability for Managers
Managers MUST NOT be able to alter the structural definitions of a Role.

#### Scenario: Manager attempts to edit role
- **WHEN** a user with `Manager` profile lists Roles
- **THEN** they can view details for selection
- **BUT** the "Edit" and "Create" actions are disabled or hidden

### Requirement: Role Standardization Levels
Roles MUST be classified by strict seniority levels to enable comparison and filtering.

#### Scenario: Filtering by seniority
- **WHEN** filtering Roles or Candidates
- **THEN** the system uses the standardized Enum values: Júnior, Pleno, Sênior

