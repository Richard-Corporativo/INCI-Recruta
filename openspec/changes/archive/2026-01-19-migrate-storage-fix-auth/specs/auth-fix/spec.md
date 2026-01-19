# Spec: Auth Fix for User Updates

## ADDED Requirements

### Requirement: Edge Function Authentication
The system MUST include a valid Bearer token when calling administrative Edge Functions to prevent unauthorized access errors.

#### Scenario: Admin Updates User
- **GIVEN** an admin user is logged in
- **WHEN** they submit the "Edit User" form
- **THEN** the system retrieves the current session access token
- **AND** includes it in the Authorization header of the Edge Function call
- **AND** the function executes successfully without a 401 error.
