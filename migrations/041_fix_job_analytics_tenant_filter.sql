-- Migration 041: fix get_company_job_analytics() — substituir company_name por company_id
-- Motivo: comparação por nome (string) vaza analytics entre empresas com nomes similares.
-- Fix: usar company_members para resolver company_id do usuário autenticado.

-- 1. Recriar RLS policy em analytics_events com filtro por company_id
DROP POLICY IF EXISTS "Allow company users to read job analytics events" ON public.analytics_events;

CREATE POLICY "Allow company users to read job analytics events" ON public.analytics_events
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users viewer
    LEFT JOIN public.company_members viewer_cm
      ON viewer_cm.user_id = viewer.id
      AND viewer_cm.status = 'active'
    LEFT JOIN public.jobs event_job
      ON event_job.id = analytics_events.job_id
    WHERE viewer.id = auth.uid()
      AND (
        viewer.role = 'admin'
        OR public.is_super_admin()
        OR (
          analytics_events.job_id IS NOT NULL
          AND event_job.company_id = viewer_cm.company_id
          AND (
            event_job.manager_id = viewer.id
            OR viewer.role IN ('manager', 'recruiter', 'quality', 'dp')
          )
        )
      )
  )
);

-- 2. Recriar RPC get_company_job_analytics() com filtro por company_id
DROP FUNCTION IF EXISTS public.get_company_job_analytics();

CREATE OR REPLACE FUNCTION public.get_company_job_analytics()
RETURNS TABLE (
  job_id UUID,
  job_title TEXT,
  job_status TEXT,
  department TEXT,
  created_at TEXT,
  job_clicks BIGINT,
  job_clicks_unique BIGINT,
  application_starts BIGINT,
  application_starts_unique BIGINT,
  application_completed BIGINT,
  application_completed_unique BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH current_profile AS (
    SELECT u.id, u.role, cm.company_id
    FROM public.users u
    LEFT JOIN public.company_members cm
      ON cm.user_id = u.id
      AND cm.status = 'active'
    WHERE u.id = auth.uid()
  )
  SELECT
    jobs.id AS job_id,
    jobs.title::TEXT AS job_title,
    jobs.status::TEXT AS job_status,
    jobs.department::TEXT AS department,
    jobs.created_at::TEXT,
    COUNT(analytics_events.id) FILTER (WHERE analytics_events.event_name = 'job_click') AS job_clicks,
    COUNT(DISTINCT analytics_events.session_id) FILTER (WHERE analytics_events.event_name = 'job_click') AS job_clicks_unique,
    COUNT(analytics_events.id) FILTER (WHERE analytics_events.event_name = 'application_started') AS application_starts,
    COUNT(DISTINCT analytics_events.session_id) FILTER (WHERE analytics_events.event_name = 'application_started') AS application_starts_unique,
    COUNT(analytics_events.id) FILTER (WHERE analytics_events.event_name = 'application_completed') AS application_completed,
    COUNT(DISTINCT analytics_events.session_id) FILTER (WHERE analytics_events.event_name = 'application_completed') AS application_completed_unique
  FROM public.jobs
  CROSS JOIN current_profile
  LEFT JOIN public.analytics_events
    ON analytics_events.job_id = jobs.id
    AND analytics_events.event_name IN ('job_click', 'application_started', 'application_completed')
  WHERE current_profile.id IS NOT NULL
    AND jobs.company_id = current_profile.company_id
    AND (
      current_profile.role IN ('owner', 'admin')
      OR public.is_super_admin()
      OR jobs.manager_id = current_profile.id
      OR current_profile.role IN ('recruiter', 'quality', 'dp')
    )
  GROUP BY jobs.id, jobs.title, jobs.status, jobs.department, jobs.created_at
  ORDER BY jobs.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_job_analytics() TO authenticated;
