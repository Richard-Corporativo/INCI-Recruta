# Design: Fix Critical Data Persistence Issues

## Architecture Overview

This change addresses fundamental data integrity issues in the recruitment system by:
1. Completing the database schema for role-based salary management
2. Establishing proper referential integrity between roles and jobs
3. Configuring security policies for candidate applications
4. Normalizing data to eliminate redundancy

## Current State Analysis

### Database Schema Issues

**roles table:**
```sql
-- Current (incomplete)
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  title TEXT,
  department TEXT,
  -- Missing: salary_min, salary_max
);
```

**jobs table:**
```sql
-- Current (redundant)
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  title TEXT,
  department TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  -- Missing: role_id (foreign key)
);
```

**Problem:** Jobs duplicate role data without maintaining referential integrity.

### Data Flow Issues

```
Current (Broken):
Role Edit → Update roles table
              ↓ (manual sync via title matching - fragile)
           Update jobs WHERE title = role.title
              ↓
           Public Page (may show stale data)

Desired (Fixed):
Role Edit → Update roles table
              ↓ (automatic via foreign key)
           Update jobs WHERE role_id = role.id
              ↓
           Public Page (always current)
```

## Proposed Architecture

### Database Schema (Target State)

**roles table:**
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  area TEXT,
  department TEXT NOT NULL,
  seniority TEXT,
  mission TEXT,
  responsibilities TEXT,
  salary_min INTEGER DEFAULT 0,  -- ADDED
  salary_max INTEGER DEFAULT 0,  -- ADDED
  status TEXT DEFAULT 'Ativo',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roles_department ON roles(department);
CREATE INDEX idx_roles_status ON roles(status);
```

**jobs table:**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,  -- ADDED
  title TEXT NOT NULL,
  context TEXT,
  location TEXT,
  model TEXT,
  contract TEXT,
  urgency TEXT,
  status TEXT DEFAULT 'Ativa',
  
  -- Inherited from role (read-only in UI):
  department TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  mission TEXT,
  responsibilities TEXT,
  
  -- Job-specific:
  requirements TEXT,
  benefits JSONB,
  seniority TEXT,
  manager_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  candidates_count INTEGER DEFAULT 0
);

CREATE INDEX idx_jobs_role_id ON jobs(role_id);  -- ADDED
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
```

### RLS Policies

**candidates table:**
```sql
-- Enable RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users can insert their own applications
CREATE POLICY "candidates_insert_own"
ON candidates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Anonymous users can apply (for non-logged-in candidates)
CREATE POLICY "candidates_insert_anon"
ON candidates FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 3: Users can view only their own applications
CREATE POLICY "candidates_select_own"
ON candidates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Admins can view all
CREATE POLICY "candidates_select_admin"
ON candidates FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'recruiter', 'manager')
  )
);
```

**storage.objects (resumes bucket):**
```sql
-- Policy 1: Anyone can upload to resumes bucket
CREATE POLICY "resumes_insert_public"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

-- Policy 2: Anyone can view resumes
CREATE POLICY "resumes_select_public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');
```

## Data Synchronization Strategy

### Option A: Real-time Sync (Chosen)

When a role is updated, immediately update all associated jobs:

```typescript
// EditRole.tsx - handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Update role
  await updateRole(id, formData);
  
  // 2. Sync to jobs (using role_id)
  await JobService.syncJobsByRoleId(id, {
    title: formData.title,
    department: formData.department,
    salary_min: formData.salary_min,
    salary_max: formData.salary_max,
    mission: formData.mission,
    responsibilities: formData.responsibilities
  });
  
  navigate('/roles');
};
```

**Pros:**
- Simple to implement
- Immediate consistency
- No background jobs needed

**Cons:**
- Blocks UI during sync
- Could be slow with many jobs

### Option B: Database Trigger (Future Enhancement)

```sql
CREATE OR REPLACE FUNCTION sync_role_to_jobs()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs
  SET
    title = NEW.title,
    department = NEW.department,
    salary_min = NEW.salary_min,
    salary_max = NEW.salary_max,
    mission = NEW.mission,
    responsibilities = NEW.responsibilities
  WHERE role_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_update_sync
AFTER UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION sync_role_to_jobs();
```

**Pros:**
- Automatic, no app code needed
- Guaranteed consistency
- Non-blocking

**Cons:**
- More complex to debug
- Harder to add business logic

**Decision:** Start with Option A, migrate to Option B if performance issues arise.

## Migration Strategy

### Phase 1: Additive Changes Only

```sql
-- Migration 001: Add columns (non-breaking)
ALTER TABLE roles
ADD COLUMN IF NOT EXISTS salary_min INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS salary_max INTEGER DEFAULT 0;

-- Migration 002: Add foreign key (non-breaking)
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;

-- Backfill role_id based on title matching
UPDATE jobs
SET role_id = (
  SELECT id FROM roles
  WHERE roles.title = jobs.title
  LIMIT 1
)
WHERE role_id IS NULL;
```

### Phase 2: Normalization (Breaking - Future)

