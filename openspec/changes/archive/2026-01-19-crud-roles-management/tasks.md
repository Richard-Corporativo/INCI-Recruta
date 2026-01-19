# TASKS: CRUD Roles Management

## Preparation
- [x] Review current `Roles.tsx` and `useRoles.ts` implementation. <!-- id: 0 -->

## Core Logic
- [x] Implement `updateRole` in `hooks/useRoles.ts`. <!-- id: 1 -->
- [x] Implement `deleteRole` in `hooks/useRoles.ts`. <!-- id: 2 -->

## UI Components
- [x] Create `pages/EditRole.tsx` by adapting `CreateRole.tsx`. <!-- id: 3 -->
- [x] Register `/roles/:id/edit` route in `App.tsx`. <!-- id: 4 -->
- [x] Update `pages/Roles.tsx` to link "Edit" button to the edit page. <!-- id: 5 -->
- [x] Implement deletion confirmation in `pages/Roles.tsx`. <!-- id: 6 -->

## Validation
- [x] Verify that editing a role updates both the UI and `localStorage`. <!-- id: 7 -->
- [x] Verify that deleting a role removes it from the list and `localStorage`. <!-- id: 8 -->
- [x] Ensure navigation works correctly after saving or canceling an edit. <!-- id: 9 -->
