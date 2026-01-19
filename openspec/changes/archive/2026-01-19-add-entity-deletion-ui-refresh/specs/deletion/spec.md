# Spec: Deletion Capabilities

## ADDED Requirements

### Allow Entity Deletion
The system must allow deletion of core entities to manage data lifecycle.

#### Scenario: Delete User
- **Given** I am on the Settings page (Users tab)
- **When** I click the "Trash" icon on a user row
- **And** I confirm the modal "Tem certeza que deseja excluir...?"
- **Then** the user should be removed from the list and LocalStorage.

#### Scenario: Delete Candidate
- **Given** I am viewing a Candidate Profile
- **When** I click "Excluir" (header or footer action)
- **And** I confirm the modal
- **Then** the candidate should be removed and the drawer closed.

#### Scenario: Delete Job
- **Given** I am on the Jobs list
- **When** I click "Excluir" on a job
- **And** I confirm
- **Then** the job should be removed.
