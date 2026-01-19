# SPEC: User Creation & Invitation

This specification defines the requirements for managing user onboarding through invitation and direct creation.

## ADDED Requirements

### Requirement: [REQ-USER-001] Direct User Creation
The system MUST allow administrators to create a user account directly without requiring an invitation acceptance flow.

#### Scenario: Create user directly
- **Given** the administrator is on the "Usuários" tab in Settings.
- **When** the administrator clicks to add a user and selects "Criar Diretamente".
- **And** the administrator fills in Name, Email, Role, Department, and Password.
- **Then** the system MUST save the user with status "Ativo" in `localStorage`.
- **And** the new user MUST appear in the user list immediately.

### Requirement: [REQ-USER-002] User Invitation
The system MUST allow administrators to invite a user to the platform.

#### Scenario: Invite user
- **Given** the administrator selects the "Convidar" mode in the User Modal.
- **When** the administrator specifies the user's email and role.
- **Then** the system MUST simulate sending a message and create the user in the system.

## MODIFIED Requirements

### Requirement: [REQ-USER-LIST-001] User Management Interface
The user management interface MUST provide access to all onboarding methods.

#### Scenario: User Modal Modes
- **Given** the User Modal is open.
- **When** the modal is displayed.
- **Then** it MUST provide a clear choice between "Convidar Usuário" and "Criar Conta Diretamente".
