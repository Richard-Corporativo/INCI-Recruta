-- Migration 018: RLS policies for roles and jobs tables
-- Both tables were created via Supabase Dashboard (RLS enabled by default)
-- but had no policies, causing silent INSERT/SELECT failures.

-- ============================================================
-- ROLES TABLE
-- ============================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "roles_select_authenticated" ON public.roles;
DROP POLICY IF EXISTS "roles_insert_staff"          ON public.roles;
DROP POLICY IF EXISTS "roles_update_staff"          ON public.roles;
DROP POLICY IF EXISTS "roles_delete_staff"          ON public.roles;

-- Any authenticated user can read roles (needed for job creation dropdown)
CREATE POLICY "roles_select_authenticated"
ON public.roles FOR SELECT TO authenticated
USING (true);

-- Only staff roles can create/edit/delete
CREATE POLICY "roles_insert_staff"
ON public.roles FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality')
  )
);

CREATE POLICY "roles_update_staff"
ON public.roles FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality')
  )
);

CREATE POLICY "roles_delete_staff"
ON public.roles FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality')
  )
);

-- ============================================================
-- JOBS TABLE
-- ============================================================
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "jobs_select_active_public"  ON public.jobs;
DROP POLICY IF EXISTS "jobs_select_staff"           ON public.jobs;
DROP POLICY IF EXISTS "jobs_insert_staff"           ON public.jobs;
DROP POLICY IF EXISTS "jobs_update_staff"           ON public.jobs;
DROP POLICY IF EXISTS "jobs_delete_staff"           ON public.jobs;
-- Drop legacy policy names that may exist from db_init.sql
DROP POLICY IF EXISTS "Public read access for active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters/Admins full access"      ON public.jobs;

-- Candidates (and anonymous) can see active jobs
CREATE POLICY "jobs_select_active_public"
ON public.jobs FOR SELECT
USING (status = 'Ativa');

-- Staff can see all jobs regardless of status
CREATE POLICY "jobs_select_staff"
ON public.jobs FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
  )
);

-- Only staff can create jobs
CREATE POLICY "jobs_insert_staff"
ON public.jobs FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager')
  )
);

-- Only staff can update jobs
CREATE POLICY "jobs_update_staff"
ON public.jobs FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager')
  )
);

-- Only admin can delete jobs
CREATE POLICY "jobs_delete_staff"
ON public.jobs FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'recruiter', 'manager')
  )
);

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('roles', 'jobs')
ORDER BY tablename, policyname;
