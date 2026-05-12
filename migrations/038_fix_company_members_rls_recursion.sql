-- Migration 038: Corrigir recursão infinita na policy company_members_select
-- Data: 2026-05-12
--
-- Problema: company_members_select tinha um EXISTS que fazia self-join em company_members.
-- PostgreSQL detecta recursão ao avaliar a policy durante a subquery.
--
-- Cadeia de recursão que quebrava getJobs():
--   SELECT * FROM jobs
--     → jobs_select_public: EXISTS (SELECT FROM companies WHERE status='active')
--     → companies_select_own_member: EXISTS (SELECT FROM company_members WHERE user_id=...)
--     → company_members_select: EXISTS (SELECT FROM company_members AS self WHERE role IN (...))
--     → RECURSÃO INFINITA → ERROR 42P17
--
-- Solução: criar função SECURITY DEFINER is_staff_member() que acessa company_members
-- sem acionar RLS, e usar essa função na policy.

-- 1. Função auxiliar SECURITY DEFINER para verificar se o usuário logado é staff ativo
CREATE OR REPLACE FUNCTION public.is_staff_member()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.company_members
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('owner', 'admin', 'manager', 'recruiter')
    )
$$;

-- 2. Recriar company_members_select sem o self-join recursivo
DROP POLICY IF EXISTS "company_members_select" ON public.company_members;
DROP POLICY IF EXISTS "company_members_select_own" ON public.company_members;
DROP POLICY IF EXISTS "company_members_select_tenant" ON public.company_members;

CREATE POLICY "company_members_select"
ON public.company_members FOR SELECT TO authenticated
USING (
    -- Qualquer usuário vê o próprio vínculo
    user_id = auth.uid()
    OR
    -- Staff ativo da mesma empresa vê todos os membros (via função SECURITY DEFINER)
    (
        company_id = current_company_id()
        AND current_company_id() IS NOT NULL
        AND public.is_staff_member()
    )
    OR public.is_super_admin()
);
