# DESIGN: User Creation Management

## Architectural Overview
The user management logic resides in `useUsers.ts` and persists data in `localStorage`. The current `InviteUserModal` already performs a "direct create" by adding a user to the storage. We will refine this to distinguish between the two workflows in the UI.

## Component Changes

### 1. `Settings.tsx`
- Add a dropdown or split button to the "Adicionar usuário" button to select between "Convidar" and "Criar Diretamente".
- Alternatively, combine into a single modal with a toggle.

### 2. `UserModal.tsx` (Refactored from `InviteUserModal.tsx`)
- **State**: `mode` ('invite' | 'create').
- **Fields**: 
    - Same base fields (Name, Email, Role, Department).
    - If `mode === 'create'`, Password becomes mandatory and clearly labeled as "Set Password".
    - If `mode === 'invite'`, labeled as "Initial/Temporary Password".
- **Visuals**: Primary button label changes from "Convidar" to "Criar Conta".

### 3. `useUsers.ts` (Existing)
- The `addUser` hook is already sufficient as it takes a user object and persists it.

## User Flow
1. Admin clicks "Adicionar Usuário" in Settings.
2. Modal opens.
3. Admin chooses "Criar Diretamente".
4. Admin fills the form.
5. User is added to `localStorage`.
6. Admin sees the new user in the list with status "Ativo".

## Persistence
All users are stored in `recruitsys_users`.
