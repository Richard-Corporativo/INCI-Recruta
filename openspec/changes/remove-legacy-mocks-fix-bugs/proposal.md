# Proposal: Remove Legacy Mocks and Fix Broken Functionalities

## Problem
The application still contains hardcoded mock data and static UI elements that do not reflect the state of the centralized `localStorage` system. Specifically:
- **Dashboard**: Filters are non-functional, and metrics like "Average Time" are hardcoded.
- **Authentication**: The login process uses a hardcoded list of users instead of the `useUsers` hook.
- **Sidebar**: Profile information and theme persistent state are not fully integrated with user sessions.
- **Settings**: User management actions are partially implemented, and the "Invite User" flow is a static mockup.

## Proposed Solution
1. **Dynamic Dashboard**: Implement state-driven filters and calculate KPIs dynamically from the `useJobs` and `useCandidates` hooks.
2. **Unified Auth System**: Refactor `Login.tsx` to validate credentials against the `users` stored in `localStorage`.
3. **Interactive Sidebar**: Reflect the current logged-in user's profile and ensure theme persistence.
4. **Functional Settings**: Enhance user invitation and profile editing to use proper hook persistence.

## Impact
- **Consistency**: The UI will always reflect the actual data in storage.
- **Reliability**: Fixes non-working filters and buttons.
- **User Experience**: Provides a realistic simulation of a production recruitment system.
