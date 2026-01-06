# Spec: Admin Security

## ADDED Requirements

### Secure Admin Access
The system MUST protect admin routes by obscuring the login URL from unauthenticated users.

#### Scenario: Unauthenticated User Accesses Admin Route
- Given an unauthenticated user (or candidate)
- When they attempt to navigate to `/jobs` or `/admin/dashboard`
- Then they should be redirected to the 404 Not Found page
- And the browser URL should update to `/404` (or similar)
- And the existence of `/admin/login` should not be revealed

#### Scenario: Unauthenticated User Accesses Admin Login
- Given an unauthenticated user
- When they manually navigate to `/admin/login`
- Then they should see the Admin Login form

#### Scenario: Candidate Accesses Admin Route
- Given a logged-in Candidate user
- When they attempt to navigate to `/admin/dashboard`
- Then they should be redirected to `/candidate/dashboard` (existing behavior, but reinforced)

## MODIFIED Requirements

### Update `RequireAuth` Logic
This component currently redirects all unauthenticated traffic to `/admin/login`. We will change this to redirect to a neutral page.

#### Scenario: Redirect to 404
- Given an unauthenticated visitor
- When they try to access `/jobs` or `/settings`
- Then they should be redirected to `/404` or `/`
- And they should NOT see the Admin Login form
