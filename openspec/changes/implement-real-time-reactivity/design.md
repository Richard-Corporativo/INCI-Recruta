# Design: Real-Time Data Reactivity

## Architecture Overview

### Current State
```
User Action → API Call → Success → UI stays stale
                                  ↓
                          Manual Refresh Required
```

### Target State
```
User Action → Optimistic UI Update → API Call → Success → Auto Refresh
                    ↓                                  ↓
              Instant Feedback                  Data Consistency
```

## Implementation Strategy

### 1. Hook-Level Auto-Refresh

Each custom hook will automatically refresh after mutations:

#### Pattern
```typescript
const addItem = useCallback(async (item) => {
  await Service.addItem(item);
  await loadItems(); // Auto-refresh
}, [loadItems]);
```

#### Hooks to Update
- `useJobs` - Jobs management
- `useCandidates` - Candidates management  
- `useRoles` - Roles management
- `useUsers` - Users management

### 2. Cross-Component Invalidation

Some actions affect multiple data sources:

| Action | Primary Refresh | Secondary Refresh |
|--------|----------------|-------------------|
| Add Candidate | `useCandidates` | `useJobs` (update count) |
| Delete Job | `useJobs` | `useCandidates` (orphaned candidates) |
| Move Candidate | `useCandidates` (optimistic) | None |

**Solution**: Use React Context or event emitter for cross-hook communication.

### 3. Optimistic Updates (Already Implemented)

`moveCandidate` already uses optimistic updates:
```typescript
// Update UI immediately
setCandidates(prev => prev.map(c =>
  c.id === id ? { ...c, columnId: newColumn } : c
));

// Persist to backend
await Service.updateCandidate(id, { columnId: newColumn });
```

**Keep this pattern** - it provides instant feedback.

### 4. Error Handling

When mutations fail:
```typescript
try {
  // Optimistic update
  updateLocalState();
  
  // API call
  await Service.mutate();
  
  // Refresh for consistency
  await refresh();
} catch (error) {
  // Revert optimistic update
  revertLocalState();
  
  // Show error toast
  showError(error.message);
}
```

## Detailed Changes

### File: `hooks/useJobs.ts`

**Current Issues**:
- `addJob` doesn't refresh after creation
- `updateJob` doesn't refresh after update
- `deleteJob` doesn't refresh after deletion

**Solution**:
```typescript
const addJob = useCallback(async (job) => {
  await JobService.addJob(job);
  await loadJobs(); // ADD THIS
}, [loadJobs]);

const updateJob = useCallback(async (id, updates) => {
  await JobService.updateJob(id, updates);
  await loadJobs(); // ADD THIS
}, [loadJobs]);

const deleteJob = useCallback(async (id) => {
  await JobService.deleteJob(id);
  await loadJobs(); // ADD THIS
}, [loadJobs]);
```

### File: `hooks/useCandidates.ts`

**Already Correct** ✅
- `addCandidate` already calls `loadCandidates()`
- `updateCandidate` already calls `loadCandidates()`
- `moveCandidate` uses optimistic updates

**No changes needed** for this hook.

### File: `hooks/useUsers.ts`

**Current Issues**:
- `addUser` doesn't refresh
- `updateUser` doesn't refresh
- `deleteUser` doesn't refresh

**Solution**: Same pattern as `useJobs`.

### File: `hooks/useRoles.ts`

**Current Issues**:
- `addRole` doesn't refresh
- `updateRole` doesn't refresh
- `deleteRole` doesn't refresh

**Solution**: Same pattern as `useJobs`.

## Alternative Approaches Considered

### Option 1: Global State Management (Redux/Zustand)
**Pros**: Centralized state, easier cross-component updates
**Cons**: Major refactor, overkill for this use case
**Decision**: Rejected - too complex

### Option 2: React Query / SWR
**Pros**: Built-in caching, auto-refetch, optimistic updates
**Cons**: New dependency, learning curve, migration effort
**Decision**: Rejected - current hooks work well

### Option 3: Supabase Realtime
**Pros**: True real-time updates, multi-user sync
**Cons**: Requires subscription setup, additional cost, complexity
**Decision**: Future enhancement, not for this iteration

## Performance Considerations

### Refetch Frequency
- Only refetch after mutations (not on interval)
- Only refetch affected data (not entire app state)
- Use optimistic updates for instant feedback

### Network Optimization
- Batch multiple mutations when possible
- Use Supabase's `.select()` to fetch only needed fields
- Implement pagination for large lists (future)

## Testing Strategy

### Manual Testing Checklist
- [ ] Create job → appears in list immediately
- [ ] Update job → changes reflect immediately
- [ ] Delete job → removed from list immediately
- [ ] Add candidate → appears in Kanban immediately
- [ ] Move candidate → stays in new column
- [ ] Update candidate → changes reflect immediately
- [ ] Delete candidate → removed immediately

### Edge Cases
- [ ] Network failure during mutation
- [ ] Concurrent mutations from multiple users
- [ ] Rapid successive mutations
- [ ] Large datasets (100+ items)

## Rollback Plan
If issues arise:
1. Revert hook changes to previous versions
2. Users will need to manually refresh (current behavior)
3. No data loss - only UX degradation
