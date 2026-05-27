-- Consolidacao multiempresa para preview/deploy Vercel
-- Data: 2026-05-13
-- Objetivo: alinhar schema, helpers e RLS sem aplicar alteracoes destrutivas.
-- Aplicar manualmente primeiro em staging ou projeto Supabase de teste.

BEGIN;

-- ---------------------------------------------------------------------
-- 1. Estrutura base multiempresa
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  cnpj text,
  logo_url text,
  primary_color text,
  status text NOT NULL DEFAULT 'trial',
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS cnpj text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS primary_color text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'trial';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS maintenance_mode boolean NOT NULL DEFAULT false;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS maintenance_message text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS companies_slug_key ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);

CREATE TABLE IF NOT EXISTS public.company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'owner',
  status text NOT NULL DEFAULT 'active',
  invited_email text,
  invited_at timestamptz,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);

ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'owner';
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS invited_email text;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS invited_at timestamptz;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS joined_at timestamptz DEFAULT now();
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.company_members'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%role%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.company_members DROP CONSTRAINT IF EXISTS %I', constraint_name);
  END IF;
END $$;

ALTER TABLE public.company_members
  ADD CONSTRAINT company_members_role_check
  CHECK (role IN ('owner', 'admin', 'manager', 'recruiter', 'quality', 'dp'));

ALTER TABLE public.company_members DROP CONSTRAINT IF EXISTS company_members_status_check;
ALTER TABLE public.company_members
  ADD CONSTRAINT company_members_status_check
  CHECK (status IN ('active', 'suspended', 'invited'));

CREATE INDEX IF NOT EXISTS idx_company_members_company ON public.company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user ON public.company_members(user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_company_role ON public.company_members(company_id, role);

-- ---------------------------------------------------------------------
-- 2. company_id nas tabelas de dominio
-- ---------------------------------------------------------------------
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

DO $$
DECLARE
  rel_name text;
  tables text[] := ARRAY[
    'audit_logs',
    'candidate_resumes',
    'candidate_avatars',
    'candidate_demographics',
    'candidate_stage_history',
    'communication_logs',
    'email_templates',
    'scheduled_emails',
    'feedbacks',
    'analytics_events',
    'system_settings',
    'links'
  ];
BEGIN
  FOREACH rel_name IN ARRAY tables LOOP
    IF to_regclass(format('public.%I', rel_name)) IS NOT NULL THEN
      EXECUTE format(
        'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE',
        rel_name
      );
    END IF;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_roles_company_id ON public.roles(company_id);
CREATE INDEX IF NOT EXISTS idx_candidates_company_id ON public.candidates(company_id);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);

DO $$
DECLARE
  rel_name text;
  tables text[] := ARRAY[
    'audit_logs',
    'candidate_resumes',
    'candidate_avatars',
    'candidate_demographics',
    'candidate_stage_history',
    'communication_logs',
    'email_templates',
    'scheduled_emails',
    'feedbacks',
    'analytics_events',
    'system_settings',
    'links'
  ];
BEGIN
  FOREACH rel_name IN ARRAY tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = rel_name
        AND column_name = 'company_id'
    ) THEN
      EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_company_id ON public.%I(company_id)', rel_name, rel_name);
    END IF;
  END LOOP;
END $$;

-- ---------------------------------------------------------------------
-- 3. Constraints de roles do usuario
-- ---------------------------------------------------------------------
DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.users'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%role%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.users DROP CONSTRAINT IF EXISTS %I', constraint_name);
  END IF;
END $$;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin', 'owner', 'admin', 'manager', 'recruiter', 'quality', 'dp', 'candidate'));

-- ---------------------------------------------------------------------
-- 4. Helpers seguros para policies e cadastro self-service
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.company_members
  WHERE user_id = (SELECT auth.uid())
    AND status = 'active'
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = (SELECT auth.uid())
      AND role = 'super_admin'
      AND status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff_member()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE user_id = (SELECT auth.uid())
      AND status = 'active'
      AND role IN ('owner', 'admin', 'manager', 'recruiter', 'quality', 'dp')
  )
$$;

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
  base_slug := lower(coalesce(p_name, 'empresa'));
  base_slug := translate(base_slug, 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn');
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
  base_slug := substring(base_slug from 1 for 50);

  IF base_slug = '' THEN
    base_slug := 'empresa';
  END IF;

  candidate := base_slug;

  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.companies WHERE slug = candidate) THEN
      RETURN candidate;
    END IF;
    counter := counter + 1;
    candidate := base_slug || '-' || counter::text;
    IF counter > 1000 THEN
      RAISE EXCEPTION 'Nao foi possivel gerar slug unico para %', p_name;
    END IF;
  END LOOP;
