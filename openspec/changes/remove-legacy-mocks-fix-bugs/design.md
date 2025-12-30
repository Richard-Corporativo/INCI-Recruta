# Design: Legacy Mock Removal and Functional Fixes

## Overview
This change focuses on bridging the gap between the storage centralization work and the actual UI components. We will ensure that every dynamic element on the screen is backed by the `useStorage` hooks.

## Architecture Changes

### Authentication
We will implement a simple `useAuth` hook and `AuthProvider` that:
1.  Provides the `currentUser` object to the entire application.
2.  Handles login/logout by validating against the `users` stored via `useUsers`.
3.  Manages the `recruitSys_token` in `localStorage`.

### Dashboard State
The `Dashboard` filters will be managed in a local component state. We will extend the `useCandidates` and `useJobs` logic or simply filter them in-situ to maintain responsiveness.

### KPI Calculations
- **Time to Hire**: Currently hardcoded as "38 days". We will calculate this by averaging the difference between `job.created_at` and `candidate.hired_at` (requires adding `hired_at` to the `Candidate` type).

## UI/UX Improvements
- **Sidebar**: Will now show the name and role of the actual logged-in user.
- **Theme**: Ensure the theme (dark/light) preference is saved in `localStorage`.
