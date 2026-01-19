# Capability: Backup and Restore

## ADDED Requirements

### Requirement: Data Export
The system SHALL allow users to export all data stored in the browser (jobs, candidates, roles, audit logs, users) into a portable JSON file.

#### Scenario: Successful data export
- **WHEN** the user clicks the "Exportar Backup" button in the System Settings
- **THEN** the browser generates and downloads a `.json` file containing all current system data

### Requirement: Data Import
The system SHALL allow users to restore data from a previously exported JSON file, replacing the current local database.

#### Scenario: Successful data import
- **WHEN** the user selects a valid JSON backup file and clicks "Importar Backup"
- **THEN** the system validates the file structure
- **AND** overwrites the current local storage with the new data
- **AND** reloads the application to apply changes
