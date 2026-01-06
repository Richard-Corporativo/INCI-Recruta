# Capability: Settings Module Logic

## ADDED Requirements
### Requirement: Granular Manager Scope
Admins must be able to restrict which data a Manager can see based on departmental boundaries.

#### Scenario: Admin restricts Manager to 'Tech' department
- **Given** an Admin in the 'Escopo do Gestor' tab.
- **When** they select a Manager and check the 'Tecnologia' department.
- **Then** that Manager, when logged in, only sees jobs and candidates belonging to the 'Tecnologia' department.

### Requirement: System Configuration Management
Global system parameters should be editable by Administrators.

#### Scenario: Admin changes company branding
- **Given** an Admin in the 'Sistema' tab.
- **When** they update the company name and primary color.
- **Then** the entire platform (public and admin) reflects the new branding values immediately.
