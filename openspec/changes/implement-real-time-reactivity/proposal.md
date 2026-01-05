# Proposal: Implement Real-Time Data Reactivity

## Problem Statement
The application requires manual page refreshes to see data changes, creating a poor user experience. Specifically:

1. **General Reactivity Issue**: After performing actions (creating jobs, moving candidates, etc.), changes don't appear until the page is manually refreshed
2. **Kanban Not Updating**: When a candidate applies to a job, they don't appear in the admin Kanban board until refresh
3. **All Pages Affected**: Dashboard, Jobs list, Kanban, Talent Bank, and Candidate portal all suffer from this issue

## Current Behavior
- User creates a job → job doesn't appear in list
- Candidate applies → doesn't appear in Kanban
- User moves candidate in Kanban → position reverts until refresh
- User updates profile → changes don't reflect immediately

## Root Cause
The application uses React hooks (`useJobs`, `useCandidates`, etc.) that fetch data on mount but don't automatically refetch after mutations. While hooks have `refresh()` methods, they're not being called after data-changing operations.

## Proposed Solution
Implement automatic data invalidation and refetching after mutations using two approaches:

### Approach 1: Optimistic Updates + Refetch (Immediate)
- Update local state optimistically for instant UI feedback
- Perform API mutation in background
- Refetch data to ensure consistency

### Approach 2: Supabase Realtime (Future Enhancement)
- Subscribe to database changes via Supabase Realtime
- Automatically update UI when data changes from any source
- Enables multi-user collaboration

**For this proposal, we'll implement Approach 1** as it's simpler and doesn't require additional Supabase configuration.

## Implementation Strategy

### 1. Auto-Refresh After Mutations
Ensure all mutation functions (add, update, delete) trigger a refresh:
- `useJobs`: After `addJob`, `updateJob`, `deleteJob`
- `useCandidates`: After `addCandidate`, `updateCandidate`, `deleteCandidate`
- `useRoles`: After role mutations
- `useUsers`: After user mutations

### 2. Cross-Hook Invalidation
When one hook's data affects another:
- Creating a job should refresh jobs list
- Adding a candidate should refresh both candidates list AND job's candidate count
- Moving a candidate should update Kanban immediately

### 3. Optimistic UI Updates
For drag-and-drop and other interactive features:
- Update UI immediately (already implemented for `moveCandidate`)
- Persist to backend
- Revert on error

## Success Criteria
- ✅ Creating a job shows it immediately in the jobs list
- ✅ Candidate application appears instantly in admin Kanban
- ✅ Moving candidates in Kanban persists without refresh
- ✅ Profile updates reflect immediately
- ✅ No manual page refreshes needed
- ✅ All CRUD operations trigger appropriate UI updates

## Impact Assessment
- **UX**: Significant improvement - feels like a modern SPA
- **Performance**: Minimal - only refetches affected data
- **Complexity**: Low - leverages existing refresh mechanisms
- **Risk**: Low - changes are isolated to hooks

## Out of Scope (Future Enhancements)
- Supabase Realtime subscriptions
- WebSocket-based live updates
- Multi-user conflict resolution
- Offline support with sync
