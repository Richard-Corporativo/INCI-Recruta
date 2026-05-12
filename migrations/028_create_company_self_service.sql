-- Migration 028: Self-service de cadastro de empresa
-- RPC SECURITY DEFINER que cria atomicamente companies + company_members + ajusta users
-- para o usuário autenticado virar 'owner' da empresa recém-criada.
--
-- Fluxo: após supabase.auth.signUp, o cliente chama
--   supabase.rpc('create_company_with_owner', { p_name, p_cnpj })
-- e recebe o registro da empresa.
-- Idempotente: pode rodar múltiplas vezes (DROP FUNCTION IF EXISTS).

BEGIN;

-- =====================================================================
-- Helper: gera slug único a partir do nome
-- =====================================================================
CREATE OR REPLACE FUNCTION public.generate_company_slug(p_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_slug text;
  candidate text;
  counter integer := 0;
BEGIN
  -- normaliza: minúsculas, troca espaços por -, remove diacríticos e símbolos
  base_slug := lower(p_name);
  base_slug := translate(base_slug,
    'áàâãäéèêëíìîïóòôõöúùûüçñ',
    'aaaaaeeeeiiiiooooouuuucn');
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
  base_slug := substring(base_slug from 1 for 50);

  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'empresa';
  END IF;

  candidate := base_slug;

  -- procura slug livre incrementando sufixo
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.companies WHERE slug = candidate) THEN
      RETURN candidate;
    END IF;
    counter := counter + 1;
    candidate := base_slug || '-' || counter::text;
    IF counter > 1000 THEN
      RAISE EXCEPTION 'Não foi possível gerar slug único para %', p_name;
    END IF;
  END LOOP;
END;
$$;

-- =====================================================================
-- RPC: create_company_with_owner
--   Cria empresa + membership como 'owner' para o usuário autenticado.
--   Falha se o usuário já é membro ativo de alguma empresa.
-- =====================================================================
DROP FUNCTION IF EXISTS public.create_company_with_owner(text, text);

CREATE OR REPLACE FUNCTION public.create_company_with_owner(
  p_name text,
  p_cnpj text DEFAULT NULL
)
RETURNS public.companies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text;
  v_company public.companies%ROWTYPE;
  v_slug text;
  v_cnpj_clean text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado.';
  END IF;

  IF p_name IS NULL OR length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Nome da empresa é obrigatório.';
  END IF;

  -- Já é membro de uma empresa?
  IF EXISTS (
    SELECT 1 FROM public.company_members
    WHERE user_id = v_user_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Usuário já vinculado a uma empresa.';
  END IF;

  -- CNPJ limpo (apenas dígitos)
  v_cnpj_clean := nullif(regexp_replace(coalesce(p_cnpj, ''), '\D', '', 'g'), '');

  -- CNPJ duplicado?
  IF v_cnpj_clean IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companies WHERE cnpj = v_cnpj_clean
  ) THEN
    RAISE EXCEPTION 'Já existe uma empresa cadastrada com este CNPJ.';
  END IF;

  v_slug := public.generate_company_slug(p_name);

  -- E-mail do usuário (para logs e fallback)
  SELECT email INTO v_email FROM auth.users WHERE id = v_user_id;

  -- Cria empresa em status 'trial'
  INSERT INTO public.companies (name, slug, cnpj, status, maintenance_mode)
  VALUES (trim(p_name), v_slug, v_cnpj_clean, 'trial', false)
  RETURNING * INTO v_company;

  -- Cria membership como owner
  INSERT INTO public.company_members (company_id, user_id, role, status, joined_at)
  VALUES (v_company.id, v_user_id, 'owner', 'active', now());

  -- Garante linha em users e marca como owner da empresa
  INSERT INTO public.users (id, name, email, role, status, company_id)
  VALUES (
    v_user_id,
    coalesce((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = v_user_id), v_email),
    v_email,
    'owner',
    'active',
    v_company.id
  )
  ON CONFLICT (id) DO UPDATE
    SET role = 'owner',
        status = 'active',
        company_id = EXCLUDED.company_id;

  RETURN v_company;
END;
$$;

-- Permite que usuários autenticados chamem o RPC
REVOKE ALL ON FUNCTION public.create_company_with_owner(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_company_with_owner(text, text) TO authenticated;

COMMIT;

-- =====================================================================
-- Verificação manual:
--   SELECT public.create_company_with_owner('Empresa Teste', '12345678000199');
--   SELECT * FROM public.companies WHERE slug LIKE 'empresa-teste%';
--   SELECT * FROM public.company_members WHERE user_id = auth.uid();
-- =====================================================================
