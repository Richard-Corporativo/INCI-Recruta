-- Migration 027: RLS Multi-Tenant
-- Reescreve as policies das tabelas de domínio para isolar dados por empresa.
-- Regras gerais:
--   • Staff (admin/owner/recruiter/manager) só enxerga linhas com company_id = current_company_id().
--   • super_admin enxerga tudo (painel INCI Brasil).
--   • Anônimos/candidatos têm acesso público APENAS a vagas ativas de empresas ativas.
--   • Candidatos enxergam apenas suas próprias candidaturas (auth.uid() = user_id).
--   • Idempotente: pode rodar múltiplas vezes.

BEGIN;

-- =====================================================================
-- Helpers locais (assume que current_company_id() e is_super_admin() existem — criados na 024)
-- =====================================================================

-- =====================================================================
-- 1. ROLES (cargos) — isolada por empresa
-- =====================================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roles_select_authenticated" ON public.roles;
DROP POLICY IF EXISTS "roles_insert_staff"          ON public.roles;
DROP POLICY IF EXISTS "roles_update_staff"          ON public.roles;
DROP POLICY IF EXISTS "roles_delete_staff"          ON public.roles;
DROP POLICY IF EXISTS "roles_select_tenant"         ON public.roles;
DROP POLICY IF EXISTS "roles_insert_tenant"         ON public.roles;
DROP POLICY IF EXISTS "roles_update_tenant"         ON public.roles;
DROP POLICY IF EXISTS "roles_delete_tenant"         ON public.roles;

CREATE POLICY "roles_select_tenant" ON public.roles
  FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    OR public.is_super_admin()
  );

CREATE POLICY "roles_insert_tenant" ON public.roles
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND EXISTS (
      SELECT 1 FROM public.company_members m
      WHERE m.user_id = auth.uid()
        AND m.company_id = roles.company_id
        AND m.status = 'active'
        AND m.role IN ('owner', 'admin', 'recruiter', 'manager')
    )
  );

CREATE POLICY "roles_update_tenant" ON public.roles
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m
        WHERE m.user_id = auth.uid()
          AND m.company_id = roles.company_id
          AND m.status = 'active'
          AND m.role IN ('owner', 'admin', 'recruiter', 'manager')
      ))
    OR public.is_super_admin()
  );

CREATE POLICY "roles_delete_tenant" ON public.roles
  FOR DELETE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m
        WHERE m.user_id = auth.uid()
          AND m.company_id = roles.company_id
          AND m.status = 'active'
          AND m.role IN ('owner', 'admin')
      ))
    OR public.is_super_admin()
  );

-- =====================================================================
-- 2. JOBS (vagas) — staff por empresa, leitura pública apenas para vagas ativas de empresas ativas
-- =====================================================================
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_select_active_public" ON public.jobs;
DROP POLICY IF EXISTS "jobs_select_staff"          ON public.jobs;
DROP POLICY IF EXISTS "jobs_insert_staff"          ON public.jobs;
DROP POLICY IF EXISTS "jobs_update_staff"          ON public.jobs;
DROP POLICY IF EXISTS "jobs_delete_staff"          ON public.jobs;
DROP POLICY IF EXISTS "Public read access for active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters/Admins full access"      ON public.jobs;
DROP POLICY IF EXISTS "jobs_select_public"   ON public.jobs;
DROP POLICY IF EXISTS "jobs_select_tenant"   ON public.jobs;
DROP POLICY IF EXISTS "jobs_insert_tenant"   ON public.jobs;
DROP POLICY IF EXISTS "jobs_update_tenant"   ON public.jobs;
DROP POLICY IF EXISTS "jobs_delete_tenant"   ON public.jobs;

-- Leitura pública (anon + authenticated) apenas para vagas ativas de empresas ativas
CREATE POLICY "jobs_select_public" ON public.jobs
  FOR SELECT
  USING (
    status = 'Ativa'
    AND EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.id = jobs.company_id
        AND c.status = 'active'
    )
  );

-- Staff vê todas as vagas da própria empresa
CREATE POLICY "jobs_select_tenant" ON public.jobs
  FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    OR public.is_super_admin()
  );

CREATE POLICY "jobs_insert_tenant" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND EXISTS (
      SELECT 1 FROM public.company_members m
      WHERE m.user_id = auth.uid()
        AND m.company_id = jobs.company_id
        AND m.status = 'active'
        AND m.role IN ('owner', 'admin', 'recruiter', 'manager')
    )
  );

