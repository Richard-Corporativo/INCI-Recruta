# Tasks: add-entity-deletion-ui-refresh

## 1. Core Data Capabilities
- [x] Update `useUsers.ts`: Implement `deleteUser` function.
- [x] Update `useCandidates.ts`: Implement `deleteCandidate` function.

## 2. Settings (Users) Update
- [x] In `Settings.tsx`, add "Excluir" button to user table.
- [x] Connect "Excluir" to `ConfirmationModal`.
- [x] Call `deleteUser` on confirmation.

## 3. Jobs Deletion Check
- [x] Verify `deleteJob` is used in `Jobs.tsx` (or add UI trigger if missing).

## 4. Candidate Profile Redesign (The Big One)
- [x] Scaffold new layout in `CandidateProfileDrawer.tsx` based on HTML proposal.
    - [x] Header with detailed info.
    - [x] "Job Info" grid section.
    - [x] "Timeline" component (visualize columns as steps).
- [x] Implement Tabs (Interviews / Audit).
    - [x] Mock/Adapt "Entrevistas" view with dummy cards or real data if available.
- [x] Implement Footer Actions.
    - [x] "Reprovar" -> Trigger Deletion Modal.
- [x] Connect Footer Buttons to actions:
    - [x] Schedule -> `ScheduleInterviewModal`
    - [x] Move -> `MoveStageModal` (Implemented with Portal for z-index fix)
    - [x] Approve -> Move to 'finalist' (Placeholder logic implemented)

## 5. Validation
- [x] Test creating multiple users/candidates and deleting them.
- [x] Verify Candidate Profile responsiveness and data mapping.
