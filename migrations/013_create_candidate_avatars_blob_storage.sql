-- Migration: 013_create_candidate_avatars_blob_storage.sql
-- Description: Create satellite table for in-database BLOB storage of profile photos (avatars)
-- Author: Antigravity
-- Date: 2026-01-28

-- ============================================================================
-- PART 1: Create candidate_avatars table
-- ============================================================================

CREATE TABLE IF NOT EXISTS candidate_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL UNIQUE,
    file_data BYTEA NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Foreign key with CASCADE delete
    CONSTRAINT fk_candidate_avatars_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE,
    
    -- Validation constraints
    CONSTRAINT check_avatar_file_size CHECK (file_size > 0 AND file_size <= 2097152) -- Max 2MB
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_candidate_avatars_candidate_id 
    ON candidate_avatars(candidate_id);

-- ============================================================================
-- PART 3: Add has_avatar flag to candidates table
-- ============================================================================

ALTER TABLE candidates 
    ADD COLUMN IF NOT EXISTS has_avatar BOOLEAN DEFAULT FALSE;

-- Update existing records if any
UPDATE candidates
SET has_avatar = TRUE
WHERE id IN (SELECT candidate_id FROM candidate_avatars);

-- ============================================================================
-- PART 4: Create trigger to maintain has_avatar flag
-- ============================================================================

CREATE OR REPLACE FUNCTION update_candidate_has_avatar()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE candidates
        SET has_avatar = TRUE
        WHERE id = NEW.candidate_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE candidates
        SET has_avatar = FALSE
        WHERE id = OLD.candidate_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_has_avatar
    AFTER INSERT OR UPDATE OR DELETE ON candidate_avatars
    FOR EACH ROW
    EXECUTE FUNCTION update_candidate_has_avatar();

-- ============================================================================
-- PART 5: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE candidate_avatars ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admin/Recruiter can view all avatars
CREATE POLICY "Admin can view all avatars"
    ON candidate_avatars
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
        )
    );

-- Policy 2: Candidates can only view their own avatar
CREATE POLICY "Candidates can view own avatar"
    ON candidate_avatars
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_avatars.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );

-- Policy 3: Public can view avatars (if necessary for public pages, otherwise remove)
CREATE POLICY "Public can view avatars"
    ON candidate_avatars
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy 4: Candidates can manage their own avatar
CREATE POLICY "Candidates can insert own avatar"
    ON candidate_avatars
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_avatars.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );

CREATE POLICY "Candidates can update own avatar"
    ON candidate_avatars
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_avatars.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );

CREATE POLICY "Candidates can delete own avatar"
    ON candidate_avatars
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_avatars.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );
