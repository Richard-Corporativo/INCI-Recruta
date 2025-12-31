# Proposal: Remove Mock Data

## Context
The application currently initializes with hardcoded mock data in `StorageService` (jobs, candidates, roles, users) to simulate a populated system. The user has requested to remove all mocked data ("tire todos os dados mokados"), likely to prepare the system for real usage or a clean state.

## Problem
- The system pre-populates with fake data on every fresh load (if not initialized).
- This fake data is not suitable for a production or real-world testing environment where the user expects to start with a clean slate or their own data.

## Solution
- Remove the hardcoded `initialJobs`, `initialCandidates`, `initialRoles`, and `initialUsers` arrays from `lib/storage.ts`.
- Update `StorageService.initialize()` to set empty arrays for these keys if they do not exist.
- Verify and remove any fallback mock data in components (e.g., `Dashboard.tsx` average time calculation).

## Impact
- **Data Persistence**: New users/browsers will start with an empty database. Existing local storage data might persist unless manually cleared, but the initialization logic will no longer inject mocks.
- **UX**: The dashboard and lists will be empty initially. Empty states should be handled gracefully (current code seems to handle empty lists well).
