# Tasks: Migrate Resume Storage to BLOB

## Change ID
`migrate-resume-storage-to-blob`

---

## Task Breakdown

### 🗄️ Phase 1: Database Schema (2 hours)

#### Task 1.1: Create `candidate_resumes` Table
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Steps**:
1. Create migration file `003_create_candidate_resumes_table.sql`
2. Define table schema with columns:
   - `id` (UUID, PK)
   - `candidate_id` (UUID, FK → candidates.id, UNIQUE)
   - `file_data` (BYTEA)
   - `file_name` (TEXT)
   - `mime_type` (TEXT)
   - `file_size` (INTEGER)
   - `created_at`, `updated_at` (TIMESTAMPTZ)
3. Add index on `candidate_id`
4. Add `ON DELETE CASCADE` constraint

**Validation**:
```sql
-- Verify table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'candidate_resumes';

-- Verify columns
\d candidate_resumes
```

**Dependencies**: None

---

#### Task 1.2: Configure RLS Policies
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Steps**:
1. Enable RLS on `candidate_resumes`
2. Create policy: "Admin can view all resumes"
3. Create policy: "Candidates can view own resume"
4. Create policy: "Admin can manage resumes"
5. Test policies with different user roles

**Validation**:
```sql
-- Verify RLS enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'candidate_resumes';

-- List policies
SELECT policyname FROM pg_policies 
WHERE tablename = 'candidate_resumes';
```

**Dependencies**: Task 1.1

---

#### Task 1.3: Modify `candidates` Table
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Steps**:
1. Add `has_resume` BOOLEAN column (default FALSE)
2. Create trigger function `update_candidate_has_resume()`
3. Create trigger on `candidate_resumes` INSERT/UPDATE/DELETE
4. Test trigger with sample data

**Validation**:
```sql
-- Verify column exists
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'candidates' AND column_name = 'has_resume';

-- Test trigger
INSERT INTO candidate_resumes (...) VALUES (...);
SELECT has_resume FROM candidates WHERE id = '...';
```

**Dependencies**: Task 1.1

---

#### Task 1.4: Deploy Database Changes
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Steps**:
1. Review migration SQL in Supabase SQL Editor
2. Execute migration on development environment
3. Verify all constraints and triggers work
4. Document rollback procedure
5. Execute on production (if approved)

**Validation**:
- All tables exist
- All policies active
- Triggers functioning
- No data loss

**Dependencies**: Tasks 1.1, 1.2, 1.3

---

### 🔧 Phase 2: Service Layer (4 hours)

#### Task 2.1: Update TypeScript Types
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Steps**:
1. Remove `resume_url` from `Candidate` interface in `types.ts`
2. Add `has_resume?: boolean` to `Candidate` interface
3. Create new interface `CandidateResume`:
   ```typescript
   interface CandidateResume {
     id: string;
     candidate_id: string;
     file_data: Uint8Array;
     file_name: string;
     mime_type: string;
     file_size: number;
     created_at: string;
   }
   ```
4. Update all type references in codebase

**Validation**:
```bash
npm run build  # Should compile without errors
```

**Dependencies**: None (can run in parallel with DB tasks)

---

#### Task 2.2: Implement Binary Upload Logic
**Priority**: P0 (Blocking)  
**Estimate**: 1 hour

**Steps**:
1. Update `CandidateService.uploadResume()`:
   - Change signature: `(file: File, candidateId: string) => Promise<boolean>`
   - Convert File to Uint8Array
   - Insert into `candidate_resumes` table
   - Remove Storage bucket code
2. Add file validation:
   - Max size: 5MB
   - Type: PDF only
3. Add error handling for duplicate resumes

**Validation**:
- Upload 1MB PDF → Success
- Upload 6MB PDF → Error
- Upload .docx → Error
- Upload duplicate → Error

**Dependencies**: Tasks 1.1, 2.1

---

#### Task 2.3: Implement Binary Download Logic
**Priority**: P0 (Blocking)  
**Estimate**: 1 hour

**Steps**:
1. Create `CandidateService.downloadResume()`:
   ```typescript
   async downloadResume(candidateId: string): Promise<{
     blob: Blob;
     fileName: string;
   } | null>
   ```
2. Fetch binary data from `candidate_resumes`
3. Convert Uint8Array to Blob
4. Return Blob with original filename
5. Handle "resume not found" case

**Validation**:
- Download existing resume → Returns Blob
- Download non-existent resume → Returns null
- Blob opens correctly in browser

**Dependencies**: Task 1.1, 2.1

---

#### Task 2.4: Update `addCandidate` Method
**Priority**: P0 (Blocking)  
**Estimate**: 1 hour

**Steps**:
1. Modify `CandidateService.addCandidate()`:
   - Add optional `resumeFile?: File` parameter
   - Use transaction to insert candidate + resume atomically
   - Remove `resume_url` from insert payload
2. Update all callers to pass File instead of URL
3. Handle resume upload failure (rollback candidate insert)

**Validation**:
- Create candidate with resume → Both inserted
- Create candidate without resume → Only candidate inserted
- Resume upload fails → Candidate not created (rollback)

**Dependencies**: Tasks 2.2, 2.3

---

#### Task 2.5: Add Helper Methods
**Priority**: P1 (Nice to have)  
**Estimate**: 30 minutes

**Steps**:
1. Create `CandidateService.hasResume(candidateId)` → boolean
2. Create `CandidateService.deleteResume(candidateId)` → boolean
3. Add JSDoc comments to all methods

**Validation**:
- `hasResume()` returns correct boolean
- `deleteResume()` removes resume and updates `has_resume` flag

