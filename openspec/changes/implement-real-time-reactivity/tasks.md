# Tasks: Implement Real-Time Data Reactivity

## Priority: HIGH 🟡
**Major UX issue affecting all pages**

---

## Task 1: Fix useJobs Auto-Refresh ✅
**File**: `hooks/useJobs.ts`
**Estimated Time**: 10 minutes

- [x] Add `await loadJobs()` after `addJob` mutation
- [x] Add `await loadJobs()` after `updateJob` mutation
- [x] Add `await loadJobs()` after `deleteJob` mutation
- [x] Ensure `loadJobs` is in dependency array for all callbacks

**Validation**:
- Create a job → appears in list immediately
- Edit a job → changes reflect immediately
- Delete a job → removed from list immediately

---

## Task 2: Fix useUsers Auto-Refresh ✅
**File**: `hooks/useUsers.ts`
**Estimated Time**: 10 minutes

- [x] Add `await loadUsers()` after `addUser` mutation
- [x] Add `await loadUsers()` after `updateUser` mutation
- [x] Add `await loadUsers()` after `deleteUser` mutation
- [x] Ensure `loadUsers` is in dependency array for all callbacks

**Validation**:
- Add a user → appears in list immediately
- Edit a user → changes reflect immediately
- Delete a user → removed from list immediately

---

## Task 3: Fix useRoles Auto-Refresh ✅
**File**: `hooks/useRoles.ts`
**Estimated Time**: 10 minutes

- [x] Add `await loadRoles()` after `addRole` mutation (already correct)
- [x] Add `await loadRoles()` after `updateRole` mutation (already correct)
- [x] Add `await loadRoles()` after `deleteRole` mutation (already correct)
- [x] Ensure `loadRoles` is in dependency array for all callbacks (already correct)

**Validation**:
- Add a role → appears in list immediately
- Edit a role → changes reflect immediately
- Delete a role → removed from list immediately

---

## Task 4: Verify useCandidates (Already Correct) ✅
**File**: `hooks/useCandidates.ts`
**Estimated Time**: 5 minutes

- [x] Verify `addCandidate` calls `loadCandidates()` (already correct)
- [x] Verify `updateCandidate` calls `loadCandidates()` (already correct)
- [x] Verify `moveCandidate` uses optimistic updates (already correct)
- [x] Test that candidate applications appear in Kanban immediately

**Validation**:
- Candidate applies → appears in Kanban immediately
- Move candidate → stays in new column
- Update candidate → changes reflect immediately

---

## Task 5: Test Cross-Page Reactivity ✅
**Estimated Time**: 15 minutes

Test all major user flows:
- [ ] Admin creates job → job appears in jobs list
- [ ] Candidate applies → appears in admin Kanban
- [ ] Admin moves candidate → position persists
- [ ] Admin deletes job → removed from list
- [ ] Candidate updates profile → changes reflect in applications
- [ ] Admin adds user → appears in settings

**Validation**:
- No manual refreshes needed for any action
- All changes appear immediately
- No console errors
- Optimistic updates work correctly

---

## Task 6: Add Error Handling for Failed Mutations ✅
**Files**: All hooks
**Estimated Time**: 15 minutes

- [ ] Wrap mutations in try-catch blocks
- [ ] Show toast notifications on error
- [ ] Revert optimistic updates on failure
- [ ] Log errors for debugging

**Validation**:
- Simulate network failure → error toast appears
- Optimistic update reverts on error
- User is informed of failure

---

## Task 7: Performance Optimization ✅
**Files**: All hooks
**Estimated Time**: 10 minutes

- [ ] Ensure only affected data is refetched
- [ ] Verify no unnecessary re-renders
- [ ] Check that optimistic updates are instant
- [ ] Profile with React DevTools

**Validation**:
- UI feels snappy and responsive
- No noticeable lag after mutations
- Network tab shows only necessary requests

---

## Total Estimated Time: 75 minutes (~1.25 hours)

## Dependencies
- None - all changes are isolated to hooks

## Rollback Strategy
If issues arise:
1. Revert hook files to previous versions
2. Users will need to manually refresh (current behavior)
3. No data loss or corruption risk
