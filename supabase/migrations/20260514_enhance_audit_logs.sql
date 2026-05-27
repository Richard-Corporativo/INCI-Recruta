-- MIGRATION: Melhoria na Auditoria (Agrupamento por Vaga e Categorização)
-- Aplique este SQL no editor do Supabase para habilitar as novas funcionalidades.

ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS category TEXT;

COMMENT ON COLUMN public.audit_logs.job_id IS 'Vincula o log a uma vaga específica para agrupamento.';
COMMENT ON COLUMN public.audit_logs.category IS 'Categoria amigável do log (ex: candidate_movement, security, settings).';

CREATE INDEX IF NOT EXISTS idx_audit_logs_job_id ON public.audit_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs(category);

-- Opcional: Atualizar logs existentes que sejam de JOB
UPDATE public.audit_logs 
SET job_id = resource_id::uuid, category = 'job_update'
WHERE resource_type = 'JOB' AND job_id IS NULL;
