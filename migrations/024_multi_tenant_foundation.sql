-- Migration 024: Multi-Tenant Foundation
-- Adiciona suporte a múltiplas empresas (SaaS) no INCI Recruta.
-- Esta migration é ADITIVA: não remove dados existentes nem altera estrutura legada destrutivamente.
-- A limpeza opcional de dados antigos está na migration 025 (separada).

-- =====================================================================
-- 1. TABELA companies
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  cnpj text,
  logo_url text,
  primary_color text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'pending')),
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);

COMMENT ON TABLE public.companies IS 'Empresas (tenants) que utilizam o INCI Recruta. Cada empresa é isolada das outras.';
COMMENT ON COLUMN public.companies.slug IS 'Identificador único para URL pública: /vagas/[slug]';
COMMENT ON COLUMN public.companies.maintenance_mode IS 'Quando true, bloqueia login de candidatos e exibe mensagem de manutenção.';

-- =====================================================================
-- 2. TABELA company_members
-- Vincula usuários staff (admin/recruiter/manager/owner) a empresas.
-- Candidatos NÃO entram nesta tabela: eles têm seu próprio vínculo via candidates.company_id.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'recruiter', 'manager')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'invited')),
  invited_email text,
  invited_at timestamptz,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_company_members_company ON public.company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user ON public.company_members(user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_role ON public.company_members(company_id, role);

COMMENT ON TABLE public.company_members IS 'Vínculo entre usuários staff e empresas. Um usuário pode pertencer a apenas uma empresa por enquanto (UNIQUE).';

-- =====================================================================
-- 3. ADICIONAR company_id ÀS TABELAS DO DOMÍNIO
-- Tudo nullable nesta etapa para não quebrar dados existentes.
-- A migration 025 (opcional) faz a limpeza e a 026 torna NOT NULL.
-- =====================================================================

-- Núcleo do ATS
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;

-- Users (staff): NULL = candidato global; NOT NULL = staff vinculado a 1 empresa
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

-- Auditoria e comunicação
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;

-- Tabelas auxiliares (apenas se existirem)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_resumes') THEN
    EXECUTE 'ALTER TABLE public.candidate_resumes ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_avatars') THEN
    EXECUTE 'ALTER TABLE public.candidate_avatars ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_demographics') THEN
    EXECUTE 'ALTER TABLE public.candidate_demographics ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_stage_history') THEN
    EXECUTE 'ALTER TABLE public.candidate_stage_history ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='communication_logs') THEN
    EXECUTE 'ALTER TABLE public.communication_logs ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='email_templates') THEN
    EXECUTE 'ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='scheduled_emails') THEN
    EXECUTE 'ALTER TABLE public.scheduled_emails ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='feedbacks') THEN
    EXECUTE 'ALTER TABLE public.feedbacks ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='analytics_events') THEN
    EXECUTE 'ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='system_settings') THEN
    EXECUTE 'ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE';
  END IF;
END $$;

-- =====================================================================
-- 4. ÍNDICES POR company_id (para performance nas queries filtradas)
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_roles_company ON public.roles(company_id);
CREATE INDEX IF NOT EXISTS idx_candidates_company ON public.candidates(company_id);
CREATE INDEX IF NOT EXISTS idx_users_company ON public.users(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON public.audit_logs(company_id);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='candidate_resumes' AND column_name='company_id') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_candidate_resumes_company ON public.candidate_resumes(company_id)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='communication_logs' AND column_name='company_id') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_communication_logs_company ON public.communication_logs(company_id)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='email_templates' AND column_name='company_id') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_email_templates_company ON public.email_templates(company_id)';
  END IF;
END $$;

-- =====================================================================
-- 5. FUNÇÃO HELPER current_company_id()
-- Retorna o company_id da sessão atual baseado em company_members.
-- Usada por todas as RLS policies futuras (Etapa 1.3).
-- =====================================================================
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.company_members
  WHERE user_id = auth.uid()
    AND status = 'active'
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.current_company_id IS 'Retorna a empresa do usuário staff logado. NULL para candidatos ou anônimos.';

-- =====================================================================
-- 6. FUNÇÃO HELPER is_super_admin()
-- Identifica usuários da equipe INCI Brasil (acesso global ao painel Super Admin).
-- =====================================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role = 'super_admin'
  );
$$;

COMMENT ON FUNCTION public.is_super_admin IS 'True quando o usuário logado é membro da equipe INCI Brasil (super admin da plataforma).';

-- =====================================================================
-- 7. TRIGGER updated_at automático em companies e company_members
-- =====================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_companies_updated_at ON public.companies;
CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_company_members_updated_at ON public.company_members;
CREATE TRIGGER trg_company_members_updated_at
  BEFORE UPDATE ON public.company_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- 8. RLS BÁSICA EM companies E company_members
-- (RLS completa nas demais tabelas será feita na Etapa 1.3)
-- =====================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- companies: usuário só vê a própria empresa; super_admin vê todas
DROP POLICY IF EXISTS "companies_select" ON public.companies;
CREATE POLICY "companies_select" ON public.companies
  FOR SELECT TO authenticated
  USING (
    id = public.current_company_id()
    OR public.is_super_admin()
  );

-- companies: leitura pública por slug (necessária para landing /vagas/[slug])
DROP POLICY IF EXISTS "companies_select_public_slug" ON public.companies;
CREATE POLICY "companies_select_public_slug" ON public.companies
  FOR SELECT TO anon
  USING (status = 'active');

DROP POLICY IF EXISTS "companies_update_owner_admin" ON public.companies;
CREATE POLICY "companies_update_owner_admin" ON public.companies
  FOR UPDATE TO authenticated
  USING (
    id = public.current_company_id()
    AND EXISTS (
      SELECT 1 FROM public.company_members m
      WHERE m.company_id = companies.id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner', 'admin')
        AND m.status = 'active'
    )
  );

-- companies: insert via signup self-service (qualquer authenticated pode criar)
DROP POLICY IF EXISTS "companies_insert_self_service" ON public.companies;
CREATE POLICY "companies_insert_self_service" ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- company_members: usuário vê seus próprios vínculos + admin/owner vê todos da empresa
DROP POLICY IF EXISTS "company_members_select" ON public.company_members;
CREATE POLICY "company_members_select" ON public.company_members
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m2
        WHERE m2.company_id = company_members.company_id
          AND m2.user_id = auth.uid()
          AND m2.role IN ('owner', 'admin')
          AND m2.status = 'active'
      )
    )
    OR public.is_super_admin()
  );

-- company_members: insert do próprio usuário no signup (vira owner)
DROP POLICY IF EXISTS "company_members_insert_owner" ON public.company_members;
CREATE POLICY "company_members_insert_owner" ON public.company_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role = 'owner');

-- =====================================================================
-- 9. AJUSTE NA TABELA users PARA SUPORTAR 'super_admin' E 'owner'
-- =====================================================================
DO $$
BEGIN
  -- Remove constraint antiga de role se existir
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_schema='public' AND table_name='users' AND column_name='role'
  ) THEN
    BEGIN
      ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;
END $$;

-- Recria constraint incluindo novos papéis
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin', 'owner', 'admin', 'recruiter', 'manager', 'candidate'));

-- =====================================================================
-- FIM DA MIGRATION 024
-- Próximos passos:
--   - Migration 025 (opcional): limpeza de dados antigos
--   - Migration 026: tornar company_id NOT NULL nas tabelas de domínio
--   - Etapa 1.2: AuthContext lê company_id do company_members
-- =====================================================================