CREATE POLICY "jobs_update_tenant" ON public.jobs
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m
        WHERE m.user_id = auth.uid()
          AND m.company_id = jobs.company_id
          AND m.status = 'active'
          AND m.role IN ('owner', 'admin', 'recruiter', 'manager')
      ))
    OR public.is_super_admin()
  );

CREATE POLICY "jobs_delete_tenant" ON public.jobs
  FOR DELETE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m
        WHERE m.user_id = auth.uid()
          AND m.company_id = jobs.company_id
          AND m.status = 'active'
          AND m.role IN ('owner', 'admin')
      ))
    OR public.is_super_admin()
  );

-- =====================================================================
-- 3. CANDIDATES (candidaturas)
--    • Candidato lê/escreve apenas suas próprias candidaturas (user_id = auth.uid()).
--    • Staff vê apenas candidaturas das vagas da própria empresa.
-- =====================================================================
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "candidates_insert_anon" ON public.candidates;
DROP POLICY IF EXISTS "candidates_insert_auth" ON public.candidates;
DROP POLICY IF EXISTS "candidates_select_own"  ON public.candidates;
DROP POLICY IF EXISTS "candidates_select_staff" ON public.candidates;
DROP POLICY IF EXISTS "candidates_update_own"  ON public.candidates;
DROP POLICY IF EXISTS "candidates_update_staff" ON public.candidates;
DROP POLICY IF EXISTS "candidates_delete_staff" ON public.candidates;
DROP POLICY IF EXISTS "candidates_select_tenant" ON public.candidates;
DROP POLICY IF EXISTS "candidates_update_tenant" ON public.candidates;
DROP POLICY IF EXISTS "candidates_delete_tenant" ON public.candidates;

-- Candidato vê as suas
CREATE POLICY "candidates_select_own" ON public.candidates
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Staff vê as candidaturas da empresa
CREATE POLICY "candidates_select_tenant" ON public.candidates
  FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    OR public.is_super_admin()
  );

-- Candidato cria sua candidatura (company_id deve bater com a empresa da vaga)
CREATE POLICY "candidates_insert_auth" ON public.candidates
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = candidates.job_id
        AND j.company_id = candidates.company_id
    )
  );

-- Candidato atualiza apenas a sua
CREATE POLICY "candidates_update_own" ON public.candidates
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Staff atualiza candidaturas da empresa (mover de etapa, etc.)
CREATE POLICY "candidates_update_tenant" ON public.candidates
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m
        WHERE m.user_id = auth.uid()
          AND m.company_id = candidates.company_id
          AND m.status = 'active'
          AND m.role IN ('owner', 'admin', 'recruiter', 'manager')
      ))
    OR public.is_super_admin()
  );

CREATE POLICY "candidates_delete_tenant" ON public.candidates
  FOR DELETE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m
        WHERE m.user_id = auth.uid()
          AND m.company_id = candidates.company_id
          AND m.status = 'active'
          AND m.role IN ('owner', 'admin')
      ))
    OR public.is_super_admin()
  );

-- =====================================================================
-- 4. AUDIT_LOGS — leitura por empresa; insert por staff da empresa; sem update/delete
-- =====================================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='audit_logs') THEN
    EXECUTE 'ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS "audit_logs_select_tenant" ON public.audit_logs';
    EXECUTE 'DROP POLICY IF EXISTS "audit_logs_insert_tenant" ON public.audit_logs';

    EXECUTE $p$
      CREATE POLICY "audit_logs_select_tenant" ON public.audit_logs
        FOR SELECT TO authenticated
        USING (
          company_id = public.current_company_id()
          OR public.is_super_admin()
        )
    $p$;

    EXECUTE $p$
      CREATE POLICY "audit_logs_insert_tenant" ON public.audit_logs
        FOR INSERT TO authenticated
        WITH CHECK (
          company_id = public.current_company_id()
          OR public.is_super_admin()
        )
    $p$;
  END IF;
END $$;

-- =====================================================================
-- 5. TABELAS AUXILIARES — isolamento padrão por company_id
--    Padrão: SELECT/INSERT/UPDATE/DELETE restritos a current_company_id() ou super_admin.
--    Tabelas: candidate_resumes, candidate_avatars, candidate_demographics,
--             candidate_stage_history, communication_logs, email_templates,
--             scheduled_emails, feedbacks, analytics_events, system_settings.
-- =====================================================================
DO $$
DECLARE
  t text;
  aux_tables text[] := ARRAY[
    'candidate_resumes', 'candidate_avatars', 'candidate_demographics',
    'candidate_stage_history', 'communication_logs', 'email_templates',
    'scheduled_emails', 'feedbacks', 'analytics_events', 'system_settings'
  ];
