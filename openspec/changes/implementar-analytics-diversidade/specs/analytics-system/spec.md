## ADDED Requirements
### Requirement: Diversity Data Collection
The system MUST provide optional fields for demographic data collection during application, strictly for aggregated statistical purposes.

#### Scenario: Candidate applies
- **WHEN** a candidate fills the application form
- **THEN** they can see optional diversity fields
- **AND** they are informed the data is anonymous and for statistical use only

### Requirement: Anonymized Diversity Reporting
The system MUST allow viewing diversity metrics ONLY in aggregated format to prevent bias against individual candidates.

#### Scenario: Viewing candidate profile
- **WHEN** a Recruiter views a specific Candidate Card or Profile
- **THEN** NO demographic data (Race, Gender, etc.) is displayed

#### Scenario: Viewing Diversity Dashboard
- **WHEN** an Admin views the Diversity Dashboard
- **THEN** they see aggregated charts (e.g., "30% of applicants are women")

### Requirement: Recruitment KPIs
The system MUST calculate and display key performance indicators for the recruitment process.

#### Scenario: Admin checks efficiency
- **WHEN** an Admin accesses the main Dashboard
- **THEN** they see "Time to Hire" and "Conversion Rate" metrics
