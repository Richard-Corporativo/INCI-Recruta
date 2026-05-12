-- Migration: 20260507_company_job_analytics.sql
-- Description: Scope analytics by company and expose per-job status metrics.

CREATE INDEX IF NOT EXISTS idx_analytics_job_id ON public.analytics_events(job_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_job ON public.analytics_events(event_name, job_id);

DROP POLICY IF EXISTS "Allow admins to read events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow company users to read job analytics events" ON public.analytics_events;

CREATE POLICY "Allow company users to read job analytics events" ON public.analytics_events
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users viewer
    LEFT JOIN public.jobs event_job
      ON event_job.id = analytics_events.job_id
    LEFT JOIN public.users job_owner
      ON job_owner.id = event_job.manager_id
    WHERE viewer.id = auth.uid()
      AND (
        viewer.role = 'admin'
        OR (
          viewer.role IN ('manager', 'recruiter', 'quality', 'dp')
          AND analytics_events.job_id IS NOT NULL
          AND (
            event_job.manager_id = viewer.id
            OR (
              viewer.company_name IS NOT NULL
              AND job_owner.company_name = viewer.company_name
            )
          )
        )
      )
  )
);

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
    SELECT id, role, company_name
    FROM public.users
    WHERE id = auth.uid()
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
  LEFT JOIN public.users job_owner
    ON job_owner.id = jobs.manager_id
  LEFT JOIN public.analytics_events
    ON analytics_events.job_id = jobs.id
    AND analytics_events.event_name IN ('job_click', 'application_started', 'application_completed')
  WHERE current_profile.id IS NOT NULL
    AND (
      current_profile.role = 'admin'
      OR jobs.manager_id = current_profile.id
      OR (
        current_profile.company_name IS NOT NULL
        AND job_owner.company_name = current_profile.company_name
      )
    )
  GROUP BY jobs.id, jobs.title, jobs.status, jobs.department, jobs.created_at
  ORDER BY jobs.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_job_analytics() TO authenticated;
