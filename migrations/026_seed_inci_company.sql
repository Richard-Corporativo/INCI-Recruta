-- Migration 026: Seed da empresa "INCI Brasil" + vinculação do usuário owner
-- Execute APÓS 024 (e 025 se você quis começar do zero).
-- Cria a empresa INCI Brasil e vincula o usuário israel.richard@incibrasil.com.br como owner.

BEGIN;

-- 1. Cria empresa INCI Brasil se não existir
INSERT INTO public.companies (id, name, slug, status, primary_color)
VALUES (
  gen_random_uuid(),
  'INCI Brasil',
  'inci-brasil',
  'active',
  '#1E40AF'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Vincula o usuário owner (se já existir no auth.users)
DO $$
DECLARE
  v_company_id uuid;
  v_user_id uuid;
BEGIN
  SELECT id INTO v_company_id FROM public.companies WHERE slug = 'inci-brasil';
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'israel.richard@incibrasil.com.br' LIMIT 1;

  IF v_company_id IS NOT NULL AND v_user_id IS NOT NULL THEN
    -- Atualiza users.company_id e role
    UPDATE public.users
    SET company_id = v_company_id,
        role = 'owner'
    WHERE id = v_user_id;

    -- Cria vínculo em company_members
    INSERT INTO public.company_members (company_id, user_id, role, status, joined_at)
    VALUES (v_company_id, v_user_id, 'owner', 'active', now())
    ON CONFLICT (company_id, user_id) DO UPDATE
      SET role = 'owner', status = 'active';

    RAISE NOTICE 'Usuário % vinculado como owner da INCI Brasil', v_user_id;
  ELSE
    RAISE NOTICE 'Empresa ou usuário não encontrado. Empresa criada, vinculação pendente.';
  END IF;
END $$;

COMMIT;
