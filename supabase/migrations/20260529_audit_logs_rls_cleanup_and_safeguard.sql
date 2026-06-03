-- Migration: 20260529_audit_logs_rls_cleanup_and_safeguard.sql
-- Contexto: Em 2026-05-28 foi corrigida a ausência de INSERT policy em audit_logs,
-- mas múltiplas policies legadas e conflitantes permaneceram no banco.
-- Esta migration:
--   1. Remove policies redundantes/conflitantes deixando apenas o conjunto canônico
--   2. Cria verify_audit_logs_rls_policies() para detectar regressão futura
--
-- Impacto do gap original: ações de recruiters/managers entre ~2026-05-07 e 2026-05-28
-- foram silenciosamente descartadas. Apenas 26 logs de usuários admin foram preservados.
-- Operações de candidatos nesse período não são recuperáveis (analytics_events só cobre
-- atividade pública de candidatos).

-- ============================================================
-- PARTE 1: Remover INSERT policies legadas/conflitantes
-- ============================================================

-- Causa-raiz do gap: restringia inserts apenas a admin/super_admin
DROP POLICY IF EXISTS "audit_logs_insert_restricted" ON public.audit_logs;

-- Duplicatas da era pré-fix (aplicadas em role {public}, semanticamente equivalentes)
DROP POLICY IF EXISTS "Allow authenticated insert audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow authenticated insert audit" ON public.audit_logs;

-- Mantém: "audit_logs_insert_authenticated" (WITH CHECK user_id = auth.uid())
-- adicionada pelo fix de 2026-05-28 — é a policy canônica.

-- ============================================================
-- PARTE 2: Remover SELECT policies legadas/conflitantes
-- ============================================================

-- Políticas de era anterior cobertas por audit_logs_select_company
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_select_tenant" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow admin read audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow admin read audit" ON public.audit_logs;
DROP POLICY IF EXISTS "super_admin_view_all_audit_logs" ON public.audit_logs;

-- Mantém: "audit_logs_select_company" (via company_members) adicionada em 2026-05-28

-- Recria policy de super_admin com nome canônico para que o safeguard possa verificar
DROP POLICY IF EXISTS "audit_logs_select_superadmin" ON public.audit_logs;
CREATE POLICY "audit_logs_select_superadmin" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'super_admin'
    )
  );

-- ============================================================
-- PARTE 3: Função safeguard — detecta regressão de políticas
-- ============================================================

CREATE OR REPLACE FUNCTION public.verify_audit_logs_rls_policies()
RETURNS TABLE(check_name TEXT, status TEXT, detail TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_insert_policy BOOLEAN;
  v_has_select_company_policy BOOLEAN;
  v_rls_enabled BOOLEAN;
BEGIN
  -- Verifica se RLS está habilitado
  SELECT relrowsecurity INTO v_rls_enabled
  FROM pg_class
  WHERE relname = 'audit_logs' AND relnamespace = 'public'::regnamespace;

  RETURN QUERY SELECT
    'rls_enabled'::TEXT,
    CASE WHEN v_rls_enabled THEN 'OK' ELSE 'FALHOU' END::TEXT,
    CASE WHEN v_rls_enabled
      THEN 'RLS habilitado em audit_logs'
      ELSE 'CRÍTICO: RLS desabilitado em audit_logs — todos os dados expostos!'
    END::TEXT;

  -- Verifica INSERT policy canônica
  SELECT EXISTS(
    SELECT 1 FROM pg_policies
    WHERE tablename = 'audit_logs'
      AND cmd = 'INSERT'
      AND policyname = 'audit_logs_insert_authenticated'
  ) INTO v_has_insert_policy;

  RETURN QUERY SELECT
    'insert_policy_exists'::TEXT,
    CASE WHEN v_has_insert_policy THEN 'OK' ELSE 'FALHOU' END::TEXT,
    CASE WHEN v_has_insert_policy
      THEN 'INSERT policy canônica presente'
      ELSE 'CRÍTICO: audit_logs_insert_authenticated ausente — logging silenciosamente bloqueado!'
    END::TEXT;

  -- Verifica SELECT policy canônica
  SELECT EXISTS(
    SELECT 1 FROM pg_policies
    WHERE tablename = 'audit_logs'
      AND cmd = 'SELECT'
      AND policyname = 'audit_logs_select_company'
  ) INTO v_has_select_company_policy;

  RETURN QUERY SELECT
    'select_company_policy_exists'::TEXT,
    CASE WHEN v_has_select_company_policy THEN 'OK' ELSE 'FALHOU' END::TEXT,
    CASE WHEN v_has_select_company_policy
      THEN 'SELECT policy de isolamento por empresa presente'
      ELSE 'AVISO: audit_logs_select_company ausente — possível vazamento cross-tenant'
    END::TEXT;

  -- Verifica que a policy admin-only foi removida
  RETURN QUERY SELECT
    'no_admin_only_insert_policy'::TEXT,
    CASE WHEN NOT EXISTS(
      SELECT 1 FROM pg_policies
      WHERE tablename = 'audit_logs'
        AND cmd = 'INSERT'
        AND policyname = 'audit_logs_insert_restricted'
    ) THEN 'OK' ELSE 'AVISO' END::TEXT,
    CASE WHEN NOT EXISTS(
      SELECT 1 FROM pg_policies
      WHERE tablename = 'audit_logs'
        AND cmd = 'INSERT'
        AND policyname = 'audit_logs_insert_restricted'
    )
      THEN 'Policy restritiva de admin-only removida corretamente'
      ELSE 'AVISO: audit_logs_insert_restricted ainda existe — bloqueia logging de não-admins'
    END::TEXT;
END;
$$;

-- Revoga acesso público — apenas service_role chama o safeguard (SQL Editor, CI)
REVOKE EXECUTE ON FUNCTION public.verify_audit_logs_rls_policies() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_audit_logs_rls_policies() TO service_role;

COMMENT ON FUNCTION public.verify_audit_logs_rls_policies() IS
  'Safeguard: verifica integridade das RLS policies de audit_logs. '
  'Chame via SQL Editor ou health-check de CI para detectar regressão. '
  'Criada em 2026-05-29 após incidente de gap no logging (2026-05-07 a 2026-05-28).';
