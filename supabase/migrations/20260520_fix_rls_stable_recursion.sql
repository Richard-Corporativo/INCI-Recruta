-- Correção: RLS Recursion em company_members
-- Causa: funções STABLE com SECURITY DEFINER que consultam company_members
-- são "inlined" pelo planner dentro da própria política RLS da tabela,
-- causando loop infinito. Fix: mudar para VOLATILE (nunca é inlined).

CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql
VOLATILE                -- era STABLE → VOLATILE quebra o inline pelo planner
SECURITY DEFINER
SET search_path = ''   -- mais seguro: sem search path hijacking
AS $$
  SELECT company_id
  FROM public.company_members
  WHERE user_id = (SELECT auth.uid())
    AND status = 'active'
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_staff_member()
RETURNS boolean
LANGUAGE sql
VOLATILE                -- era STABLE → VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE user_id = (SELECT auth.uid())
      AND status = 'active'
      AND role IN ('owner', 'admin', 'manager', 'recruiter', 'quality', 'dp')
  );
$$;
