# Proposal: Add Entity Deletion & Candidate Profile UI Refresh

## Goal
Implement "Delete" functionality for Users, Jobs, and Candidates across the system, and perform a major visual overhaul of the `CandidateProfileDrawer` to match a requested HTML design.

## Scope
1.  **Deletion Capabilities**:
    *   **Settings (Users)**: Add ability to delete users (with confirmation).
    *   **Jobs**: Ensure deletion is accessible (already present in hook, need verification in UI).
    *   **Candidates**: Add ability to delete candidates (with confirmation).
2.  **UI Refresh**:
    *   **Candidate Profile**: Complete redesign based on user-provided HTML, featuring:
        *   New Header layout with top-level stats.
        *   "Status in Process" Timeline.
        *   Tabbed interface (Interviews, Audit).
        *   Detailed interview cards.
        *   Footer with specific actions (Reject, Schedule, Move, Approve).

## Context
The user provided a specific HTML template for the Candidate Profile and requested "more options" similar to it, specifically mentioning deletion for Users, Jobs, and Candidates. This update unifies data management (CRUD - specifically Delete) and elevates the UI quality for the most used screen (Candidate Profile).
