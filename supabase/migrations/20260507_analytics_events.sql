-- Migration: 20260507_analytics_events.sql
-- Description: Create analytics_events table and funnel view

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    job_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);

-- RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public tracking)
CREATE POLICY "Allow anyone to insert events" ON analytics_events
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Allow admins/managers to read events
CREATE POLICY "Allow admins to read events" ON analytics_events
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'recruiter')
  )
);

-- View for Funnel Analysis
CREATE OR REPLACE VIEW public.funnel_stats 
WITH (security_invoker = on)
AS
SELECT 
    event_name,
    job_id,
    COUNT(*) as total_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users
FROM public.analytics_events
GROUP BY event_name, job_id;
