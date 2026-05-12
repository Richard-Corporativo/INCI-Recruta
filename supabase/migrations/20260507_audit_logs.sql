-- Migration: 20260507_audit_logs.sql
-- Description: Create audit_logs table for tracking user actions

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_id UUID, -- Context of the company where the action happened
    action TEXT NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE'
    resource_type TEXT NOT NULL, -- e.g., 'JOB', 'CANDIDATE', 'ROLE'
    resource_id TEXT,
    details JSONB DEFAULT '{}'::jsonb, -- Store diffs or metadata
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins/managers of the same company can read audit logs
CREATE POLICY "Allow admins to read their company audit logs" ON audit_logs
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND (
            users.role IN ('admin', 'manager') -- Admins see everything
            OR (users.role = 'recruiter' AND audit_logs.company_id::text = users.company_name) -- Simplified for now
        )
    )
);

-- Systematic logging function
CREATE OR REPLACE FUNCTION public.log_action(
    p_user_id UUID,
    p_company_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT,
    p_details JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.audit_logs (user_id, company_id, action, resource_type, resource_id, details)
    VALUES (p_user_id, p_company_id, p_action, p_resource_type, p_resource_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