**Dependencies**: Task 2.1

---

### 🎨 Phase 3: Frontend Updates (4 hours)

#### Task 3.1: Update File Upload Components
**Priority**: P0 (Blocking)  
**Estimate**: 1.5 hours

**Files to Update**:
- `pages/public/JobApplication.tsx`
- `pages/candidate/CandidateSettings.tsx`

**Steps**:
1. Remove Storage URL handling code
2. Update to pass File object directly to `CandidateService`
3. Update success messages (no URL to display)
4. Add file size validation in UI (before upload)
5. Update loading states

**Validation**:
- Upload resume via job application → Success
- Upload resume in candidate settings → Success
- UI shows appropriate loading/success states

**Dependencies**: Task 2.4

---

#### Task 3.2: Update Resume Display/Download
**Priority**: P0 (Blocking)  
**Estimate**: 1.5 hours

**Files to Update**:
- `components/QuickViewDrawer.tsx`
- `components/CandidateProfileDrawer.tsx`
- Any component showing resume links

**Steps**:
1. Replace `<a href={resume_url}>` with download button
2. Implement download handler:
   ```typescript
   const handleDownload = async () => {
     const resume = await CandidateService.downloadResume(candidateId);
     if (resume) {
       const url = URL.createObjectURL(resume.blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = resume.fileName;
       a.click();
       URL.revokeObjectURL(url);
     }
   };
   ```
3. Show "Download Resume" button only if `has_resume === true`
4. Add loading state during download

**Validation**:
- Click download → PDF downloads correctly
- No resume → Button hidden or disabled
- Download fails → Error message shown

**Dependencies**: Task 2.3

---

#### Task 3.3: Update Candidate Listings
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Files to Update**:
- `pages/Kanban.tsx`
- `pages/TalentBank.tsx`
- Any component listing candidates

**Steps**:
1. Verify queries do NOT fetch `candidate_resumes` table
2. Use `has_resume` flag to show resume icon
3. Remove any `resume_url` references

**Validation**:
```typescript
// Ensure this pattern is used:
const { data } = await supabase
  .from('candidates')
  .select('id, name, email, has_resume')  // ← No BLOB data
  .eq('job_id', jobId);
```

**Dependencies**: Task 2.1

---

#### Task 3.4: Remove Storage Dependencies
**Priority**: P1 (Cleanup)  
**Estimate**: 30 minutes

**Steps**:
1. Search codebase for `supabase.storage`
2. Remove all Storage-related imports
3. Remove `uploadResume` Storage implementation
4. Update `lib/storage.ts` deprecation notice
5. Clean up unused code

**Validation**:
```bash
# Should return no results:
rg "supabase\.storage" --type ts --type tsx
rg "resume_url" --type ts --type tsx
```

**Dependencies**: All previous frontend tasks

---

### ✅ Phase 4: Testing & Validation (2 hours)

#### Task 4.1: Manual Testing
**Priority**: P0 (Blocking)  
**Estimate**: 1 hour

**Test Cases**:
1. ✅ Upload resume during job application
2. ✅ Upload resume in candidate settings
3. ✅ Download resume from Kanban card
4. ✅ Download resume from profile drawer
5. ✅ Delete candidate with resume (cascade delete)
6. ✅ Kanban loads quickly with 50+ candidates
7. ✅ File size validation (reject > 5MB)
8. ✅ File type validation (reject non-PDF)

**Dependencies**: All implementation tasks

---

#### Task 4.2: Performance Testing
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Metrics to Measure**:
- Kanban load time (target: < 500ms)
- Resume download time for 5MB file (target: < 2s)
- Database size increase per resume

**Tools**:
- Chrome DevTools Network tab
- Supabase Dashboard (Database size)

**Validation**:
- All metrics within acceptable range
- No performance regression vs. Storage-based approach

**Dependencies**: Task 4.1

---

#### Task 4.3: Security Testing
**Priority**: P0 (Blocking)  
**Estimate**: 30 minutes

**Test Cases**:
1. ✅ Candidate can download own resume
2. ❌ Candidate cannot download other candidate's resume
3. ✅ Admin can download any resume
4. ❌ Unauthenticated user cannot access resumes
5. ✅ RLS policies prevent direct table access

**Dependencies**: Task 4.1

---

## Task Summary

| Phase | Tasks | Estimated Time | Priority |
|-------|-------|----------------|----------|
| Database Schema | 4 tasks | 2 hours | P0 |
| Service Layer | 5 tasks | 4 hours | P0 |
| Frontend Updates | 4 tasks | 4 hours | P0 |
| Testing & Validation | 3 tasks | 2 hours | P0 |
| **TOTAL** | **16 tasks** | **~12 hours** | - |

## Parallelization Opportunities

These tasks can run in parallel:
- Task 2.1 (TypeScript types) can start before DB tasks complete
- Frontend tasks can be split among multiple developers
- Testing can overlap with final implementation tasks

## Critical Path

```
1.1 → 1.2 → 1.3 → 1.4 (Database)
  ↓
2.1 → 2.2 → 2.3 → 2.4 (Service Layer)
  ↓
3.1 → 3.2 → 3.3 (Frontend)
  ↓
4.1 → 4.2 → 4.3 (Testing)
```

## Rollback Checkpoints

- ✅ After Task 1.4: Database changes deployed (can rollback schema)
- ✅ After Task 2.4: Service layer complete (can rollback code)
- ✅ After Task 3.4: Frontend complete (can rollback deployment)

---

**Status**: 📋 Ready for Implementation  
**Next Step**: Begin with Phase 1 (Database Schema)
