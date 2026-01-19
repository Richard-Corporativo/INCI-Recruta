# Spec: Storage Service Migration

## REMOVED Requirements
- `StorageService` usage for `audit_logs`, `settings`, and `roles`.

## ADDED Requirements

### Requirement: Audit Log Persistence
The system MUST persist audit logs in Supabase instead of local storage.

#### Scenario: Viewing Logs
- **GIVEN** an admin user is on the audit logs page
- **WHEN** the page loads
- **THEN** it fetches logs from the Supabase `audit_logs` table
- **AND** displays them in reverse chronological order.

#### Scenario: Creating Log
- **GIVEN** a system event occurs
- **WHEN** the audit log is triggered
- **THEN** it is saved to the Supabase `audit_logs` table.

### Requirement: System Settings Persistence
The system MUST store and retrieve configuration settings from Supabase.

#### Scenario: Loading Settings
- **GIVEN** the application starts
- **WHEN** settings are needed
- **THEN** it fetches data from the `system_settings` table in Supabase.

#### Scenario: Updating Settings
- **GIVEN** an admin updates a setting
- **WHEN** they save the change
- **THEN** the new value is updated in the `system_settings` table.

### Requirement: Custom Role Persistence
The system MUST allow persistent management of custom roles via Supabase.

#### Scenario: Managing Roles
- **GIVEN** an admin is in the roles section
- **WHEN** they perform a CRUD operation on a role
- **THEN** the change is persisted in the Supabase `roles` table.