BEGIN
  FOREACH t IN ARRAY aux_tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name=t AND column_name='company_id'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

      EXECUTE format('DROP POLICY IF EXISTS "%I_select_tenant" ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS "%I_insert_tenant" ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS "%I_update_tenant" ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS "%I_delete_tenant" ON public.%I', t, t);

      EXECUTE format($f$
        CREATE POLICY "%I_select_tenant" ON public.%I
          FOR SELECT TO authenticated
          USING (company_id = public.current_company_id() OR public.is_super_admin())
      $f$, t, t);

      EXECUTE format($f$
        CREATE POLICY "%I_insert_tenant" ON public.%I
          FOR INSERT TO authenticated
          WITH CHECK (company_id = public.current_company_id() OR public.is_super_admin())
      $f$, t, t);

      EXECUTE format($f$
        CREATE POLICY "%I_update_tenant" ON public.%I
          FOR UPDATE TO authenticated
          USING (company_id = public.current_company_id() OR public.is_super_admin())
      $f$, t, t);

      EXECUTE format($f$
        CREATE POLICY "%I_delete_tenant" ON public.%I
          FOR DELETE TO authenticated
          USING (company_id = public.current_company_id() OR public.is_super_admin())
      $f$, t, t);
    END IF;
  END LOOP;
END $$;

-- =====================================================================
-- 6. CANDIDATE_RESUMES / CANDIDATE_AVATARS — leituras extras para o próprio candidato
--    Permite ao candidato baixar seu currículo/avatar mesmo antes de ter staff.
-- =====================================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_resumes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "candidate_resumes_select_own" ON public.candidate_resumes';
    EXECUTE $p$
      CREATE POLICY "candidate_resumes_select_own" ON public.candidate_resumes
        FOR SELECT TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.candidates c
            WHERE c.id = candidate_resumes.candidate_id
              AND c.user_id = auth.uid()
          )
        )
    $p$;
    EXECUTE 'DROP POLICY IF EXISTS "candidate_resumes_insert_own" ON public.candidate_resumes';
    EXECUTE $p$
      CREATE POLICY "candidate_resumes_insert_own" ON public.candidate_resumes
        FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.candidates c
            WHERE c.id = candidate_resumes.candidate_id
              AND c.user_id = auth.uid()
          )
        )
    $p$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='candidate_avatars') THEN
    EXECUTE 'DROP POLICY IF EXISTS "candidate_avatars_select_own" ON public.candidate_avatars';
    EXECUTE $p$
      CREATE POLICY "candidate_avatars_select_own" ON public.candidate_avatars
        FOR SELECT TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.candidates c
            WHERE c.id = candidate_avatars.candidate_id
              AND c.user_id = auth.uid()
          )
        )
    $p$;
    EXECUTE 'DROP POLICY IF EXISTS "candidate_avatars_insert_own" ON public.candidate_avatars';
    EXECUTE $p$
      CREATE POLICY "candidate_avatars_insert_own" ON public.candidate_avatars
        FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.candidates c
            WHERE c.id = candidate_avatars.candidate_id
              AND c.user_id = auth.uid()
          )
        )
    $p$;
  END IF;
END $$;

-- =====================================================================
-- 7. USERS — staff vê membros da própria empresa; usuário vê a si mesmo
-- =====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_self"   ON public.users;
DROP POLICY IF EXISTS "users_select_tenant" ON public.users;
DROP POLICY IF EXISTS "users_update_self"   ON public.users;
DROP POLICY IF EXISTS "users_update_tenant" ON public.users;

CREATE POLICY "users_select_self" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_select_tenant" ON public.users
  FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    OR public.is_super_admin()
  );

CREATE POLICY "users_update_self" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_update_tenant" ON public.users
  FOR UPDATE TO authenticated
  USING (
    (company_id = public.current_company_id()
      AND EXISTS (
        SELECT 1 FROM public.company_members m
        WHERE m.user_id = auth.uid()
          AND m.company_id = users.company_id
          AND m.status = 'active'
          AND m.role IN ('owner', 'admin')
      ))
    OR public.is_super_admin()
  );

COMMIT;

-- =====================================================================
-- VERIFICAÇÃO (executar manualmente após aplicar):
--   SELECT tablename, policyname, cmd FROM pg_policies
--   WHERE schemaname='public' ORDER BY tablename, policyname;
-- =====================================================================
