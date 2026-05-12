-- Migration 032: Create analytics_events table and get_company_job_analytics function
-- Tracks funnel events (job clicks, application starts/completions) per company

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name  TEXT NOT NULL,
    user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_id  UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    job_id      UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    session_id  TEXT,
    metadata    JSONB DEFAULT '{}',
    url         TEXT,
    referrer    TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS analytics_events_company_id_idx ON public.analytics_events (company_id);
CREATE INDEX IF NOT EXISTS analytics_events_job_id_idx ON public.analytics_events (job_id);
CREATE INDEX IF NOT EXISTS analytics_events_event_name_idx ON public.analytics_events (event_name);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Public can insert events (anonymous tracking)
DROP POLICY IF EXISTS "analytics_events_insert_public" ON public.analytics_events;
CREATE POLICY "analytics_events_insert_public" ON public.analytics_events
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Staff can read their own company's events; super_admin reads all
DROP POLICY IF EXISTS "analytics_events_select_tenant" ON public.analytics_events;
CREATE POLICY "analytics_events_select_tenant" ON public.analytics_events
    FOR SELECT TO authenticated
    USING (
        company_id = public.current_company_id()
        OR public.is_super_admin()
    );

-- =====================================================================
-- Function: get_company_job_analytics
-- Returns funnel metrics per job for the authenticated user's company
-- =====================================================================
DROP FUNCTION IF EXISTS public.get_company_job_analytics();

CREATE OR REPLACE FUNCTION public.get_company_job_analytics()
RETURNS TABLE (
    job_id                    UUID,
    job_title                 TEXT,
    job_status                TEXT,
    department                TEXT,
    created_at                TIMESTAMPTZ,
    job_clicks                BIGINT,
    job_clicks_unique         BIGINT,
    application_starts        BIGINT,
    application_starts_unique BIGINT,
    application_completed     BIGINT,
    application_completed_unique BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        j.id                                                                    AS job_id,
        j.title                                                                 AS job_title,
        j.status                                                                AS job_status,
        j.department                                                            AS department,
        j.created_at                                                            AS created_at,
        COUNT(*) FILTER (WHERE ae.event_name = 'job_click')                    AS job_clicks,
        COUNT(DISTINCT ae.session_id) FILTER (WHERE ae.event_name = 'job_click') AS job_clicks_unique,
        COUNT(*) FILTER (WHERE ae.event_name = 'application_started')          AS application_starts,
        COUNT(DISTINCT ae.session_id) FILTER (WHERE ae.event_name = 'application_started') AS application_starts_unique,
        COUNT(*) FILTER (WHERE ae.event_name = 'application_completed')        AS application_completed,
        COUNT(DISTINCT ae.session_id) FILTER (WHERE ae.event_name = 'application_completed') AS application_completed_unique
    FROM public.jobs j
    LEFT JOIN public.analytics_events ae ON ae.job_id = j.id
    WHERE j.company_id = public.current_company_id()
    GROUP BY j.id, j.title, j.status, j.department, j.created_at
    ORDER BY j.created_at DESC;
$$;

COMMENT ON FUNCTION public.get_company_job_analytics IS
    'Retorna métricas de funil por vaga para a empresa do usuário autenticado.';
