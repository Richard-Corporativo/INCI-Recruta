-- Migration: 012_create_storage_buckets.sql
-- Description: Create the resumes bucket and ensure it exists before use.

-- 1. Create the 'resumes' bucket
-- We use the storage.buckets table directly as allowed in Supabase
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes', 
    'resumes', 
    true, 
    5242880, -- 5MB
    '{application/pdf}'
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Ensure RLS is enabled for storage.objects (if not already)
-- Note: Supabase usually manages this, but good to be explicit for policies to work.

-- 3. (Re)Apply Policies to ensure they match the bucket ID
DROP POLICY IF EXISTS "resumes_insert_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_select_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_update_own" ON storage.objects;
DROP POLICY IF EXISTS "resumes_delete_own" ON storage.objects;

-- Allows any authenticated user to upload to THEIR folder
CREATE POLICY "resumes_insert_auth"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Public access to read resumes (crucial for recruiters/links)
CREATE POLICY "resumes_select_public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- Users can update/delete their own folder
CREATE POLICY "resumes_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "resumes_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
