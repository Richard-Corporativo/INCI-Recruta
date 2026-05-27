-- ============================================================
-- MIGRAÇÃO: Revogar acesso anon a funções SECURITY DEFINER críticas
-- Data: 2026-05-14
-- Motivo: Advisor de segurança Supabase — funções expostas ao role anon
--         via /rest/v1/rpc/ sem autenticação
-- ============================================================

-- 1. Busca completa no banco de talentos (GRAVÍSSIMO — qualquer anon busca todos os candidatos)
REVOKE EXECUTE ON FUNCTION public.search_candidates(
    text, text[], text[], numeric, numeric, text, text, text
) FROM anon;

-- 2. Comunicações de candidatos (GRAVE — dados pessoais)
REVOKE EXECUTE ON FUNCTION public.get_candidate_communications(uuid) FROM anon;

-- 3. Candidatos por etapa da vaga (GRAVE)
REVOKE EXECUTE ON FUNCTION public.get_candidates_with_stage_entry(uuid) FROM anon;

-- 4. Criação de empresa sem autenticação (risco de spam/flood)
REVOKE EXECUTE ON FUNCTION public.create_company_with_owner(text, text) FROM anon;

-- 5. Recomendações por UUID (permite probe de UUIDs)
REVOKE EXECUTE ON FUNCTION public.get_recommended_jobs_for_candidate(uuid) FROM anon;

-- 6. Métricas de comunicação (dados internos)
REVOKE EXECUTE ON FUNCTION public.get_communication_metrics(
    timestamp with time zone, timestamp with time zone
) FROM anon;

-- 7. Analytics de empresa (dados internos)
REVOKE EXECUTE ON FUNCTION public.get_company_job_analytics() FROM anon;

-- 8. Métricas de funil e diversidade (dados internos)
REVOKE EXECUTE ON FUNCTION public.get_funnel_diversity_metrics(
    uuid, timestamp with time zone, timestamp with time zone
) FROM anon;

-- 9. Enumeração de roles (permite descobrir se UUID é admin/staff)
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_staff_member() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.current_company_id() FROM anon;

-- ============================================================
-- MIGRAÇÃO: Corrigir policies permissivas WITH CHECK (true)
-- ============================================================

-- Candidatos: qualquer um pode inserir candidatura com qualquer user_id
-- Corrigir para exigir que user_id = usuário autenticado
DROP POLICY IF EXISTS candidates_public_insert ON public.candidates;
CREATE POLICY candidates_insert_authenticated
    ON public.candidates
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Analytics events: qualquer anon pode inserir qualquer evento
-- Manter apenas para authenticated com check de user_id
DROP POLICY IF EXISTS analytics_events_insert_anon ON public.analytics_events;
-- Mantemos o policy de authenticated mas restringimos o check
DROP POLICY IF EXISTS analytics_events_insert_authenticated ON public.analytics_events;
CREATE POLICY analytics_events_insert_authenticated
    ON public.analytics_events
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IS NULL OR auth.uid() = user_id
    );

-- Anon pode inserir eventos de analytics (page views públicas) sem user_id
CREATE POLICY analytics_events_insert_anon
    ON public.analytics_events
    FOR INSERT
    TO anon
    WITH CHECK (user_id IS NULL);

-- ============================================================
-- MIGRAÇÃO: Criar policies para tabelas com RLS sem policies
-- ============================================================

-- app_user_roles: RLS ativo mas sem nenhuma policy → tudo bloqueado
-- Apenas admins da empresa podem ver/gerenciar roles
CREATE POLICY IF NOT EXISTS app_user_roles_select_admin
    ON public.app_user_roles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('owner', 'admin', 'super_admin')
            AND u.company_id = app_user_roles.company_id
        )
    );

CREATE POLICY IF NOT EXISTS app_user_roles_manage_owner
    ON public.app_user_roles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role IN ('owner', 'super_admin')
            AND u.company_id = app_user_roles.company_id
        )
    );

-- scheduled_emails: apenas super_admin ou sistema deve acessar
CREATE POLICY IF NOT EXISTS scheduled_emails_super_admin_only
    ON public.scheduled_emails
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'super_admin'
        )
    );
