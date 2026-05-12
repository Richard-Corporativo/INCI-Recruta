-- Migration 037: Permitir que empresas em 'trial' tenham vagas visíveis publicamente
-- Data: 2026-05-12
--
-- Problema: jobs_select_public e companies_select_public_slug exigiam status='active'.
-- Novas empresas entram como 'trial' — suas vagas ficavam invisíveis na landing /vagas.
-- Fix: aceitar 'active' OU 'trial' nas duas policies.

-- 1. Atualiza jobs_select_public para aceitar 'active' e 'trial'
DROP POLICY IF EXISTS "jobs_select_public" ON public.jobs;
CREATE POLICY "jobs_select_public"
ON public.jobs FOR SELECT TO public
USING (
  status = 'Ativa'
  AND EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = jobs.company_id
      AND c.status IN ('active', 'trial')
  )
);

-- 2. Atualiza companies_select_public_slug (anon) para incluir 'trial'
DROP POLICY IF EXISTS "companies_select_public_slug" ON public.companies;
CREATE POLICY "companies_select_public_slug"
ON public.companies FOR SELECT TO anon
USING (status IN ('active', 'trial'));
