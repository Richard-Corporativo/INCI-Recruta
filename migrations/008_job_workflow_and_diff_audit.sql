-- Migration: Implement Job Workflow and Granular Audit
-- Description: Adds workflow_status to jobs and JSONB diff support to audit_logs

-- 1. Add workflow_status to jobs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_workflow_status') THEN
        CREATE TYPE job_workflow_status AS ENUM ('draft', 'pending_approval', 'approved', 'published', 'archived');
    END IF;
END $$;

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS workflow_status job_workflow_status DEFAULT 'draft';

-- Migrate existing approval_status/status to workflow_status
UPDATE public.jobs 
SET workflow_status = CASE 
    WHEN approval_status = 'Aprovado' AND status = 'Ativa' THEN 'published'::job_workflow_status
    WHEN approval_status = 'Aprovado' THEN 'approved'::job_workflow_status
    WHEN approval_status = 'Pendente' THEN 'pending_approval'::job_workflow_status
    WHEN status = 'Rascunho' OR approval_status = 'Rascunho' THEN 'draft'::job_workflow_status
    WHEN status = 'Encerrada' THEN 'archived'::job_workflow_status
    ELSE 'draft'::job_workflow_status
END;

-- 2. Enhance audit_logs for diff support
ALTER TABLE public.audit_logs
ADD COLUMN IF NOT EXISTS old_value JSONB,
ADD COLUMN IF NOT EXISTS new_value JSONB;

COMMENT ON COLUMN public.audit_logs.old_value IS 'Previous state of the entity before change';
COMMENT ON COLUMN public.audit_logs.new_value IS 'New state of the entity after change';
