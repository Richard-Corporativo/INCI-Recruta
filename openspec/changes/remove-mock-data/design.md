# Design

## Architecture
No structural changes. `StorageService` remains the source of truth, but the seed data is removed.

## Data Flow
- **Initialization**: `StorageService.initialize()` checks `KEYS.INITIALIZED`.
  - Old behavior: If check fails, write massive mock objects to localStorage.
  - New behavior: If check fails, write `[]` (empty arrays) to localStorage.

## Components
- **Dashboard**: Ensure calculations (like average hire time) handle division by zero or empty arrays correctly without defaulting to a "mocked" number (38 days).
