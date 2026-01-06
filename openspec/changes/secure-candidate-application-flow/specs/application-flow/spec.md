# Spec: Smart Application Flow

## ADDED Requirements

### Requirement: Smart Autofill
The system MUST provide intelligent autofill capabilities that highlight data sources and missing fields.

#### Scenario: Logged-in Candidate starts Application
- Given a logged-in candidate with an incomplete profile (e.g., missing phone number)
- When they navigate to apply for a job
- Then the application form should be pre-filled with existing data (Name, Email)
- And the pre-filled fields should have a focused visual state (e.g., green border or "Verified" icon)
- And the empty "Phone" field should be highlighted or listed in a summary block
- And a notification/banner should appear: "We verified your Name and Email. Please complete your Phone Number to proceed."

#### Scenario: Visual Distinction of Pre-filled Data
- Given an autofilled input field
- When the form loads
- Then it should display a "Source: Profile" indicator or checkmark
- And the user should still be able to edit the field if necessary

#### Scenario: Missing Fields Summary
- Given a form with required fields empty
- When the form loads
- Then calculate the `missingFields` list
- If `missingFields.length > 0`, display a "Completion Needed" card at the top of the step
- And clicking an item in the card should scroll to/focus that input

## MODIFIED Requirements

### Requirement: Update `JobApplication` Logic
The `autofillForm` function needs to return metadata about what was filled vs empty.

#### Scenario: Verify Autofill Status
- Given the `autofillForm` function runs
- When valid candidate data is found
- Then it should set `formData` state
- And it should update a new `formStatus` state indicating which fields are `verified` (from profile) vs `manual`
- And if critical fields are missing, `missingFields` state should be populated
