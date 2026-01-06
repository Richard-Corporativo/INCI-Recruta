# Job Management Spec

## ADDED Requirements

### Requirement: Job Creation and Editing
The system SHALL provide an interface for admins to create and edit job postings, including structured data for responsibilities and requirements.

#### Scenario: Admin adds structured responsibilities
- **Given** the admin is creating or editing a job
- **When** they reach the "Contexto da vaga" step
- **Then** they can add items to "Responsibilities" (O que você vai fazer) individually using a list editor
- **And** they can remove or edit individual items
- **And** the input is not a single raw text area

#### Scenario: Admin adds structured requirements
- **Given** the admin is creating or editing a job
- **When** they reach the "Contexto da vaga" step
- **Then** they can add items to "Requirements" (O que esperamos de você) individually using a list editor
- **And** they can remove or edit individual items

### Requirement: Job Display
The system SHALL display job details to candidates using structured lists.

#### Scenario: Public view of structured details
- **Given** a candidate is viewing a job opportunity
- **Then** "O que você vai fazer" (responsibilities) is displayed as a bulleted list
- **And** "O que esperamos de você" (requirements) is displayed as a list with checkmarks
- **And** empty lists should display a fallback message or be hidden
