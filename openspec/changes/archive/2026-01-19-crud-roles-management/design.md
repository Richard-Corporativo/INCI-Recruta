# DESIGN: CRUD Roles Management

## Architectural Overview
The implementation follows the existing pattern for manageable entities (like Jobs). Data is persisted in `localStorage` via the `StorageService`.

## Component Structure

### 1. `useRoles` Hook (MODIFIED)
- **State**: Manages the list of roles.
- **Functions**:
    - `addRole`: (Existing) Adds a new role.
    - `updateRole`: Finds a role by ID and replaces its data.
    - `deleteRole`: Filters out a role by ID from the list.

### 2. `EditRole.tsx` (NEW)
- Fetches the role data based on the ID from the URL.
- Reuses the form structure from `CreateRole.tsx`.
- Populates form fields with current role data.
- Triggers `updateRole` on submission.

### 3. `Roles.tsx` (MODIFIED)
- Updates the "Edit" button to navigate to `/roles/:id/edit`.
- Updates the "Delete" button to trigger a confirmation flow.
- Triggers `deleteRole` upon confirmation.

## Data Persistence
Roles are stored in `localStorage` under the key `recruitsys_roles`. All updates and deletions will be immediately reflected in this key.

## Trade-offs and Considerations
- **Form Reuse**: While `CreateRole` and `EditRole` share 90% logic, we will create a dedicated `EditRole` page for simplicity in this proposal, following the project's current pattern (e.g., `CreateJob` vs `EditJob`). Refactoring into a shared `RoleForm` component could be considered if more entities are added.
- **Delete Impact**: Deleting a role doesn't currently check for dependencies (e.g., if a Job is linked to a Role). This is acceptable for the current system scope but should be noted for future expansion.
