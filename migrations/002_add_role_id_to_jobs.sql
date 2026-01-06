-- ============================================
-- MIGRATION: Add Role Reference to Jobs Table
-- Date: 2026-01-06
-- Description: Creates a proper foreign key relationship between jobs and roles
-- ============================================

-- Add role_id column to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;

-- Try to populate role_id based on matching titles (best effort)
UPDATE jobs 
SET role_id = (
    SELECT id 
    FROM roles 
    WHERE roles.title = jobs.title 
    LIMIT 1
)
WHERE role_id IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_jobs_role_id ON jobs(role_id);

-- Add comment for documentation
COMMENT ON COLUMN jobs.role_id IS 'Foreign key reference to the role this job is based on';

-- Verify the changes
SELECT 
    j.id,
    j.title,
    j.role_id,
    r.title as role_title
FROM jobs j
LEFT JOIN roles r ON j.role_id = r.id
LIMIT 5;
