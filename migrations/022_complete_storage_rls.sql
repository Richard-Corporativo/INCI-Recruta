-- ============================================================
-- Migration: 022_complete_storage_rls.sql
-- Desc: Complete RLS policies for resumes/avatars storage + tables
-- Task 4: Storage privado para currículo/avatar, RLS
-- ============================================================

-- ============================================================
-- PHASE 1: ENSURE AVATARS BUCKET EXISTS AND IS PRIVATE
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    false,
    2097152,
    '{image/jpeg,image/png,image/gif,image/webp}'
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================
-- PHASE 2: ENSURE RESUMES BUCKET IS PRIVATE
-- ============================================================

UPDATE storage.buckets
SET public = false
WHERE id = 'resumes';

-- ============================================================
-- PHASE 3: RLS POLICIES FOR STORAGE.OBJECTS — RESUMES BUCKET
-- ============================================================

-- Drop old public policy
DROP POLICY IF EXISTS "resumes_select_public" ON storage.objects;

-- Candidates can INSERT to their own folder: {candidateId}/resume.pdf
CREATE POLICY "resumes_insert_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- Candidates can SELECT their own resume
CREATE POLICY "resumes_select_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- Staff (admin, recruiter, manager, quality, dp) can SELECT all resumes
CREATE POLICY "resumes_select_staff"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'
  AND EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
  )
);

-- Candidates can UPDATE their own resume
CREATE POLICY "resumes_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- Candidates can DELETE their own resume
CREATE POLICY "resumes_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- ============================================================
-- PHASE 4: RLS POLICIES FOR STORAGE.OBJECTS — AVATARS BUCKET
-- ============================================================

-- Candidates can INSERT to their own folder: {candidateId}/avatar.{ext}
CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- Candidates can SELECT their own avatar
CREATE POLICY "avatars_select_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- Staff can SELECT all avatars
CREATE POLICY "avatars_select_staff"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
  )
);

-- Candidates can UPDATE their own avatar
CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- Candidates can DELETE their own avatar
CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id::text = (storage.foldername(name))[1]
      AND c.user_id = auth.uid()
  )
);

-- ============================================================
-- PHASE 5: RLS POLICIES FOR CANDIDATE_RESUMES TABLE
-- ============================================================

ALTER TABLE public.candidate_resumes ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "candidate_resumes_select_public" ON public.candidate_resumes;
DROP POLICY IF EXISTS "candidate_resumes_insert_public" ON public.candidate_resumes;

-- Candidates can SELECT their own resume metadata
CREATE POLICY "candidate_resumes_select_own"
ON public.candidate_resumes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id = public.candidate_resumes.candidate_id
      AND c.user_id = auth.uid()
  )
);

-- Staff can SELECT all resume metadata
CREATE POLICY "candidate_resumes_select_staff"
ON public.candidate_resumes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
  )
);

-- Candidates can INSERT their own resume metadata
CREATE POLICY "candidate_resumes_insert_own"
ON public.candidate_resumes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id = public.candidate_resumes.candidate_id
      AND c.user_id = auth.uid()
  )
);

-- Candidates can UPDATE their own resume metadata
CREATE POLICY "candidate_resumes_update_own"
ON public.candidate_resumes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id = public.candidate_resumes.candidate_id
      AND c.user_id = auth.uid()
  )
);

-- Candidates can DELETE their own resume metadata
CREATE POLICY "candidate_resumes_delete_own"
ON public.candidate_resumes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id = public.candidate_resumes.candidate_id
      AND c.user_id = auth.uid()
  )
);

-- ============================================================
-- PHASE 6: VERIFICATION
-- ============================================================

-- Verify storage buckets are private
SELECT id, name, public FROM storage.buckets WHERE id IN ('avatars', 'resumes');

-- Verify RLS policies exist
SELECT
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('candidate_resumes', 'candidate_avatars')
  OR (schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%avatars%' OR policyname LIKE '%resumes%')
ORDER BY tablename, policyname;
