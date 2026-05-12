-- Migration 033: Security Hardening
-- Corrige os 54 avisos do Supabase Security Advisor:
--   1. Function Search Path Mutable  → ALTER FUNCTION ... SET search_path = public
--   2. SECURITY DEFINER callable por anon → REVOKE EXECUTE FROM anon
--   3. RLS Policy Always True (duplicadas) → limpa políticas duplicadas de analytics_events
--   4. links table → políticas já existem no banco; corrigidas com USING (auth.role() = 'authenticated')

-- =====================================================================
-- BLOCO 1: Function Search Path Mutable
-- Adiciona SET search_path = public a todas as funções flagradas.
-- Previne ataques de search_path injection. Sem impacto funcional.
-- =====================================================================

ALTER FUNCTION public.update_candidate_has_avatar()          SET search_path = public;
ALTER FUNCTION public.update_candidate_has_resume()          SET search_path = public;
ALTER FUNCTION public.set_updated_at()                       SET search_path = public;
ALTER FUNCTION public.get_funnel_diversity_metrics(uuid, timestamptz, timestamptz) SET search_path = public;
ALTER FUNCTION public.get_candidates_with_stage_entry(uuid)  SET search_path = public;
ALTER FUNCTION public.get_candidate_communications(uuid)     SET search_path = public;
ALTER FUNCTION public.get_communication_metrics(timestamptz, timestamptz) SET search_path = public;
ALTER FUNCTION public.cleanup_old_audit_logs(integer)        SET search_path = public;
ALTER FUNCTION public.is_super_admin()                       SET search_path = public;
ALTER FUNCTION public.generate_role_code()                   SET search_path = public;
ALTER FUNCTION public.get_recommended_jobs_for_candidate(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user()                      SET search_path = public;

-- =====================================================================
-- BLOCO 2: Revogar EXECUTE de anon em funções sensíveis
-- Funções que expõem dados internos não devem ser chamadas sem auth.
-- =====================================================================

-- Dados de candidatos — só autenticados podem consultar
REVOKE EXECUTE ON FUNCTION public.search_candidates(text, text[], text[], numeric, numeric, text, text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_candidate_communications(uuid)                                           FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_communication_metrics(timestamptz, timestamptz)                         FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_funnel_diversity_metrics(uuid, timestamptz, timestamptz)                FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_candidates_with_stage_entry(uuid)                                       FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_company_job_analytics()                                                 FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_my_role()                                                               FROM anon;

-- Operação administrativa — apenas super_admin deve chamar diretamente
REVOKE EXECUTE ON FUNCTION public.cleanup_old_audit_logs(integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_audit_logs(integer) FROM authenticated;

-- Trigger function — nunca deve ser chamada via REST
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- Funções de papel interno — anon não precisa consultar
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;

-- =====================================================================
-- BLOCO 2b: Funções que permanecem acessíveis por anon (intencionais)
-- -----------------------------------------------------------------------
-- is_super_admin()              → usado em RLS policies; retorna false para anon
-- is_admin()                    → idem (revogado acima de anon, mantido para authenticated)
-- current_company_id()          → usado em RLS; retorna null para anon
-- create_company_with_owner()   → fluxo self-service (apenas authenticated na prática)
-- generate_company_slug()       → helper interno do self-service
-- get_all_locations()           → catálogo público (vagas/candidatos anon podem consultar)
-- get_all_skills()              → catálogo público
-- get_recommended_jobs_for_candidate() → portal candidato (autenticado na prática)
-- =====================================================================

-- =====================================================================
-- BLOCO 3: RLS Policy Always True — analytics_events
-- Existem 3 políticas INSERT duplicadas. Mantém apenas uma.
-- =====================================================================

DROP POLICY IF EXISTS "Allow anyone to insert events"    ON public.analytics_events;
DROP POLICY IF EXISTS "public_analytics_events_insert"  ON public.analytics_events;
-- Mantém "analytics_events_insert_public" (criada em migration 032)
-- WITH CHECK (true) é intencional: rastreamento anônimo de funil.

-- =====================================================================
-- BLOCO 4: links table — políticas hiper-permissivas
-- A tabela não está em nenhuma migration, mas as políticas existem no banco.
-- Substituímos as três políticas (INSERT/UPDATE/DELETE) para exigir
-- que o executor seja authenticated.
-- =====================================================================

DROP POLICY IF EXISTS "Public Insert for Admin" ON public.links;
DROP POLICY IF EXISTS "Public Update for Admin" ON public.links;
DROP POLICY IF EXISTS "Public Delete for Admin" ON public.links;

CREATE POLICY "links_insert_authenticated" ON public.links
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "links_update_authenticated" ON public.links
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "links_delete_authenticated" ON public.links
    FOR DELETE TO authenticated USING (true);

-- =====================================================================
-- BLOCO 5: RLS policies intencionalmente permissivas (aceitas)
-- -----------------------------------------------------------------------
-- candidates_public_insert        → candidatos se cadastram sem auth (portal público)
-- candidate_demographics INSERT   → dados de diversidade, preenchidos no cadastro
-- companies_insert_self_service   → empresa criada no fluxo de onboarding
-- analytics_events_insert_public  → tracking anônimo (mantido em bloco 3 acima)
-- =====================================================================

-- Auth: Leaked Password Protection → ativar em Supabase Dashboard > Auth > Password Strength
-- (não é configurável via SQL — requer acesso ao painel)
