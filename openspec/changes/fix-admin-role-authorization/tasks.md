# Tasks: Fix Admin Role Authorization

## Priority: CRITICAL 🔴
**Security vulnerability - must be addressed immediately**

---

## Task 1: Update RequireAuth Guard ✅
**File**: `App.tsx`
**Estimated Time**: 5 minutes

- [x] Add `user` to destructured `useAuth()` hook
- [x] Add role validation check after authentication check
- [x] Redirect candidates to `/candidate/dashboard`
- [x] Ensure admin/manager/recruiter/quality/dp roles pass through

**Validation**:
- Login as candidate and attempt to access `/admin/dashboard` - should redirect
- Login as admin and access `/admin/dashboard` - should succeed

---

## Task 2: Add Role Constant Definitions ✅
**File**: `App.tsx` or new `constants/roles.ts`
**Estimated Time**: 3 minutes

- [x] Define `ADMIN_ROLES` constant array
- [x] Include: 'admin', 'manager', 'recruiter', 'quality', 'dp'
- [x] Use constant in `RequireAuth` validation

**Validation**:
- TypeScript compilation succeeds
- Constant is properly imported and used

---

## Task 3: Manual Security Testing ✅
**Estimated Time**: 10 minutes

Test all critical admin routes with candidate account:
- [ ] `/admin/dashboard` → redirects to `/candidate/dashboard`
- [ ] `/jobs` → redirects to `/candidate/dashboard`
- [ ] `/jobs/new` → redirects to `/candidate/dashboard`
- [ ] `/settings` → redirects to `/candidate/dashboard`
- [ ] `/talent-bank` → redirects to `/candidate/dashboard`
- [ ] `/audit` → redirects to `/candidate/dashboard`

Test admin routes with admin account:
- [ ] All routes above should be accessible

**Validation**:
- No candidate can access any administrative route
- All admin users can access administrative routes

---

## Task 4: Update Documentation ✅
**Files**: `README.md`, relevant spec files
**Estimated Time**: 5 minutes

- [x] Document role-based access control in README
- [x] Update authentication flow documentation
- [x] Add security notes about role validation

**Validation**:
- Documentation is clear and accurate

---

## Total Estimated Time: 23 minutes

## Dependencies
- None - this is a standalone critical fix

## Rollback Strategy
If any issues arise, revert changes to `App.tsx` `RequireAuth` component to previous version that only checks `isAuthenticated`.
