# Proposal: Complete Application Audit and Critical Bug Fixes

## Problem Statement
The application has multiple critical bugs preventing core functionality from working correctly:

1. **Kanban Not Showing Candidates**: Candidates who apply to jobs don't appear in the admin Kanban board
2. **Registration Error Handling**: "User already registered" error shows in console instead of user-friendly message
3. **Data Reactivity Issues**: Some pages still require manual refresh despite recent fixes
4. **General Instability**: Multiple errors occurring across admin and candidate portals

## User Request
> "está acontecendo muitos erros, quero que reveja toda a aplicação admin e candidato. quero algo funcional"

The user wants a **complete review** of both admin and candidate applications to ensure everything works reliably.

## Root Causes Identified

### 1. Kanban Filtering Issue
**File**: `pages/Kanban.tsx`
- Uses `useCandidates()` without `jobId` parameter
- Shows ALL candidates instead of filtering by selected job
- Candidates ARE being saved to database correctly
- Problem is purely in the display logic

### 2. Registration Flow
**File**: `pages/public/CandidateRegister.tsx`
- Error handling partially implemented but still showing console errors
- Need to suppress console.error for expected "already registered" case

### 3. Missing Refresh Calls
Some components may not be calling refresh after mutations

## Proposed Solution

### Phase 1: Critical Fixes (Immediate)
1. Fix Kanban to filter candidates by job_id
2. Improve registration error handling
3. Verify all hooks have proper refresh logic

### Phase 2: Comprehensive Audit (Thorough)
1. Test all admin flows end-to-end
2. Test all candidate flows end-to-end
3. Fix any discovered issues
4. Add error boundaries for graceful failures

### Phase 3: Stability Improvements
1. Add loading states where missing
2. Improve error messages throughout
3. Add validation feedback
4. Ensure consistent UX

## Success Criteria
- ✅ Candidates appear in Kanban immediately after application
- ✅ Registration with existing email shows friendly message
- ✅ All CRUD operations work without manual refresh
- ✅ No console errors during normal operations
- ✅ Admin can manage jobs, candidates, and users smoothly
- ✅ Candidates can register, apply, and track applications smoothly

## Scope
**In Scope**:
- Critical bug fixes
- Data flow corrections
- Error handling improvements
- UX consistency

**Out of Scope**:
- New features
- Design changes
- Performance optimization (unless blocking)
- Supabase configuration changes

## Impact Assessment
- **Urgency**: CRITICAL - core functionality broken
- **Complexity**: MEDIUM - mostly logic fixes, no architecture changes
- **Risk**: LOW - fixes are isolated and testable
- **User Impact**: HIGH - directly addresses user's frustration
