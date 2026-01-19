## ADDED Requirements
### Requirement: Integrated Email Client
The system MUST allow recruiters to send emails to candidates directly from the candidate's profile to maintain a centralized communication log.

#### Scenario: Sending an email
- **WHEN** a Recruiter is on a Candidate's profile
- **THEN** they can select "Send Email"
- **AND** choose a predefined template (e.g., "Interview Invite")

### Requirement: Email Templates
The system MUST support manageable email templates to standardize communication.

#### Scenario: Managing templates
- **WHEN** an Admin accesses Settings > Email Templates
- **THEN** they can create, edit, or delete message templates

### Requirement: Communication Audit
The system MUST automatically log every sent email into the candidate's activity timeline.

#### Scenario: Reviewing history
- **WHEN** a recruiter views the candidate timeline
- **THEN** they see "Email sent by [User] at [Time]"
- **AND** can verify the content sent
