-- Migração de Endurecimento de Segurança (Security Hardening)
-- Data: 2026-05-13
-- Objetivo: Resolver vulnerabilidades de segurança identificadas no linter do Supabase.

-- 1. CORREÇÃO DE SEARCH PATH PARA FUNÇÕES SECURITY DEFINER
-- Impede ataques de sequestro de objetos (search path hijacking).

ALTER FUNCTION public.get_my_role() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.cleanup_old_audit_logs(days_to_keep integer) SET search_path = public;
ALTER FUNCTION public.create_company_with_owner(p_name text, p_cnpj text) SET search_path = public;
ALTER FUNCTION public.current_company_id() SET search_path = public;
ALTER FUNCTION public.generate_company_slug(p_name text) SET search_path = public;
ALTER FUNCTION public.get_all_locations() SET search_path = public;
ALTER FUNCTION public.get_all_skills() SET search_path = public;
ALTER FUNCTION public.get_candidate_communications(p_candidate_id uuid) SET search_path = public;
ALTER FUNCTION public.get_candidates_with_stage_entry(p_job_id uuid) SET search_path = public;
ALTER FUNCTION public.get_communication_metrics(p_start_date timestamp with time zone, p_end_date timestamp with time zone) SET search_path = public;
ALTER FUNCTION public.get_company_job_analytics() SET search_path = public;
ALTER FUNCTION public.get_funnel_diversity_metrics(p_job_id uuid, p_start_date timestamp with time zone, p_end_date timestamp with time zone) SET search_path = public;
ALTER FUNCTION public.get_recommended_jobs_for_candidate(p_user_id uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.is_staff_member() SET search_path = public;
ALTER FUNCTION public.is_super_admin() SET search_path = public;
ALTER FUNCTION public.search_candidates(text, text[], text[], numeric, numeric, text, text, text) SET search_path = public;

-- 2. RESTRIÇÃO DE EXECUÇÃO PARA FUNÇÕES SENSÍVEIS
-- Remove permissão de execução pública para funções críticas de backend.

REVOKE EXECUTE ON FUNCTION public.cleanup_old_audit_logs(integer) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- 3. CORREÇÃO DE POLÍTICAS RLS PERMISSIVAS (Vazamento de Dados)

-- Tabela: analytics_events (Impedir spam de inserção)
DROP POLICY IF EXISTS "analytics_events_insert_public" ON public.analytics_events;
CREATE POLICY "analytics_events_insert_authenticated" ON public.analytics_events
  FOR INSERT TO authenticated
  WITH CHECK (true); -- Permitir apenas usuários logados inserirem eventos

-- Tabela: candidates (Vazamento de dados pessoais)
DROP POLICY IF EXISTS "candidates_public_select" ON public.candidates;
CREATE POLICY "candidates_select_restricted" ON public.candidates
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR 
    is_admin() OR 
    is_super_admin()
  );

-- Tabela: links (Adicionando isolamento por empresa se não existir e corrigindo políticas)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='links' AND column_name='company_id') THEN
    ALTER TABLE public.links ADD COLUMN company_id uuid REFERENCES public.companies(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "links_delete_authenticated" ON public.links;
DROP POLICY IF EXISTS "links_insert_authenticated" ON public.links;
DROP POLICY IF EXISTS "links_update_authenticated" ON public.links;
DROP POLICY IF EXISTS "Public Read for Redirects" ON public.links;

-- Permitir leitura pública (necessário para os redirecionamentos funcionarem)
CREATE POLICY "links_public_read" ON public.links
  FOR SELECT TO public
  USING (true);

-- Restringir modificações apenas para membros da empresa
CREATE POLICY "links_modify_own_company" ON public.links
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT m.company_id FROM company_members m 
      WHERE m.user_id = auth.uid() AND m.status = 'active'
    )
  );

-- Tabela: audit_logs (Segurança de trilha de auditoria)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_restricted" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (is_admin() OR is_super_admin());

-- Tabela: candidate_demographics
DROP POLICY IF EXISTS "Allow insert for all" ON public.candidate_demographics;
CREATE POLICY "candidate_demographics_insert_auth" ON public.candidate_demographics
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM candidates c
    WHERE c.id = candidate_demographics.candidate_id 
    AND c.user_id = auth.uid()
  ));
