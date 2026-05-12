# Manual Security Testing Checklist

## 🔴 CRITICAL: Test Admin Route Protection

### Prerequisites
1. Have at least one candidate account (e.g., from registration)
2. Have at least one admin account (e.g., thiago.nascimento@incibrasil.com.br)

---

## Test 1: Candidate Cannot Access Admin Routes

### Steps:
1. **Login as Candidate**
   - Navigate to `/login`
   - Use candidate credentials
   - Should land on `/candidate/dashboard`

2. **Attempt to Access Admin Dashboard**
   - Manually navigate to: `http://localhost:3000/#/admin/dashboard`
   - **Expected**: Immediately redirected to `/candidate/dashboard`
   - **Status**: [ ] PASS / [ ] FAIL

3. **Attempt to Access Jobs Management**
   - Manually navigate to: `http://localhost:3000/#/jobs`
   - **Expected**: Immediately redirected to `/candidate/dashboard`
   - **Status**: [ ] PASS / [ ] FAIL

4. **Attempt to Access Settings**
   - Manually navigate to: `http://localhost:3000/#/settings`
   - **Expected**: Immediately redirected to `/candidate/dashboard`
   - **Status**: [ ] PASS / [ ] FAIL

5. **Attempt to Access Talent Bank**
   - Manually navigate to: `http://localhost:3000/#/talent-bank`
   - **Expected**: Immediately redirected to `/candidate/dashboard`
   - **Status**: [ ] PASS / [ ] FAIL

6. **Attempt to Access Audit**
   - Manually navigate to: `http://localhost:3000/#/audit`
   - **Expected**: Immediately redirected to `/candidate/dashboard`
   - **Status**: [ ] PASS / [ ] FAIL

7. **Attempt to Create New Job**
   - Manually navigate to: `http://localhost:3000/#/jobs/new`
   - **Expected**: Immediately redirected to `/candidate/dashboard`
   - **Status**: [ ] PASS / [ ] FAIL

---

## Test 2: Admin Can Access All Routes

### Steps:
1. **Logout from Candidate Account**
   - Click logout in candidate portal

2. **Login as Admin**
   - Navigate to `/admin/login`
   - Use admin credentials (thiago.nascimento@incibrasil.com.br)
   - Should land on `/admin/dashboard`

3. **Access Admin Dashboard**
   - Navigate to: `http://localhost:3000/#/admin/dashboard`
   - **Expected**: Page loads successfully
   - **Status**: [ ] PASS / [ ] FAIL

4. **Access Jobs Management**
   - Navigate to: `http://localhost:3000/#/jobs`
   - **Expected**: Page loads successfully
   - **Status**: [ ] PASS / [ ] FAIL

5. **Access Settings**
   - Navigate to: `http://localhost:3000/#/settings`
   - **Expected**: Page loads successfully
   - **Status**: [ ] PASS / [ ] FAIL

6. **Access Talent Bank**
   - Navigate to: `http://localhost:3000/#/talent-bank`
   - **Expected**: Page loads successfully
   - **Status**: [ ] PASS / [ ] FAIL

7. **Access Audit**
   - Navigate to: `http://localhost:3000/#/audit`
   - **Expected**: Page loads successfully
   - **Status**: [ ] PASS / [ ] FAIL

---

## Test 3: Unauthenticated Access

### Steps:
1. **Logout Completely**
   - Ensure no user is logged in

2. **Attempt Admin Route**
   - Navigate to: `http://localhost:3000/#/admin/dashboard`
   - **Expected**: Redirected to `/admin/login`
   - **Status**: [ ] PASS / [ ] FAIL

---

## ✅ Final Validation

- [ ] All candidate access attempts redirect to `/candidate/dashboard`
- [ ] All admin access attempts succeed
- [ ] No console errors appear during redirects
- [ ] Application compiles without TypeScript errors

---

## 🚨 If Any Test Fails

1. Check browser console for errors
2. Verify user role in browser DevTools (Application > Local Storage)
3. Check that `user.role` is correctly set in AuthContext
4. Report findings immediately

---

## Test Results Summary

**Date Tested**: _______________
**Tested By**: _______________

**Overall Status**: [ ] ALL PASS / [ ] FAILURES DETECTED

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
