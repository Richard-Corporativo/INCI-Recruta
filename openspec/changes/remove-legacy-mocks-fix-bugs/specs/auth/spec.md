# Spec: Authentication

## MODIFIED Requirements

### Req: Dynamic Login Validation
The system must validate login credentials against the user database stored in `localStorage`.

#### Scenario: Successful Login
- **Given** a user "test@company.com" exists in `localStorage` with password "secret123".
- **When** the user submits these credentials on the Login page.
- **Then** the system should generate a session token and redirect to the Dashboard.

#### Scenario: Inactive User Login
- **Given** a user "suspended@company.com" exists but has status "suspended".
- **When** they attempt to login.
- **Then** the system should show an "Acesso Negado" error message.

### Req: Current User Context
The application must provide a global context containing the currently authenticated user.

#### Scenario: Sidebar Integration
- **Given** "Carlos Souza" is the logged-in user.
- **Then** the Sidebar should display "Carlos Souza" and his avatar initials.
