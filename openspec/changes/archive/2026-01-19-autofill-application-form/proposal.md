# Autofill Application Form for Logged-In Candidates

## Summary
Simplify the application process for authenticated candidates by auto-filling their profile information (Name, Email, Phone, Resume) and skipping user account creation.

## Motivation
Currently, the application flow may treat every applicant as a guest or require re-entering data. Authenticated users expect a seamless "1-click" or "simplified" application experience without redundancy. This reduces friction and increases conversion.

## Proposed Changes
1.  **Application Page Logic**:
    - Detect if user is authenticated via `authService` / `StorageService`.
    - If Authenticated:
        - Load candidate profile data.
        - Pre-fill specific fields (Name, Email, Phone, etc.).
        - Disable/Hide "Password" and "Confirm Password" fields (as account exists).
        - Show "Authenticated as [Name]" banner.
    - If Guest:
        - Show full form including Password setup (to create account) or Guest options.

2.  **Submission Logic**:
    - **Authenticated**: Submit `candidate_id` directly. Do NOT trigger "Create User". Update `Candidate` record if profile fields changed (optional, or just link).
    - **Guest**: Create User + Create Candidate + Submit Application.

## Risky Implications
-   **Data Overwrite**: If auto-filled forms are editable, should changes update the master profile? *Decision: For this MVP, let's say NO, or treat Application specific data as snapshot. But usually it's better to update. Let's assume snapshot for specific application or update profile.*
-   **Profile Data Missing**: If logged in user has incomplete profile, they must fill missing fields.

## Alternatives
-   **One-Click Apply**: Entirely skip form if all data exists. (Might be too aggressive if they want to change Resume/Cover Letter). We will prefer "Pre-filled Form".