END;
$$;

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
    RAISE EXCEPTION 'Usuario nao autenticado.';
  END IF;

  IF p_name IS NULL OR length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Nome da empresa e obrigatorio.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.company_members
    WHERE user_id = v_user_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Usuario ja vinculado a uma empresa.';
  END IF;

  v_cnpj_clean := nullif(regexp_replace(coalesce(p_cnpj, ''), '\D', '', 'g'), '');

  IF v_cnpj_clean IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companies WHERE cnpj = v_cnpj_clean
  ) THEN
    RAISE EXCEPTION 'Ja existe uma empresa cadastrada com este CNPJ.';
  END IF;

  v_slug := public.generate_company_slug(p_name);
  SELECT email INTO v_email FROM auth.users WHERE id = v_user_id;

  INSERT INTO public.companies (name, slug, cnpj, status, maintenance_mode)
  VALUES (trim(p_name), v_slug, v_cnpj_clean, 'trial', false)
  RETURNING * INTO v_company;

  INSERT INTO public.company_members (company_id, user_id, role, status, joined_at)
  VALUES (v_company.id, v_user_id, 'owner', 'active', now());

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

REVOKE ALL ON FUNCTION public.create_company_with_owner(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_company_with_owner(text, text) TO authenticated;

-- ---------------------------------------------------------------------
-- 5. RLS principal
-- ---------------------------------------------------------------------
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "companies_select" ON public.companies;
DROP POLICY IF EXISTS "companies_select_public_slug" ON public.companies;
DROP POLICY IF EXISTS "companies_update_owner_admin" ON public.companies;
DROP POLICY IF EXISTS "companies_insert_self_service" ON public.companies;
CREATE POLICY "companies_select" ON public.companies
  FOR SELECT TO authenticated
  USING (id = public.current_company_id() OR public.is_super_admin());
CREATE POLICY "companies_select_public_slug" ON public.companies
  FOR SELECT TO anon
  USING (status IN ('active', 'trial'));
CREATE POLICY "companies_update_owner_admin" ON public.companies
  FOR UPDATE TO authenticated
  USING (
    id = public.current_company_id()
    AND EXISTS (
      SELECT 1 FROM public.company_members
      WHERE company_id = companies.id
        AND user_id = (SELECT auth.uid())
        AND role IN ('owner', 'admin')
        AND status = 'active'
    )
  );
CREATE POLICY "companies_insert_self_service" ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "company_members_select" ON public.company_members;
DROP POLICY IF EXISTS "company_members_select_own" ON public.company_members;
DROP POLICY IF EXISTS "company_members_select_tenant" ON public.company_members;
DROP POLICY IF EXISTS "company_members_insert_owner" ON public.company_members;
CREATE POLICY "company_members_select" ON public.company_members
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (
      company_id = public.current_company_id()
      AND public.current_company_id() IS NOT NULL
      AND public.is_staff_member()
    )
    OR public.is_super_admin()
  );
CREATE POLICY "company_members_insert_owner" ON public.company_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) AND role = 'owner');

DROP POLICY IF EXISTS "roles_select_authenticated" ON public.roles;
DROP POLICY IF EXISTS "roles_insert_staff" ON public.roles;
DROP POLICY IF EXISTS "roles_update_staff" ON public.roles;
DROP POLICY IF EXISTS "roles_delete_staff" ON public.roles;
DROP POLICY IF EXISTS "roles_select_tenant" ON public.roles;
DROP POLICY IF EXISTS "roles_insert_tenant" ON public.roles;
DROP POLICY IF EXISTS "roles_update_tenant" ON public.roles;
DROP POLICY IF EXISTS "roles_delete_tenant" ON public.roles;
CREATE POLICY "roles_select_tenant" ON public.roles
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_super_admin());
CREATE POLICY "roles_insert_tenant" ON public.roles
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.is_staff_member()
  );
CREATE POLICY "roles_update_tenant" ON public.roles
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id() AND public.is_staff_member())
    OR public.is_super_admin()
  )
  WITH CHECK (
    (company_id = public.current_company_id() AND public.is_staff_member())
    OR public.is_super_admin()
  );
