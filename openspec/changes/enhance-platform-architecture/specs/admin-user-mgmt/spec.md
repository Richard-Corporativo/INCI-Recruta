# Capability: Admin Identity Management

## ADDED Requirements
### Requirement: Administrative User Creation
Administrators must be able to create new team members directly from the Settings panel without manual database intervention.

#### Scenario: Admin creates a new Manager
- **Given** an authenticated Administrator in the Settings > Users tab.
- **When** they fill the "Adicionar usuário" form with a name, email, and "Manager" role.
- **Then** the system calls the `create-user-admin` Edge Function.
- **Then** a new user is created in both the Auth and Public schemas.
- **Then** the user list refreshes to show the new Manager.

### Requirement: Role-Based Access Enforcement
The system must restrict administrative dashboard access to users with specific roles (Admin, Manager, Recruiter, etc.).

#### Scenario: Candidate attempts direct URL access to /admin
- **Given** an authenticated user with the 'candidate' role.
- **When** they attempt to navigate directly to `/admin/dashboard`.
- **Then** the system redirects them to `/candidate/dashboard` with a permission warning.
