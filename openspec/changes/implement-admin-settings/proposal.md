# Implement Admin Settings Persistence and Logic

## Summary
The current Admin Settings page (`/settings`) showcases "Privileges" and "Manager Scope" tabs with UI controls that are purely visual mockups. This change implements the actual data persistence for these settings and connects them to the application logic, ensuring that configuration changes are saved and respected.

## Why
- The "Privileges" tab allows toggling global manager permissions (e.g., "Move to Finalist"), but these toggles do not persist and have no effect.
- The "Manager Scope" tab allows configuring vacancy visibility and enabled actions for specific managers, but these changes are not saved to the user profile or any store.
- Users are misled into thinking they have configured the system when no changes have taken place.

## Solution
1.  **Data Persistence**:
    -   Introduce a new `SETTINGS` key in `StorageService` for global system configuration.
    -   Update the `User` entity to include `scope` and `permissions` fields for per-user configuration.
2.  **State Management**:
    -   Create a `useSettings` hook to manage global keys.
    -   Update `useUsers` to handle patching of user permissions.
3.  **UI Connection**:
    -   Wire the `Settings.tsx` components to read from and write to these new storage locations.
4.  **Enforcement**:
    -   Update relevant components (Kanban Board, Job View) to respect these configured permissions.

## Impact
- **Settings Page**: Will become fully functional.
- **Data Schema**: `User` type will be extended. New `SystemSettings` type introduced.
- **Workflow**: Managers will be restricted based on the configured rules.
