# Spec: UI Integrity

## MODIFIED Requirements

### Req: Static String Removal
All UI elements must use data from global hooks instead of hardcoded strings.

#### Scenario: Request Access Placeholders
- **Given** the Request Access page.
- **Then** all placeholders and examples should be generic or context-aware, not "Ana Silva".

### Req: Theme Persistence
The user's theme preference must persist across sessions.

#### Scenario: Dark Mode Persistence
- **When** the user switches to Dark Mode.
- **Then** the choice should be saved in `localStorage` and restored on the next visit.
