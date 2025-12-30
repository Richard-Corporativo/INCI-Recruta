# PROPOSAL: Standardize UI Patterns (Modals & Feedback)

This proposal aims to eliminate reliance on default browser dialogs (`window.alert`, `window.confirm`) and standardize the visual presentation of all modals across the application. This ensures a consistent, premium brand experience and better usability (especially in dark mode).

## User Value
- **Visual Consistency**: High-quality, project-specific designs for all interactions.
- **Improved UX**: Non-blocking feedback and more descriptive confirmation dialogs.
- **Brand Identity**: Reinforced "RecruitSys" aesthetic throughout the entire workflow.

## Scope
- Create a `components/BaseModal.tsx` to handle standard modal behavior (overlay, backdrop-blur, animation).
- Create a `components/ConfirmationModal.tsx` to replace `window.confirm`.
- Create a `components/FeedbackToast.tsx` or similar mechanism for notifications instead of `alert`.
- Refactor all existing modals (`UserModal`, `MoveStageModal`, `InterviewFeedbackModal`, `ScheduleInterviewModal`) to use the `BaseModal`.
- Remove all instances of browser-native `alert()` and `confirm()`.

## Non-Goals
- Full design system implementation (focus is on Modals and Feedback).
- Introducing complex state management for UI (keeping it simple with props or minimal context).
- Changing the underlying business logic of the modals.
