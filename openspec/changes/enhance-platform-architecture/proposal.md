# Proposal: Enhance Recruitment Platform Architecture

## Summary
A comprehensive upgrade to the recruitment ecosystem to improve data integrity, administrative control, and user experience. This change lifecycle focuses on tightening the candidate application loop, empowering administrators with robust user management and governance tools, and optimizing the UI with unified "Quick View" patterns.

## Motivation
The current platform has several foundational gaps:
1. **Candidate Persistence**: Candidates can create redundant profiles, and the public header doesn't reflect their login state.
2. **Admin Governance**: Creating new administrators requires manual database intervention, and the settings tabs are largely non-functional.
3. **Operational Speed**: Navigating between detailed views of candidates and jobs is slow; a "Quick View" pattern is needed for faster triaging.

## Scope
### Candidate Portal
- **Login-Aware Navigation**: Update the public header to show user profile/logout when authenticated.
- **Robust Persistence**: Map candidate applications to `user_id` consistently; prevent duplicate profiles for the same email/user.
- **Enhanced Profile**: Collect and display more granular candidate data (bio, skills, detailed project links) in a way that syncs to the admin view.

### Admin Dashboard
- **Admin User Management**: Implement full creation/management of team members (Admins, Managers, Recruiters) from the UI.
- **Settings Module Completion**:
    - **Users**: Functional list with edit/suspend/delete.
    - **Privileges**: Role-based access control (RBAC) mapping.
    - **Manager Scope**: UI to define departmental/job access for managers.
    - **Audit**: Filterable log of configuration changes.
    - **System**: Global configuration (branding, colors, general settings).
- **Unified QuickView**: A reusable side-drawer component to preview candidate profiles, job descriptions, and user details without leaving the current list view.

### Data Architecture
- **Admin Authority**: Establish the Admin panel as the source of truth for user roles and status, while allowing candidates to manage their own professional data.

## Risks & Mitigations
- **Security**: Creating users from the frontend involves sensitive operations. *Mitigation*: Leverage Supabase Edge Functions for all user creation/role-updating tasks to ensure security.
- **Data Integrity**: Syncing candidate data might cause conflicts if both Admin and Candidate edit simultaneously. *Mitigation*: Implement a "Last Update Wins" policy with visible audit logs.
