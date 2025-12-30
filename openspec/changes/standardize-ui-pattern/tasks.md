# TASKS: Standardize UI Patterns

## Common Components
- [x] Create `components/BaseModal.tsx`. <!-- id: 0 -->
- [x] Create `components/ConfirmationModal.tsx`. <!-- id: 1 -->
- [x] Create `components/Toast.tsx` for feedback. <!-- id: 2 -->

## Migration: Confirmations
- [x] Replace `window.confirm` in `pages/Roles.tsx` with `ConfirmationModal`. <!-- id: 3 -->
- [x] Replace `window.confirm` in `hooks/useJobs.ts` or related pages (if found). <!-- id: 4 -->

## Migration: Alerts
- [x] Replace `alert` in `components/UserModal.tsx` with `Toast`. <!-- id: 5 -->

## Refactoring: Modals
- [x] Update `components/UserModal.tsx` to use `BaseModal`. <!-- id: 6 -->
- [x] Update `components/MoveStageModal.tsx` to use `BaseModal`. <!-- id: 7 -->
- [x] Update `components/InterviewFeedbackModal.tsx` to use `BaseModal`. <!-- id: 8 -->
- [x] Update `components/ScheduleInterviewModal.tsx` to use `BaseModal`. <!-- id: 9 -->

## Validation
- [x] Verify that all modals look identical in terms of overlay and container style. <!-- id: 10 -->
- [x] Verify that dark mode is correctly applied across all new UI components. <!-- id: 11 -->
- [x] Ensure keyboard interaction (Escape to close) works on all modals. <!-- id: 12 -->