CREATE POLICY "roles_delete_tenant" ON public.roles
  FOR DELETE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members
        WHERE user_id = (SELECT auth.uid())
          AND company_id = roles.company_id
          AND role IN ('owner', 'admin')
          AND status = 'active'
      ))
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "jobs_select_public" ON public.jobs;
DROP POLICY IF EXISTS "jobs_select_active_public" ON public.jobs;
DROP POLICY IF EXISTS "jobs_select_staff" ON public.jobs;
DROP POLICY IF EXISTS "jobs_insert_staff" ON public.jobs;
DROP POLICY IF EXISTS "jobs_update_staff" ON public.jobs;
DROP POLICY IF EXISTS "jobs_delete_staff" ON public.jobs;
DROP POLICY IF EXISTS "Public read access for active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters/Admins full access" ON public.jobs;
DROP POLICY IF EXISTS "jobs_select_tenant" ON public.jobs;
DROP POLICY IF EXISTS "jobs_insert_tenant" ON public.jobs;
DROP POLICY IF EXISTS "jobs_update_tenant" ON public.jobs;
DROP POLICY IF EXISTS "jobs_delete_tenant" ON public.jobs;
CREATE POLICY "jobs_select_public" ON public.jobs
  FOR SELECT
  USING (
    status = 'Ativa'
    AND EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = jobs.company_id
        AND companies.status IN ('active', 'trial')
    )
  );
CREATE POLICY "jobs_select_tenant" ON public.jobs
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_super_admin());
CREATE POLICY "jobs_insert_tenant" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.is_staff_member()
  );
CREATE POLICY "jobs_update_tenant" ON public.jobs
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id() AND public.is_staff_member())
    OR public.is_super_admin()
  )
  WITH CHECK (
    (company_id = public.current_company_id() AND public.is_staff_member())
    OR public.is_super_admin()
  );
CREATE POLICY "jobs_delete_tenant" ON public.jobs
  FOR DELETE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members
        WHERE user_id = (SELECT auth.uid())
          AND company_id = jobs.company_id
          AND role IN ('owner', 'admin')
          AND status = 'active'
      ))
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "candidates_public_select" ON public.candidates;
DROP POLICY IF EXISTS "candidates_select_restricted" ON public.candidates;
DROP POLICY IF EXISTS "candidates_insert_anon" ON public.candidates;
DROP POLICY IF EXISTS "candidates_select_staff" ON public.candidates;
DROP POLICY IF EXISTS "candidates_update_staff" ON public.candidates;
DROP POLICY IF EXISTS "candidates_delete_staff" ON public.candidates;
DROP POLICY IF EXISTS "candidates_select_own" ON public.candidates;
DROP POLICY IF EXISTS "candidates_select_tenant" ON public.candidates;
DROP POLICY IF EXISTS "candidates_insert_auth" ON public.candidates;
DROP POLICY IF EXISTS "candidates_update_own" ON public.candidates;
DROP POLICY IF EXISTS "candidates_update_tenant" ON public.candidates;
DROP POLICY IF EXISTS "candidates_delete_tenant" ON public.candidates;
CREATE POLICY "candidates_select_own" ON public.candidates
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY "candidates_select_tenant" ON public.candidates
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_super_admin());
CREATE POLICY "candidates_insert_auth" ON public.candidates
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND job_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = candidates.job_id
        AND jobs.company_id = candidates.company_id
    )
  );
CREATE POLICY "candidates_update_own" ON public.candidates
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY "candidates_update_tenant" ON public.candidates
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id() AND public.is_staff_member())
    OR public.is_super_admin()
  )
  WITH CHECK (
    (company_id = public.current_company_id() AND public.is_staff_member())
    OR public.is_super_admin()
  );
CREATE POLICY "candidates_delete_tenant" ON public.candidates
  FOR DELETE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members
        WHERE user_id = (SELECT auth.uid())
          AND company_id = candidates.company_id
          AND role IN ('owner', 'admin')
          AND status = 'active'
      ))
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "users_read_own" ON public.users;
DROP POLICY IF EXISTS "users_select_self" ON public.users;
DROP POLICY IF EXISTS "users_select_tenant" ON public.users;
DROP POLICY IF EXISTS "users_update_self" ON public.users;
DROP POLICY IF EXISTS "users_update_tenant" ON public.users;
CREATE POLICY "users_select_self" ON public.users
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));
CREATE POLICY "users_select_tenant" ON public.users
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_super_admin());
CREATE POLICY "users_update_self" ON public.users
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()));
CREATE POLICY "users_update_tenant" ON public.users
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members
        WHERE user_id = (SELECT auth.uid())
          AND company_id = users.company_id
          AND role IN ('owner', 'admin')
          AND status = 'active'
      ))
    OR public.is_super_admin()
  );

