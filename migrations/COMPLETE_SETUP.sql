-- ============================================
-- SCRIPT COMPLETO DE MIGRATIONS E RLS POLICIES
-- Execute este script no Supabase SQL Editor
-- Data: 2026-01-06
-- VERSÃO CORRIGIDA (sem storage.policies)
-- ============================================

-- ============================================
-- PHASE 1: DATABASE SCHEMA FIXES
-- ============================================

-- Migration 001: Add salary columns to roles table
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS salary_min INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS salary_max INTEGER DEFAULT 0;

COMMENT ON COLUMN roles.salary_min IS 'Minimum monthly salary for this role in BRL';
COMMENT ON COLUMN roles.salary_max IS 'Maximum monthly salary for this role in BRL';

-- Migration 002: Add role_id foreign key to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;

-- Backfill existing jobs with role_id based on title matching
UPDATE jobs 
SET role_id = (
    SELECT id FROM roles 
    WHERE roles.title = jobs.title 
    LIMIT 1
)
WHERE role_id IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_jobs_role_id ON jobs(role_id);

COMMENT ON COLUMN jobs.role_id IS 'Foreign key reference to the role this job is based on';

-- ============================================
-- VERIFICATION QUERIES - PHASE 1
-- ============================================

-- Verify roles table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'roles' 
AND column_name IN ('salary_min', 'salary_max');

-- Verify jobs table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name = 'role_id';

-- Verify foreign key constraint
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'jobs'
    AND kcu.column_name = 'role_id';

-- Verify index exists
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'jobs' 
AND indexname = 'idx_jobs_role_id';

-- Check how many jobs were linked to roles
SELECT 
    COUNT(*) FILTER (WHERE role_id IS NOT NULL) as jobs_with_role,
    COUNT(*) FILTER (WHERE role_id IS NULL) as jobs_without_role,
    COUNT(*) as total_jobs
FROM jobs;

-- ============================================
-- PHASE 2: RLS POLICY CONFIGURATION
-- ============================================

-- ============================================
-- 2.1 Configure candidates table policies
-- ============================================

-- Enable RLS on candidates table
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "candidates_insert_auth" ON candidates;
DROP POLICY IF EXISTS "candidates_insert_anon" ON candidates;
DROP POLICY IF EXISTS "candidates_select_own" ON candidates;
DROP POLICY IF EXISTS "candidates_select_admin" ON candidates;
DROP POLICY IF EXISTS "candidates_update_own" ON candidates;
DROP POLICY IF EXISTS "candidates_delete_own" ON candidates;

-- Policy 1: Authenticated users can insert their own applications
CREATE POLICY "candidates_insert_auth"
ON candidates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Users can view only their own applications
CREATE POLICY "candidates_select_own"
ON candidates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Admins can view all applications
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

-- Policy 5: Users can update their own applications
CREATE POLICY "candidates_update_own"
ON candidates FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 6: Users can delete their own applications (withdrawal)
CREATE POLICY "candidates_delete_own"
ON candidates FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 2.2 Configure storage policies for resumes
-- ============================================

-- Note: Storage policies must be configured via Supabase Dashboard
-- Go to: Storage > Policies > resumes bucket
-- Create the following policies:

-- DROP existing policies if any
DROP POLICY IF EXISTS "resumes_insert_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_select_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_update_own" ON storage.objects;
DROP POLICY IF EXISTS "resumes_delete_own" ON storage.objects;

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

-- Policy 3: Users can update their own resumes
CREATE POLICY "resumes_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy 4: Users can delete their own resumes
CREATE POLICY "resumes_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- VERIFICATION QUERIES FOR RLS
-- ============================================

-- Verify RLS is enabled on candidates
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'candidates';

-- List all policies on candidates table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'candidates'
ORDER BY policyname;

-- Verify storage policies exist (via storage.objects)
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- FINAL VERIFICATION
-- ============================================

-- Summary of changes
SELECT 
    'Roles table updated' as change,
    COUNT(*) FILTER (WHERE salary_min IS NOT NULL OR salary_max IS NOT NULL) as affected_rows
FROM roles
UNION ALL
SELECT 
    'Jobs table updated',
    COUNT(*) FILTER (WHERE role_id IS NOT NULL)
FROM jobs
UNION ALL
SELECT 
    'Candidates policies created',
    COUNT(*)
FROM pg_policies 
WHERE tablename = 'candidates'
UNION ALL
SELECT 
    'Storage policies created',
    COUNT(*)
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ All migrations and RLS policies have been applied successfully!';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '1. Verify storage policies in Supabase Dashboard > Storage > Policies';
    RAISE NOTICE '2. Test role salary management in the admin panel';
    RAISE NOTICE '3. Test job creation and verify role_id is saved';
    RAISE NOTICE '4. Test candidate application submission';
    RAISE NOTICE '5. Test resume upload';
    RAISE NOTICE '6. Verify data synchronization between roles and jobs';
END $$;
