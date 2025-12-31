# Change: Backup/Restore and UI Consistency

## Why
The recruitment system currently lacks a way to export or import data, making it vulnerable to data loss from browser cache clearing. Additionally, several UI elements (buttons and filters) are non-functional, leading to a degraded user experience.

## What Changes
- **ADDED**: Export/Import functionality for system data (JSON backup).
- **FIXED**: Non-functional buttons in Dashboard and Kanban.
- **IMPROVED**: Standardized PT-BR Portuguese across all modified UI components.
- **ADDED**: "Sistema" tab in Settings for maintenance tasks.

## Impact
- Affected specs: `backup-restore`, `ui-fixes`
- Affected code: `lib/storage.ts`, `pages/Settings.tsx`, `pages/Dashboard.tsx`, `pages/Kanban.tsx`
