# Capability: Candidate Portal

## MODIFIED Requirements
### Requirement: Public Job Listing
The system MUST provide a publicly accessible list of all open positions.

#### Scenario: User filters job list
- **WHEN** user selects "Tecnologia" and "Remoto" filters
- **THEN** only jobs matching both criteria are displayed
- **AND** the count of available jobs updates dynamically

#### Scenario: User searches by keyword
- **WHEN** user types "Front-end" in the hero search bar
- **THEN** jobs containing the term in title or description are filtered

#### Scenario: Responsive layout adaptation
- **WHEN** viewed on mobile
- **THEN** filters collapse into a details/summary accordion
- **AND** the hero section adjusts padding and font size
