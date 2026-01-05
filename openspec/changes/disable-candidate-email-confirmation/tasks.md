# Tasks: Disable Email Confirmation for Candidates

## Priority: HIGH 🟡
**User is blocked from accessing the platform after registration**

---

## Task 1: Configure Supabase to Disable Email Confirmation ✅
**Location**: Supabase Dashboard
**Estimated Time**: 5 minutes

- [ ] Navigate to Supabase Dashboard → Authentication → Providers → Email
- [ ] Disable "Confirm email" setting OR
- [ ] Set environment variable to allow auto-confirmation for candidates
- [ ] Test that new signups are auto-confirmed

**Validation**:
- New candidate signup should have `email_confirmed_at` set immediately
- No confirmation email should be sent (or it's optional)

---

## Task 2: Update CandidateRegister to Auto-Login ✅
**File**: `pages/public/CandidateRegister.tsx`
**Estimated Time**: 10 minutes

- [x] After successful `signUp`, immediately call `signInWithPassword`
- [x] Navigate to `/candidate/dashboard` on successful login
- [x] Update success message to reflect immediate access
- [x] Remove mention of email confirmation requirement

**Validation**:
- User is logged in immediately after registration
- User lands on `/candidate/dashboard` without manual login
- No redirect to `/verificar-email`

---

## Task 3: Remove Email Confirmation Check from RequireCandidateAuth ✅
**File**: `App.tsx`
**Estimated Time**: 3 minutes

- [x] Remove `isEmailConfirmed` from `RequireCandidateAuth` destructuring
- [x] Remove the `if (!isEmailConfirmed)` check
- [x] Keep only authentication check

**Validation**:
- Candidates can access `/candidate/*` routes without email confirmation
- No redirect to `/verificar-email` for candidates

---

## Task 4: Update VerifyEmail Page (Optional) ✅
**File**: `pages/public/VerifyEmail.tsx`
**Estimated Time**: 5 minutes

- [x] Add informational message that email confirmation is optional
- [x] Add "Skip to Dashboard" button
- [x] Update copy to be less urgent

**Validation**:
- Page is still accessible but not required
- Users can skip to dashboard if needed

---

## Task 5: Test Complete Flow ✅
**Estimated Time**: 10 minutes

Test scenarios:
- [ ] New candidate registration → immediate dashboard access
- [ ] Candidate logout → login again → dashboard access
- [ ] Existing candidate with unconfirmed email → can still access
- [ ] Admin users → no change in behavior

**Validation**:
- No loading loops
- No stuck states
- Immediate access for candidates
- Admin flow unchanged

---

## Total Estimated Time: 33 minutes

## Dependencies
- Supabase Dashboard access for configuration changes

## Rollback Strategy
1. Re-enable email confirmation in Supabase Dashboard
2. Revert code changes to `App.tsx` and `CandidateRegister.tsx`
3. Existing users will need to confirm emails again
