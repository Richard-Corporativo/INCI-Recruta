-- Migração de Otimização de Performance (Corrigida)
-- Data: 2026-05-13
-- Objetivo: Resolver avisos de performance e falta de índices identificados.

-- 1. CRIAÇÃO DE ÍNDICES PARA CHAVES ESTRANGEIRAS CRÍTICAS
-- Estes índices aceleram joins e filtros em tabelas com grande volume de dados.

-- Tabela: candidates (Esta tabela gerencia tanto o perfil quanto as candidaturas)
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON public.candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_company_id ON public.candidates(company_id);

-- Tabela: jobs
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_manager_id ON public.jobs(manager_id);

-- Tabela: audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON public.audit_logs(company_id);

-- Tabela: communication_logs
CREATE INDEX IF NOT EXISTS idx_communication_logs_candidate_id ON public.communication_logs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_job_id ON public.communication_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_user_id ON public.communication_logs(user_id);

-- Tabela: user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 2. REFATORAÇÃO DE POLÍTICAS RLS (EVITAR INITPLAN)
-- Envolvendo auth.uid() em (SELECT auth.uid()) para otimizar o plano de execução.

-- Tabela: candidates
DROP POLICY IF EXISTS "candidates_read_own" ON public.candidates;
CREATE POLICY "candidates_read_own" ON public.candidates
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Tabela: users
DROP POLICY IF EXISTS "users_read_own" ON public.users;
CREATE POLICY "users_read_own" ON public.users
FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()));

-- Tabela: candidate_saved_jobs
DROP POLICY IF EXISTS "Individuals can view their own saved jobs" ON public.candidate_saved_jobs;
CREATE POLICY "Individuals can view their own saved jobs" ON public.candidate_saved_jobs
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

-- 3. FUNÇÃO AUXILIAR PARA ADMIN (OTIMIZADA)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'role')::text = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
