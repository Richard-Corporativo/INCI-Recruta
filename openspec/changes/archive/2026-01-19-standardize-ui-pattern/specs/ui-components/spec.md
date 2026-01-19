# SPEC: Standardized UI Patterns

This specification defines the requirements for a unified modal and feedback system in the RecruitSys application.

## ADDED Requirements

### Requirement: [REQ-UI-MODAL-001] Unified Modal Component
The system MUST use a standardized `BaseModal` component for all modal dialogs.
#### Scenario: Modal Appearance
- **Given** any modal is open.
- **Then** it MUST display a semi-transparent backdrop with blur effect.
- **And** it MUST have rounded corners (xl or 2xl).
- **And** it MUST have a subtle border matching the current theme (light or dark).

### Requirement: [REQ-UI-CONFIRM-001] Custom Confirmation Dialog
The application MUST NOT use the browser's native `window.confirm`.
#### Scenario: Confirmation workflow
- **Given** the user triggers a destructive action (e.g., Delete).
- **When** the confirmation is requested.
- **Then** a custom-styled modal MUST be displayed with clearly labeled "Confirm" and "Cancel" buttons.

### Requirement: [REQ-UI-TOAST-001] Feedback Notifications
The application MUST NOT use the browser's native `alert()`.
#### Scenario: Action success feedback
- **Given** a user completes an action (e.g., Savings a form).
- **When** feedback is required.
- **Then** a custom notification (Toast) MUST be displayed.
- **And** the notification MUST auto-close after a reasonable duration (e.g., 3-5 seconds).

## MODIFIED Requirements

### Requirement: [REQ-ROLE-CRUD-001] Role Management UI
The system MUST provide a user interface to manage the lifecycle of roles using standardized UI components.

#### Scenario: Delete Role (Updated)
- **Given** the user is on the "Listagem de Cargos" page.
- **When** the user clicks the "Delete" button for a specific role.
- **Then** the system MUST display a **custom confirmation modal** instead of a browser dialog.
- **When** the user confirms the deletion.
- **Then** the system MUST remove the role from storage and update the list.
