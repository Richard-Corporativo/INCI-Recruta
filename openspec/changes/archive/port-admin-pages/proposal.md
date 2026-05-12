# Change: Port Admin Implementation

## Why
The administrative portal implementation in the main `src/app/(admin)` currently contains placeholders or outdated logic. A fully stabilized version exists in the standalone `admin/` directory. Porting this implementation ensures parity and functional stability across the entire platform.

## What Changes
- **Porting**: Copy all functional pages and layouts from `admin/src/app/(admin)` to the project's root `src/app/(admin)`.
- **Dependency Resolution**: Map all ported file imports to the project's canonical aliases (`@src/*`).
- **Feature Parity**: Ensure the following modules are fully functional in the main project:
    - Dashboard
    - Job Management (Listing, Kanban)
    - Role Management (Listing, Create, Edit)
    - Audit Logs
    - Settings
    - Talent Bank

## Impact
- **Affected specs**: `admin-portal`
- **Affected code**: `src/app/(admin)/**/*`