```sql
-- Migration 003: Remove redundant columns (breaking)
ALTER TABLE jobs
DROP COLUMN IF EXISTS department,
DROP COLUMN IF EXISTS salary_min,
DROP COLUMN IF EXISTS salary_max,
DROP COLUMN IF EXISTS mission,
DROP COLUMN IF EXISTS responsibilities;

-- Update queries to join with roles
CREATE VIEW jobs_with_role AS
SELECT
  j.*,
  r.department,
  r.salary_min,
  r.salary_max,
  r.mission,
  r.responsibilities
FROM jobs j
LEFT JOIN roles r ON j.role_id = r.id;
```

**Decision:** Defer Phase 2 until Phase 1 is stable and tested.

## Error Handling Strategy

### Frontend

```typescript
// EditRole.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    await updateRole(id, formData);
    await JobService.syncJobsByRoleId(id, updates);
    
    toast.success('Cargo atualizado com sucesso!');
    navigate('/roles');
  } catch (error) {
    console.error('Error updating role:', error);
    toast.error('Erro ao atualizar cargo. Tente novamente.');
  } finally {
    setIsLoading(false);
  }
};
```

### Backend (Service Layer)

```typescript
// JobService.ts
async syncJobsByRoleId(roleId: string, updates: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('role_id', roleId)
    .select();
  
  if (error) {
    console.error('[JobService] Sync failed:', error);
    throw new Error(`Failed to sync jobs: ${error.message}`);
  }
  
  console.log(`[JobService] Synced ${data.length} jobs`);
  return data;
}
```

## Performance Considerations

### Indexes

```sql
-- Critical for join performance
CREATE INDEX idx_jobs_role_id ON jobs(role_id);

-- For filtering/searching
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_roles_department ON roles(department);
```

### Query Optimization

```typescript
// Before (N+1 query problem)
const jobs = await getJobs();
for (const job of jobs) {
  const role = await getRole(job.title); // Bad!
}

// After (single join)
const jobs = await supabase
  .from('jobs')
  .select(`
    *,
    role:roles(*)
  `)
  .eq('status', 'Ativa');
```

## Security Considerations

### RLS Policy Audit

| Table | Action | Who | Policy |
|-------|--------|-----|--------|
| roles | SELECT | All | Public (job info) |
| roles | INSERT/UPDATE/DELETE | Admin only | Role-based |
| jobs | SELECT | All | Public (job listings) |
| jobs | INSERT/UPDATE/DELETE | Admin only | Role-based |
| candidates | INSERT | Authenticated + Anon | Self or public |
| candidates | SELECT | Self + Admin | User ID match or admin role |
| candidates | UPDATE/DELETE | Self + Admin | User ID match or admin role |

### Data Validation

```typescript
// Ensure salary ranges are valid
if (formData.salary_min > formData.salary_max) {
  toast.error('Salário mínimo não pode ser maior que o máximo');
  return;
}

// Ensure required fields
if (!formData.title || !formData.department) {
  toast.error('Preencha todos os campos obrigatórios');
  return;
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('JobService.syncJobsByRoleId', () => {
  it('updates all jobs with matching role_id', async () => {
    const roleId = 'test-role-id';
    const updates = { salary_min: 5000, salary_max: 8000 };
    
    const result = await JobService.syncJobsByRoleId(roleId, updates);
    
    expect(result).toHaveLength(2);
    expect(result[0].salary_min).toBe(5000);
  });
  
  it('throws error if sync fails', async () => {
    await expect(
      JobService.syncJobsByRoleId('invalid-id', {})
    ).rejects.toThrow();
  });
});
```

### Integration Tests

```typescript
describe('Role-Job Synchronization', () => {
  it('updates job when role salary changes', async () => {
    // 1. Create role
    const role = await createRole({ title: 'Developer', salary_min: 3000 });
    
    // 2. Create job from role
    const job = await createJob({ role_id: role.id });
    
    // 3. Update role salary
    await updateRole(role.id, { salary_min: 5000 });
    
    // 4. Verify job updated
    const updatedJob = await getJob(job.id);
    expect(updatedJob.salary_min).toBe(5000);
  });
});
```

### E2E Tests

```typescript
describe('Candidate Application Flow', () => {
  it('allows anonymous user to apply', async () => {
    await page.goto('/vagas');
    await page.click('text=Candidatar agora');
    
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.setInputFiles('[type="file"]', 'resume.pdf');
    
    await page.click('text=Finalizar candidatura');
    
    await expect(page).toHaveURL('/candidate/dashboard');
  });
});
```

## Rollback Plan

If critical issues arise:

1. **Revert migrations:**
   ```sql
   ALTER TABLE jobs DROP COLUMN role_id;
   ALTER TABLE roles DROP COLUMN salary_min, DROP COLUMN salary_max;
   ```

2. **Restore code:**
   ```bash
   git revert <commit-hash>
   ```

3. **Clear cache:**
   ```bash
   # Clear browser storage
   localStorage.clear();
   sessionStorage.clear();
   ```

## Future Enhancements

1. **Database triggers** for automatic sync (Option B)
2. **Audit logging** for salary changes
3. **Version history** for roles and jobs
4. **Bulk operations** for managing multiple jobs
5. **Real-time updates** using Supabase subscriptions

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)
