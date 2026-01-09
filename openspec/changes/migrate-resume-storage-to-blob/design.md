# Design: In-Database BLOB Storage Architecture

## Change ID
`migrate-resume-storage-to-blob`

## Architectural Overview

### Current Architecture (Storage-Based)
```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Frontend   │─────▶│ CandidateService │─────▶│ Supabase        │
│             │      │                  │      │ Storage Bucket  │
│ File Upload │      │ uploadResume()   │      │ /resumes/...    │
└─────────────┘      └──────────────────┘      └─────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ candidates table │
                     │ - resume_url     │ ◀── URL reference
                     └──────────────────┘
```

### Proposed Architecture (BLOB-Based)
```
┌─────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Frontend   │─────▶│ CandidateService │─────▶│ candidates       │
│             │      │                  │      │ - has_resume     │
│ File Upload │      │ addCandidate()   │      └──────────────────┘
│ (Binary)    │      │ + addResume()    │               │
└─────────────┘      └──────────────────┘               │ 1:1
                                                         ▼
                                                ┌──────────────────┐
                                                │candidate_resumes │
                                                │ - file_data      │ ◀── BLOB
                                                │ - file_name      │
                                                │ - mime_type      │
                                                │ - file_size      │
                                                └──────────────────┘
```

## Database Schema Design

### New Table: `candidate_resumes`

```sql
CREATE TABLE candidate_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
    file_data BYTEA NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    file_size INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_candidate_resumes_candidate_id ON candidate_resumes(candidate_id);

-- RLS Policies
ALTER TABLE candidate_resumes ENABLE ROW LEVEL SECURITY;

-- Admin/Recruiter can view all resumes
CREATE POLICY "Admin can view all resumes"
    ON candidate_resumes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    );

-- Candidates can only view their own resume
CREATE POLICY "Candidates can view own resume"
    ON candidate_resumes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_resumes.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );

-- Admin/Recruiter can insert/update/delete
CREATE POLICY "Admin can manage resumes"
    ON candidate_resumes FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    );
```

### Modified Table: `candidates`

```sql
-- Remove resume_url column (deprecated)
ALTER TABLE candidates DROP COLUMN IF EXISTS resume_url;

-- Add optional flag for UI optimization
ALTER TABLE candidates ADD COLUMN has_resume BOOLEAN DEFAULT FALSE;

-- Update trigger to maintain has_resume flag
CREATE OR REPLACE FUNCTION update_candidate_has_resume()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE candidates
        SET has_resume = TRUE
        WHERE id = NEW.candidate_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE candidates
        SET has_resume = FALSE
        WHERE id = OLD.candidate_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_has_resume
AFTER INSERT OR UPDATE OR DELETE ON candidate_resumes
FOR EACH ROW EXECUTE FUNCTION update_candidate_has_resume();
```

## Service Layer Design

### Updated `CandidateService` Interface

```typescript
export const CandidateService = {
    // Modified: No longer returns URL, returns boolean success
    async uploadResume(file: File, candidateId: string): Promise<boolean>
    
    // New: Download resume as Blob
    async downloadResume(candidateId: string): Promise<{ blob: Blob; fileName: string } | null>
    
    // New: Check if candidate has resume
    async hasResume(candidateId: string): Promise<boolean>
    
    // New: Delete resume
    async deleteResume(candidateId: string): Promise<boolean>
    
    // Modified: addCandidate now handles resume in same transaction
    async addCandidate(
        candidate: Omit<Candidate, 'id' | 'applied_at'>,
        resumeFile?: File
    ): Promise<Candidate | null>
}
```

### Binary Data Handling

#### Frontend → Backend (Upload)
```typescript
// Convert File to ArrayBuffer
const arrayBuffer = await file.arrayBuffer();
const uint8Array = new Uint8Array(arrayBuffer);

// Send to Supabase
await supabase.from('candidate_resumes').insert({
    candidate_id: candidateId,
    file_data: uint8Array,
    file_name: file.name,
    mime_type: file.type,
    file_size: file.size
});
```

#### Backend → Frontend (Download)
```typescript
// Fetch binary data
const { data } = await supabase
    .from('candidate_resumes')
    .select('file_data, file_name, mime_type')
    .eq('candidate_id', candidateId)
    .single();

// Convert to Blob
const blob = new Blob([data.file_data], { type: data.mime_type });

// Create download URL
const url = URL.createObjectURL(blob);
```

## Performance Considerations

### Query Optimization

#### ❌ **NEVER DO THIS** (Kills Performance)
```typescript
// BAD: Fetches BLOB in listing queries
const { data } = await supabase
    .from('candidates')
    .select('*, candidate_resumes(*)');  // ← Loads all BLOBs!
```

#### ✅ **CORRECT APPROACH**
```typescript
// GOOD: Only fetch metadata for listings
const { data } = await supabase
    .from('candidates')
    .select('id, name, email, has_resume');  // ← Lightweight

// GOOD: Fetch BLOB only when needed
const { data: resume } = await supabase
    .from('candidate_resumes')
    .select('file_data, file_name')
    .eq('candidate_id', candidateId)
    .single();
```

### Size Limits

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateResumeFile(file: File): void {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('Resume must be smaller than 5MB');
    }
    if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
    }
}
```

## Data Migration Strategy

### Phase 1: Schema Changes (Zero Downtime)
1. Create `candidate_resumes` table
2. Add `has_resume` column to `candidates`
3. Deploy new code (dual-mode: reads from both Storage and DB)

### Phase 2: Data Migration (Manual)
```sql
-- Manual script to migrate existing resumes
-- (Run outside of application deployment)
-- This is OUT OF SCOPE for this change
```

### Phase 3: Cleanup
1. Remove `resume_url` column from `candidates`
2. Remove Storage-related code
3. Archive/delete Storage bucket

## Security Considerations

### RLS Policies
- **Admins/Recruiters**: Full access to all resumes
- **Candidates**: Can only view their own resume
- **Public**: No access

### Validation
- File type: PDF only
- File size: Max 5MB
- MIME type verification
- Virus scanning: **OUT OF SCOPE** (future enhancement)

## Error Handling

```typescript
try {
    await CandidateService.uploadResume(file, candidateId);
} catch (error) {
    if (error.code === '22P02') {
        // Invalid binary data
        throw new Error('Invalid file format');
    } else if (error.code === '23505') {
        // Duplicate resume (UNIQUE constraint)
        throw new Error('Resume already exists for this candidate');
    } else {
        throw new Error('Failed to upload resume');
    }
}
```

## Testing Strategy

### Unit Tests
- [ ] File validation (size, type)
- [ ] Binary conversion (File → Uint8Array)
- [ ] BLOB retrieval (Uint8Array → Blob)

### Integration Tests
- [ ] Upload resume with candidate creation
- [ ] Download resume and verify content
- [ ] Delete resume and verify cascade
- [ ] RLS policy enforcement

### Performance Tests
- [ ] Kanban load time with 100 candidates (target: < 500ms)
- [ ] Resume download time for 5MB file (target: < 2s)
- [ ] Database size growth monitoring

## Rollback Plan

If issues arise:
1. **Immediate**: Revert to previous deployment (Storage-based code)
2. **Database**: Keep `candidate_resumes` table (no data loss)
3. **Cleanup**: Drop table and column after confirming rollback success

---

**Design Status**: ✅ Ready for Implementation  
**Reviewed By**: [Pending]  
**Approved By**: [Pending]
