# Proposal: Disable Email Confirmation for Candidates

## Problem Statement
Candidates are unable to access their accounts after registration because they are stuck in a loading state waiting for email confirmation. This creates friction in the user onboarding process and prevents candidates from immediately accessing the platform after signing up.

## Current Behavior
1. Candidate registers via `/cadastro`
2. Supabase sends confirmation email
3. `RequireCandidateAuth` guard checks `isEmailConfirmed`
4. If email not confirmed, user is redirected to `/verificar-email`
5. User cannot access `/candidate/dashboard` until email is confirmed
6. This causes a loading loop or stuck state

## Proposed Solution
**Disable email confirmation requirement for candidates only**, while maintaining it for administrative users (admin, manager, recruiter, quality, dp) for security purposes.

### Rationale
- **Candidates**: Low security risk, need immediate access to track applications
- **Admin Users**: High security risk, should verify email for account security
- **User Experience**: Candidates should have frictionless onboarding
- **Business Impact**: Reduces drop-off rate in candidate registration flow

## Implementation Approach
1. Configure Supabase Auth to disable email confirmation for new signups
2. Remove email confirmation check from `RequireCandidateAuth` guard
3. Update registration flow to log users in immediately after signup
4. Keep `/verificar-email` page for edge cases but don't enforce it

## Impact Assessment
- **Security**: Minimal - candidates only access their own data
- **UX**: Significant improvement - immediate access after registration
- **Maintenance**: Simplified auth flow for candidates
- **Admin Users**: No change - they use separate login flow

## Success Criteria
- Candidates can access `/candidate/dashboard` immediately after registration
- No loading loops or stuck states
- Admin users maintain existing security requirements
- Email confirmation page remains available but optional
