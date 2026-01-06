# Proposal: Reactive Candidate Portal

## Problem Statement
The current candidate portal experience suffers from state synchronization issues. Users are required to manually refresh the page (F5) to see updates after modifying their profile or preferences. This is caused by the use of decentralized `useState` and manual `useEffect` fetching within the `useCandidateData` hook, which lacks a shared cache and automatic invalidation mechanism.

## Proposed Solution
Migrate the `useCandidateData` hook and related components to use **React Query (TanStack Query)**. This will provide a shared query cache, automatic background refetching, and a robust mutation system with optimistic updates.

Additionally, align the implementation with the project's **UX/UI Guide** (immediate feedback, clear hierarchy) and **Performance Instructions** (O(1) lookups, optimized renders).

## Key Capabilities
- **Universal Candidate Cache**: A shared query for candidate data accessible across all portal pages.
- **Optimistic Profile Updates**: Instant UI feedback when updating profile information.
- **Auto-Invalidation**: Automatic refetching of job listings and application status after relevant mutations.
- **Persistence Layer**: Optional local storage caching for immediate initial render (Hydration).

## Impact
- **No F5 Needed**: The UI will automatically reflect the latest state from the database.
- **Instant Feel**: Mutations will update the UI before the server even responds.
- **Performance**: Reduced redundant network requests due to query deduplication and caching.
