-- Migration 036: Corrigir lacunas de RLS para acesso da equipe staff
-- Data: 2026-05-12
--
-- Problemas resolvidos:
-- 1. Staff (owner/admin/manager/recruiter) agora pode ver TODAS as vagas da empresa
--    no painel admin — antes só vagas públicas/ativas eram visíveis.
-- 2. Staff pode ver todos os membros da empresa em Configurações > Usuários.

-- =====================================================================
-- Fix 1: jobs_select_tenant
-- Sem esta policy, o painel admin mostrava 0 vagas para o owner porque
-- a única policy SELECT em jobs era "jobs_select_public" (apenas vagas ativas/públicas).
-- =====================================================================
DROP POLICY IF EXISTS "jobs_select_tenant" ON public.jobs;
CREATE POLICY "jobs_select_tenant"
ON public.jobs FOR SELECT TO authenticated
USING (
  company_id = current_company_id()
  AND current_company_id() IS NOT NULL
);

-- =====================================================================
-- Fix 2: company_members_select
-- A policy anterior (company_members_select_own) só permitia ao usuário ver
-- seu próprio registro em company_members. Isso impedia:
--   - Configurações > Usuários de listar membros da empresa
--   - AuthContext de enriquecer o perfil com dados do company member
-- Nova policy: staff com role >= recruiter vê todos os membros da empresa.
-- =====================================================================
DROP POLICY IF EXISTS "company_members_select_own" ON public.company_members;
DROP POLICY IF EXISTS "company_members_select_tenant" ON public.company_members;
DROP POLICY IF EXISTS "company_members_select" ON public.company_members;

CREATE POLICY "company_members_select"
ON public.company_members FOR SELECT TO authenticated
USING (
  -- Qualquer usuário pode sempre ver seu próprio vínculo
  user_id = auth.uid()
  OR
  -- Staff com role adequado pode ver todos os membros da empresa
  (
    company_id = current_company_id()
    AND current_company_id() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.company_members AS self
      WHERE self.user_id = auth.uid()
        AND self.status = 'active'
        AND self.role IN ('owner', 'admin', 'manager', 'recruiter')
    )
  )
  OR is_super_admin()
);
