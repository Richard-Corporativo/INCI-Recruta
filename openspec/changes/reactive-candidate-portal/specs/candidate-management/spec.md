# Spec: Reactive Candidate Portal Management

This spec defines the requirements for ensuring a reactive, refresh-free experience in the candidate portal.

## ADDED Requirements

### Requirement: Reactive State Synchronization
The system MUST ensure that all candidate-facing pages (Dashboard, Settings, Applications) stay in sync with the database and with each other without manual browser refreshes.

#### Scenario: Instant Profile Sync across pages
- **Given** I am on the Candidate Dashboard
- **When** I update my profile name and click "Atualizar perfil"
- **And** I navigate to "Configurações" via the sidebar
- **Then** the name shown in the Settings page must already reflect the new value without an F5

#### Scenario: Background Status Updates
- **Given** I am viewing "Minhas candidaturas"
- **When** the application status is changed on the server (e.g., by a recruiter)
- **Then** the UI should update the status badge automatically within a reasonable time frame (background refetch) or upon returning to the tab

### Requirement: Optimistic User Interface
The system MUST provide immediate visual feedback for all user-initiated modifications before the server confirmation is received.

#### Scenario: Toggle Response
- **Given** I am in the Settings page
- **When** I click a toggle switch (e.g., email notifications)
- **Then** the switch must animate to the new state immediately (optimistic UI)
- **And** a success toast should appear once the server confirms the change
