# Spec Delta: Admin Authorization

## MODIFIED Requirements

### Requirement: Admin Route Protection
The system MUST restrict access to administrative routes based on user roles, preventing candidates from accessing administrative functionality.

#### Scenario: Candidate attempts admin access
- **GIVEN** a user is authenticated with role 'candidate'
- **WHEN** they attempt to navigate to any administrative route (`/admin/*`, `/jobs/*`, `/settings/*`, `/talent-bank`, `/audit`)
- **THEN** the system redirects them to `/candidate/dashboard`
- **AND** displays no administrative interface elements

#### Scenario: Admin user accesses admin routes
- **GIVEN** a user is authenticated with role 'admin', 'manager', 'recruiter', 'quality', or 'dp'
- **WHEN** they navigate to any administrative route
- **THEN** the system grants access and displays the requested page
- **AND** all administrative functionality is available

#### Scenario: Unauthenticated user attempts admin access
- **GIVEN** a user is not authenticated
- **WHEN** they attempt to navigate to any administrative route
- **THEN** the system redirects them to `/admin/login`
- **AND** preserves the intended destination for post-login redirect

## ADDED Requirements

### Requirement: Role-Based Access Control
The system MUST implement role-based access control (RBAC) for all protected routes.

#### Scenario: Role validation on route access
- **GIVEN** a user is authenticated
- **WHEN** they access a protected route
- **THEN** the system validates their role against allowed roles for that route
- **AND** grants or denies access accordingly

#### Scenario: Administrative roles definition
- **GIVEN** the system defines administrative roles
- **THEN** the following roles MUST have administrative access: 'admin', 'manager', 'recruiter', 'quality', 'dp'
- **AND** the role 'candidate' MUST NOT have administrative access

## Security Implications

### Defense Layers
1. **Route Guard**: Frontend `RequireAuth` component validates role
2. **RLS Policies**: Database-level access control via Supabase RLS
3. **API Validation**: Server-side role validation in Edge Functions

### Threat Model
- **Threat**: Authenticated candidate accessing admin routes via URL manipulation
- **Mitigation**: Role validation in `RequireAuth` guard
- **Residual Risk**: None - multi-layer defense

## Related Specifications
- `candidate-portal`: Defines candidate-specific routes and access
- `persistence`: Defines user role schema and validation
