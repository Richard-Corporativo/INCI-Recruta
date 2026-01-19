# Settings Persistence

## ADDED Requirements

### Requirement: Configurable Global Permissions
The system MUST support configurable global permissions for manager actions, persisting these choices across sessions.

#### Scenario: Global Manager Permissions
- **Given** I am an Admin on the Settings page > Privileges tab
- **When** I toggle "Mover candidato para Finalista" to OFF
- **Then** the setting should be saved to storage
- **And** it should persist after a page reload
- **And** Managers should globally lose the ability to move candidates to the Finalist stage (unless overridden)

### Requirement: User Scope Configuration
The system MUST allow per-user configuration of vacancy visibility and specific action permissions.

#### Scenario: Manager Scope Configuration
- **Given** I am an Admin on the Settings page > Manager Scope tab
- **And** I have selected a Manager "John Doe"
- **When** I select "Também pode ver vagas do seu departamento"
- **And** I add "Marketing" to the Allowed Departments
- **Then** the "John Doe" user record should be updated with these scope settings
- **And** this configuration should persist

#### Scenario: Default Audit Logs
- **Given** I change a permission setting
- **Then** an audit log entry should be created (Optional for this iteration but desirable)
