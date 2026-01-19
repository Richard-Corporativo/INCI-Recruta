# TASKS: User Creation Management

## Component Implementation
- [x] Rename `components/InviteUserModal.tsx` to `components/UserModal.tsx` and refactor to support "Invite" and "Create" modes. <!-- id: 0 -->
- [x] Update imports of `InviteUserModal` to `UserModal` in `Settings.tsx`. <!-- id: 1 -->
- [x] Implement mode selection in `UserModal` (toggle or tab). <!-- id: 2 -->
- [x] Ensure `useUsers.addUser` correctly handles the new user data. <!-- id: 3 -->

## UI Enhancements
- [x] Update the user list in `Settings.tsx` to show a success feedback (toast or message) after creation. <!-- id: 4 -->
- [x] Add the Department field to `UserModal` for better profile completion. <!-- id: 5 -->

## Validation
- [x] Verify that "Criar Diretamente" adds an active user to the list. <!-- id: 6 -->
- [x] Verify that the temporary password works (can be tested by logging out and trying the new credentials). <!-- id: 7 -->
