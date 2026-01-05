# Design: Admin Settings Implementation

## Data Models

### SystemGlobalSettings
Located in `localStorage` key `recruitsys_settings`.

```typescript
interface SystemSettings {
  manager_permissions: {
    move_to_finalist: boolean; // default: true
    mark_not_selected: boolean; // default: true
    return_candidate_stage: boolean; // default: false
    close_job: boolean; // default: false
  };
}
```

### User Extensions
Extending `User` interface in `types.ts`.

```typescript
interface User {
  // ... existing fields
  scope?: {
    vacancy_view_type: 'direct' | 'department';
    allowed_departments: string[];
    allowed_role_codes?: string[]; // Optional catalog restriction
  };
  custom_permissions?: {
    close_job?: boolean;
    approve_finalist?: boolean;
    register_feedback?: boolean;
    view_salaries?: boolean; // Restricted by default
  };
}
```

## Component Architecture

### `Settings.tsx`
- **Privileges Tab**:
  - Reads `SystemSettings` via `useSettings`.
  - Toggles update `manager_permissions`.
- **Manager Scope Tab**:
  - Reads selected `User` via `useUsers`.
  - Inputs update `User.scope` and `User.custom_permissions`.

### `useSettings` Hook
- Provides `settings` object and `updateSettings` function.
- Syncs with `StorageService`.

## Enforcement Points (Future/Parallel Work)
- **KanbanBoard**: Check `settings.manager_permissions.move_to_finalist` before allowing drag to "Finalist" column if user is Manager.
- **CandidateProfile**: Check `mark_not_selected` before showing "Reprovar" button.
- **JobDetails**: Check `close_job` permission before showing "Encerrar Vaga".
