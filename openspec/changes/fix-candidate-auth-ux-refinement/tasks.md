# Tasks: Fix Candidate Auth & UX Refinement

## Infrastructure (Database)
- [x] Create SQL migration for `handle_new_user` trigger.
- [x] Apply the migration to the database via `supabase` tool or SQL execution.

## Core UI Components
- [x] Implement `Toast` component in `components/ui/Toast.tsx`.
- [x] Create `ToastContext` and `ToastProvider`.
- [x] Wrap `App` in `ToastProvider`.

## Authentication Logic Updates
- [x] Update `AuthContext` to expose `v` flag (verification status) or `emailConfirmed`.
- [x] Update `RequireCandidateAuth` to redirect unverified users to a `/verify-email` info page.
- [x] Create `/verify-email` page with "Resend" option.

## Refine Registration Flow
- [x] Update `CandidateRegister` to remove manual `insert` calls (handled by trigger).
- [x] Update `CandidateRegister` to show "Check Email" state on success using `Toast` and local state.
- [x] Replace all `alert()` calls in `CandidateLogin`, `CandidateRegister`, and `JobApplication` with `toast()`.

## UX & Feedback Improvements
- [x] Implement Skeleton states in `CandidateDashboard.tsx`.
- [x] Implement Skeleton states in `MyApplications.tsx`.
- [x] Ensure all buttons show a loading spinner/state during async operations (verify consistency).
- [x] Add smooth transitions between loading and data states.
