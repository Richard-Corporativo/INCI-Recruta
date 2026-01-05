# Spec Delta: Candidate Authentication

## MODIFIED Requirements

### Requirement: Candidate Registration Flow
The system MUST allow candidates to register and immediately access their dashboard without email confirmation.

#### Scenario: Candidate registers successfully
- **GIVEN** a user fills out the candidate registration form
- **WHEN** they submit valid credentials
- **THEN** the system creates their account
- **AND** automatically logs them in
- **AND** redirects them to `/candidate/dashboard`
- **AND** does NOT require email confirmation

#### Scenario: Candidate accesses protected routes
- **GIVEN** a candidate is authenticated
- **WHEN** they navigate to `/candidate/*` routes
- **THEN** the system grants access immediately
- **AND** does NOT check email confirmation status

### Requirement: Email Confirmation Optional
Email confirmation MUST be optional for candidate accounts.

#### Scenario: Candidate with unconfirmed email accesses dashboard
- **GIVEN** a candidate account exists with unconfirmed email
- **WHEN** the candidate logs in
- **THEN** they can access `/candidate/dashboard`
- **AND** they can view and manage their applications
- **AND** no blocking message about email confirmation appears

## REMOVED Requirements

### Requirement: Email Confirmation Required (REMOVED)
~~The system MUST require email confirmation before granting access to candidate routes.~~

**Reason for Removal**: Creates friction in candidate onboarding and causes loading loops. Email confirmation provides minimal security benefit for candidate accounts which only access their own data.

## Security Implications

### Threat Model
- **Threat**: Fake email addresses used for spam registrations
- **Mitigation**: Rate limiting on signup endpoint, RLS policies prevent data access
- **Residual Risk**: Low - candidates can only see their own applications

### Data Access
Candidates with unconfirmed emails can:
- ✅ View their own applications
- ✅ Update their own profile
- ✅ Apply to jobs
- ❌ Access other candidates' data (RLS enforced)
- ❌ Access admin routes (role-based guard enforced)

## Related Specifications
- `candidate-portal`: Defines candidate dashboard and application tracking
- `admin-authorization`: Ensures candidates cannot access admin routes
