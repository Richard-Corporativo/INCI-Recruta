# Proposal: Fix Admin Role Authorization

## Problem Statement
**CRITICAL SECURITY VULNERABILITY**: Candidates with authenticated accounts can currently access all administrative routes (`/admin/*`, `/jobs/*`, `/settings/*`, etc.) because the `RequireAuth` guard only checks authentication status, not user roles.

## Root Cause
The `RequireAuth` component in `App.tsx` (lines 45-52) validates only `isAuthenticated` but does not verify that the user has an administrative role (admin, manager, recruiter, quality, or dp). This allows any authenticated user, including candidates, to access sensitive administrative functionality.

## Proposed Solution
1. **Enhance `RequireAuth` guard** to validate user role and block candidates from admin routes
2. **Add explicit role checking** to ensure only users with administrative roles can access protected routes
3. **Redirect unauthorized users** to appropriate pages based on their role

## Impact
- **Security**: Prevents unauthorized access to administrative functions
- **Data Protection**: Protects sensitive recruitment data from candidate access
- **User Experience**: Ensures users are directed to their appropriate portals

## Success Criteria
- Candidates cannot access any `/admin/*`, `/jobs/*`, `/settings/*`, or other administrative routes
- Attempting to access admin routes as a candidate redirects to `/candidate/dashboard`
- Admin users can still access all administrative routes normally
- No regression in existing authentication flows
