# Design: Admin Role Authorization Fix

## Architecture

### Current State
```
User Authentication Flow:
1. User logs in → isAuthenticated = true
2. User accesses /admin/* → RequireAuth checks isAuthenticated only
3. ❌ Candidate with isAuthenticated=true gains admin access
```

### Target State
```
User Authentication Flow:
1. User logs in → isAuthenticated = true, role = 'candidate'|'admin'|'manager'|etc
2. User accesses /admin/* → RequireAuth checks isAuthenticated AND role
3. ✅ Candidate redirected to /candidate/dashboard
4. ✅ Admin/Manager/Recruiter granted access
```

## Implementation Strategy

### 1. Role-Based Guard Enhancement
**File**: `App.tsx`

**Current Implementation**:
```typescript
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};
```

**Proposed Implementation**:
```typescript
const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Block candidates from admin routes
  if (user?.role === 'candidate') {
    return <Navigate to="/candidate/dashboard" replace />;
  }
  
  return <>{children}</>;
};
```

### 2. Administrative Roles
Valid administrative roles that should have access:
- `admin` - Full system access
- `manager` - Department/team management
- `recruiter` - Recruitment operations
- `quality` - Quality assurance
- `dp` - HR/Personnel department

### 3. Route Protection Matrix

| Route Pattern | Allowed Roles | Blocked Roles |
|--------------|---------------|---------------|
| `/admin/*` | admin, manager, recruiter, quality, dp | candidate |
| `/jobs/*` | admin, manager, recruiter, quality, dp | candidate |
| `/settings/*` | admin, manager, recruiter, quality, dp | candidate |
| `/talent-bank` | admin, manager, recruiter, quality, dp | candidate |
| `/candidate/*` | candidate | admin, manager, recruiter, quality, dp |

## Security Considerations

### Defense in Depth
1. **Frontend Guard**: `RequireAuth` component blocks navigation
2. **Backend RLS**: Supabase Row Level Security policies enforce data access
3. **API Validation**: Edge functions validate user roles

### Attack Vectors Mitigated
- ✅ Direct URL navigation to admin routes
- ✅ Browser history manipulation
- ✅ Bookmark/saved link access
- ✅ Deep linking from external sources

## Testing Strategy

### Unit Tests
- `RequireAuth` redirects candidates to `/candidate/dashboard`
- `RequireAuth` allows admin users through
- `RequireAuth` redirects unauthenticated users to login

### Integration Tests
- Candidate cannot access `/admin/dashboard`
- Candidate cannot access `/jobs`
- Candidate cannot access `/settings`
- Admin can access all administrative routes

### Manual Testing Checklist
- [ ] Login as candidate, attempt to navigate to `/admin/dashboard`
- [ ] Login as candidate, attempt to navigate to `/jobs`
- [ ] Login as candidate, attempt to navigate to `/settings`
- [ ] Login as admin, verify all routes accessible
- [ ] Login as manager, verify all routes accessible

## Rollback Plan
If issues arise, revert `App.tsx` changes to previous `RequireAuth` implementation. No database changes required.
