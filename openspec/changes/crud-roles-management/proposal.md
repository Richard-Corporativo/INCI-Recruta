# PROPOSAL: CRUD Roles Management

This proposal outlines the implementation of complete CRUD (Create, Read, Update, Delete) operations for the "Cargos" (Roles) entity within the recruitment system. Currently, only listing and creation are supported. We will add editing and deletion capabilities.

## User Value
- **Flexibility**: Administrators can correct mistakes in role definitions without having to recreate them.
- **Maintenance**: Deprecated or unused roles can be removed to keep the system organized.
- **Workflow Efficiency**: A consistent management experience across all system entities (Jobs, Users, Roles).

## Scope
- Implement `updateRole` and `deleteRole` functions in the `useRoles` hook.
- Create an `EditRole.tsx` page to handle the update process.
- Enhance `Roles.tsx` list with functional "Edit" and "Delete" actions.
- Implement a confirmation modal for role deletion.

## Non-Goals
- Complex permission checks (scoped to future roles/permissions work).
- Batch deletion of roles.
- Role duplication.

## Dependencies
- `useRoles` hook.
- `StorageService` for data persistence.
- `Breadcrumbs` component for navigation.
