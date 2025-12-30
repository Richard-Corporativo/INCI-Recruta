# Spec: Data Persistence

This specification defines how the application handles data persistence and synchronization using localStorage.

## ADDED Requirements

### Requirement: [REQ-PERS-001] Centralized Local Storage
The application MUST use a centralized storage mechanism based on `localStorage` to manage all application data.

#### Scenario: First application load
- **Given** the user opens the application for the first time
- **And** the `localStorage` is empty
- **When** the application initializes
- **Then** the system MUST populate `localStorage` with predefined initial data for jobs, candidates, and roles.

### Requirement: [REQ-PERS-002] Data Synchronization
Data modified in one part of the application MUST be reflected in all other parts consuming the same data.

#### Scenario: Moving a candidate in Kanban
- **Given** the user is on the Kanban page
- **When** the user moves a candidate to a new stage
- **Then** the system MUST update the candidate's stage in `localStorage`
- **And** if the user navigates to the Jobs list, the updated candidate count or status MUST be visible.

### Requirement: [REQ-PERS-003] CRUD Operations Persistence
All Creation, Update, and Deletion operations MUST persist data to `localStorage`.

#### Scenario: Creating a new job
- **Given** the user is on the "Create Job" page
- **When** the user submits the form
- **Then** the new job MUST be added to the jobs list in `localStorage`
- **And** the user MUST see the new job in the Jobs table after navigation.