-- ---------------------------------------------------------------------
-- 6. RLS para auditoria e tabelas satelite
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.audit_logs') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.audit_logs';
    EXECUTE 'DROP POLICY IF EXISTS "audit_logs_insert_restricted" ON public.audit_logs';
    EXECUTE 'DROP POLICY IF EXISTS "audit_logs_select_tenant" ON public.audit_logs';
    EXECUTE 'DROP POLICY IF EXISTS "audit_logs_insert_tenant" ON public.audit_logs';

    EXECUTE 'CREATE POLICY "audit_logs_select_tenant" ON public.audit_logs FOR SELECT TO authenticated USING (company_id = public.current_company_id() OR public.is_super_admin())';
    EXECUTE 'CREATE POLICY "audit_logs_insert_tenant" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (company_id = public.current_company_id() OR public.is_super_admin())';
  END IF;
END $$;

DO $$
DECLARE
  rel_name text;
  tables text[] := ARRAY[
    'candidate_resumes',
    'candidate_avatars',
    'candidate_demographics',
    'candidate_stage_history',
    'communication_logs',
    'email_templates',
    'scheduled_emails',
    'feedbacks',
    'analytics_events',
    'system_settings',
    'links'
  ];
BEGIN
  FOREACH rel_name IN ARRAY tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = rel_name
        AND column_name = 'company_id'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', rel_name);

      EXECUTE format('DROP POLICY IF EXISTS "%s_select_tenant" ON public.%I', rel_name, rel_name);
      EXECUTE format('DROP POLICY IF EXISTS "%s_insert_tenant" ON public.%I', rel_name, rel_name);
      EXECUTE format('DROP POLICY IF EXISTS "%s_update_tenant" ON public.%I', rel_name, rel_name);
      EXECUTE format('DROP POLICY IF EXISTS "%s_delete_tenant" ON public.%I', rel_name, rel_name);

      EXECUTE format(
        'CREATE POLICY "%s_select_tenant" ON public.%I FOR SELECT TO authenticated USING (company_id = public.current_company_id() OR public.is_super_admin())',
        rel_name,
        rel_name
      );
      EXECUTE format(
        'CREATE POLICY "%s_insert_tenant" ON public.%I FOR INSERT TO authenticated WITH CHECK (company_id = public.current_company_id() OR public.is_super_admin())',
        rel_name,
        rel_name
      );
      EXECUTE format(
        'CREATE POLICY "%s_update_tenant" ON public.%I FOR UPDATE TO authenticated USING (company_id = public.current_company_id() OR public.is_super_admin()) WITH CHECK (company_id = public.current_company_id() OR public.is_super_admin())',
        rel_name,
        rel_name
      );
      EXECUTE format(
        'CREATE POLICY "%s_delete_tenant" ON public.%I FOR DELETE TO authenticated USING (company_id = public.current_company_id() OR public.is_super_admin())',
        rel_name,
        rel_name
      );
    END IF;
  END LOOP;
END $$;

DO $$
BEGIN
  IF to_regclass('public.candidate_resumes') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "candidate_resumes_select_own" ON public.candidate_resumes';
    EXECUTE 'DROP POLICY IF EXISTS "candidate_resumes_insert_own" ON public.candidate_resumes';
    EXECUTE $p$
      CREATE POLICY "candidate_resumes_select_own" ON public.candidate_resumes
        FOR SELECT TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.candidates
            WHERE candidates.id = candidate_resumes.candidate_id
              AND candidates.user_id = (SELECT auth.uid())
          )
        )
    $p$;
    EXECUTE $p$
      CREATE POLICY "candidate_resumes_insert_own" ON public.candidate_resumes
        FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.candidates
            WHERE candidates.id = candidate_resumes.candidate_id
              AND candidates.user_id = (SELECT auth.uid())
          )
        )
    $p$;
  END IF;

  IF to_regclass('public.candidate_avatars') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "candidate_avatars_select_own" ON public.candidate_avatars';
    EXECUTE 'DROP POLICY IF EXISTS "candidate_avatars_insert_own" ON public.candidate_avatars';
    EXECUTE $p$
      CREATE POLICY "candidate_avatars_select_own" ON public.candidate_avatars
        FOR SELECT TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.candidates
            WHERE candidates.id = candidate_avatars.candidate_id
              AND candidates.user_id = (SELECT auth.uid())
          )
        )
    $p$;
    EXECUTE $p$
      CREATE POLICY "candidate_avatars_insert_own" ON public.candidate_avatars
        FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.candidates
            WHERE candidates.id = candidate_avatars.candidate_id
              AND candidates.user_id = (SELECT auth.uid())
          )
        )
    $p$;
  END IF;
END $$;

COMMIT;

-- Verificacoes manuais sugeridas:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
-- SELECT public.current_company_id();
