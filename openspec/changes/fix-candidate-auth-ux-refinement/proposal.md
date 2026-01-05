# Proposal: Fix Candidate Auth & UX Refinement

## Summary
Refine the candidate experience by fixing the registration process, implementing a premium notification system, and clarifying the email verification flow. This proposal addresses the "blueprint" for high-quality UX by ensuring immediate clarity, robust feedback, and professional aesthetics.

## Proposed Changes

### Authentication & Registration
- **Stable Provisioning**: Move user/candidate profile creation to a database trigger triggered by Supabase Auth signups.
- **Verification Awareness**: Add a "Confirmation Required" state to the portal.
- **Improved Register Flow**: Clear success feedback after registration with instructions for email verification.

### User Interface (UX/UI)
- **Toast Notifications**: Replace browser `alert()` with a custom UI notification system.
- **Loading States**: Add premium Skeleton loaders for dashboard and application lists.
- **Data Treatment**: Refine async data loading indicators across the candidate area.

### Fixes
- Fix the issue where account creation fails due to RLS/Incomplete sign-up flow.
- Remove browser-native modals.

## Success Criteria
- Candidates can register without errors.
- A "Check your email" message is shown after registration.
- Unverified users see a placeholder screen instead of an empty dashboard.
- All primary actions (Login, Register, Apply) provide non-blocking UI feedback.
