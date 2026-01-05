# Design: Disable Email Confirmation for Candidates

## Architecture Overview

### Current Authentication Flow
```
Candidate Registration:
1. User fills form at /cadastro
2. supabase.auth.signUp() creates user
3. Supabase sends confirmation email
4. User redirected to /verificar-email
5. RequireCandidateAuth checks isEmailConfirmed
6. If false → stuck at /verificar-email
7. If true → access to /candidate/dashboard
```

### Proposed Authentication Flow
```
Candidate Registration:
1. User fills form at /cadastro
2. supabase.auth.signUp() creates user (auto-confirmed)
3. User automatically logged in
4. Direct navigation to /candidate/dashboard
5. No email confirmation required
```

## Implementation Strategy

### 1. Supabase Configuration
**Location**: Supabase Dashboard → Authentication → Email Templates

**Change**: Disable "Confirm email" requirement
- Set `DISABLE_EMAIL_CONFIRMATION` for candidate signups
- OR use `autoConfirm: true` in signup options

### 2. Frontend Changes

#### File: `pages/public/CandidateRegister.tsx`
**Current**:
```typescript
const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
        emailRedirectTo: `${window.location.origin}/#/login`,
        data: { name: formData.name, role: 'candidate' }
    }
});
```

**Proposed**:
```typescript
const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
        emailRedirectTo: `${window.location.origin}/#/login`,
        data: { name: formData.name, role: 'candidate' },
        // Auto-confirm candidates
        emailConfirm: false
    }
});

// Immediately sign in after successful signup
if (authData.user) {
    await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
    });
    navigate('/candidate/dashboard');
}
```

#### File: `App.tsx` - `RequireCandidateAuth`
**Current**:
```typescript
const RequireCandidateAuth = ({ children }) => {
  const { isAuthenticated, isEmailConfirmed } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isEmailConfirmed) return <Navigate to="/verificar-email" replace />;
  
  return <>{children}</>;
};
```

**Proposed**:
```typescript
const RequireCandidateAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Email confirmation not required for candidates
  return <>{children}</>;
};
```

### 3. Backward Compatibility

**Keep `/verificar-email` page** for:
- Users who registered before this change
- Edge cases where email confirmation is needed
- Admin users (if they use this flow in the future)

**Update messaging**:
- Change "Verifique seu e-mail" to optional/informational
- Add "Pular" button to go directly to dashboard

## Security Considerations

### Risk Assessment
| Risk | Mitigation |
|------|------------|
| Fake email addresses | Low impact - candidates only see their own data |
| Spam registrations | Rate limiting on signup endpoint |
| Account takeover | Password requirements + RLS policies |

### Data Access Control
Candidates can only:
- View their own applications
- Update their own profile
- Apply to jobs

They CANNOT:
- Access admin routes (blocked by `RequireAuth`)
- View other candidates' data (RLS policies)
- Modify job listings (RLS policies)

## Alternative Approaches Considered

### Option 1: Optional Email Confirmation
- Allow access immediately but show banner to confirm email
- **Rejected**: Adds complexity without clear benefit

### Option 2: SMS Verification
- Use phone number instead of email
- **Rejected**: Adds cost and complexity

### Option 3: Social Login
- Google/LinkedIn OAuth
- **Rejected**: Out of scope for this change

## Rollback Plan
If issues arise:
1. Re-enable email confirmation in Supabase
2. Revert `RequireCandidateAuth` to check `isEmailConfirmed`
3. Revert `CandidateRegister` to not auto-login
