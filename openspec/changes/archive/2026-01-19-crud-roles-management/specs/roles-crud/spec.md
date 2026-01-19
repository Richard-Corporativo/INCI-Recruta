# SPEC: Roles CRUD Management

This spec defines the requirements for managing roles (Cargos) in the recruitment system, specifically adding update and delete capabilities.

## MODIFIED Requirements

### Requirement: [REQ-ROLE-CRUD-001] Role Management UI
The system MUST provide a user interface to manage the lifecycle of roles.

#### Scenario: List Roles
- **Given** there are existing roles in the system.
- **When** the user navigates to the "Listagem de Cargos" page.
- **Then** the roles MUST be displayed in a table with columns for Title, Department, Area, Open Positions, Status, and Actions.
- **And** each row MUST display an "Edit" and a "Delete" action.

#### Scenario: Edit Role
- **Given** the user is on the "Listagem de Cargos" page.
- **When** the user clicks the "Edit" button for a specific role.
- **Then** the system MUST redirect the user to the "Edit Role" page.
- **And** the form MUST be pre-filled with the current data of the selected role.
- **When** the user modifies the fields and clicks "Save".
- **Then** the system MUST update the role in storage and redirect back to the list.

#### Scenario: Delete Role
- **Given** the user is on the "Listagem de Cargos" page.
- **When** the user clicks the "Delete" button for a specific role.
- **Then** the system MUST display a confirmation dialog.
- **When** the user confirms the deletion.
- **Then** the system MUST remove the role from storage and update the list.

### Requirement: [REQ-ROLE-CRUD-002] Role Data Persistence
The system MUST persist changes to roles in the local browser storage.

#### Scenario: Persist Updated Role
- **Given** a user has modified a role's information.
- **When** the "Save" action is triggered.
- **Then** the entry in `localStorage` under `recruitsys_roles` MUST be updated with the new values.
- **And** the `updated_at` field MUST reflect the current relative time (e.g., "Hoje").

#### Scenario: Persist Role Deletion
- **Given** a user has confirmed the deletion of a role.
- **When** the deletion process is completed.
- **Then** the role's ID MUST no longer exist in the `localStorage` data for `recruitsys_roles`.
