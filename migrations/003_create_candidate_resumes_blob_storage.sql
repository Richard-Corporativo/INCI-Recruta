-- Migration: 003_create_candidate_resumes_blob_storage.sql
-- Description: Create satellite table for in-database BLOB storage of resume PDFs
-- Author: OpenSpec Migration
-- Date: 2026-01-09

-- ============================================================================
-- PART 1: Create candidate_resumes table
-- ============================================================================

CREATE TABLE IF NOT EXISTS candidate_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL UNIQUE,
    file_data BYTEA NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    file_size INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Foreign key with CASCADE delete
    CONSTRAINT fk_candidate_resumes_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE,
    
    -- Validation constraints
    CONSTRAINT check_file_size CHECK (file_size > 0 AND file_size <= 5242880), -- Max 5MB
    CONSTRAINT check_mime_type CHECK (mime_type = 'application/pdf')
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_candidate_id 
    ON candidate_resumes(candidate_id);

-- ============================================================================
-- PART 2: Add has_resume flag to candidates table
-- ============================================================================

ALTER TABLE candidates 
    ADD COLUMN IF NOT EXISTS has_resume BOOLEAN DEFAULT FALSE;

-- Update existing records (if any resumes already exist)
UPDATE candidates
SET has_resume = TRUE
WHERE id IN (SELECT candidate_id FROM candidate_resumes);

-- ============================================================================
-- PART 3: Create trigger to maintain has_resume flag
-- ============================================================================

CREATE OR REPLACE FUNCTION update_candidate_has_resume()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Set flag to TRUE when resume is added/updated
        UPDATE candidates
        SET has_resume = TRUE
        WHERE id = NEW.candidate_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Set flag to FALSE when resume is deleted
        UPDATE candidates
        SET has_resume = FALSE
        WHERE id = OLD.candidate_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_has_resume
    AFTER INSERT OR UPDATE OR DELETE ON candidate_resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_candidate_has_resume();

-- ============================================================================
-- PART 4: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE candidate_resumes ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admin/Recruiter can view all resumes
CREATE POLICY "Admin can view all resumes"
    ON candidate_resumes
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    );

-- Policy 2: Candidates can only view their own resume
CREATE POLICY "Candidates can view own resume"
    ON candidate_resumes
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_resumes.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );

-- Policy 3: Admin/Recruiter can insert resumes
CREATE POLICY "Admin can insert resumes"
    ON candidate_resumes
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    );

-- Policy 4: Admin/Recruiter can update resumes
CREATE POLICY "Admin can update resumes"
    ON candidate_resumes
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    );

-- Policy 5: Admin/Recruiter can delete resumes
CREATE POLICY "Admin can delete resumes"
    ON candidate_resumes
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    );

-- ============================================================================
-- PART 5: Remove deprecated resume_url column (OPTIONAL - Run after migration)
-- ============================================================================

-- IMPORTANT: Only run this AFTER you've migrated all existing data
-- and confirmed the new BLOB storage is working correctly.

-- ALTER TABLE candidates DROP COLUMN IF EXISTS resume_url;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'candidate_resumes';

-- Verify columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'candidate_resumes'
ORDER BY ordinal_position;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'candidate_resumes';

-- Verify policies exist
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'candidate_resumes';

-- Verify trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_has_resume';

-- ============================================================================
-- ROLLBACK SCRIPT (In case of issues)
-- ============================================================================

/*
-- Rollback commands (run in reverse order):

DROP TRIGGER IF EXISTS trigger_update_has_resume ON candidate_resumes;
DROP FUNCTION IF EXISTS update_candidate_has_resume();
ALTER TABLE candidates DROP COLUMN IF EXISTS has_resume;
DROP TABLE IF EXISTS candidate_resumes CASCADE;

*/

-- ============================================================================
-- NOTES
-- ============================================================================

/*
1. This migration creates a satellite table to store PDF BLOBs separately
   from the main candidates table to preserve Kanban performance.

2. The has_resume flag is automatically maintained by a trigger, so you
   don't need to manually update it in your application code.

3. RLS policies ensure that:
   - Admins/Recruiters can manage all resumes
   - Candidates can only view their own resume
   - Unauthenticated users have no access

4. File size is limited to 5MB (5,242,880 bytes) at the database level.

5. Only PDF files are allowed (enforced by mime_type constraint).

6. The resume_url column is NOT dropped in this migration to allow for
   a gradual transition. Drop it manually after confirming everything works.

7. CASCADE delete ensures that when a candidate is deleted, their resume
   is automatically deleted as well.
*/
