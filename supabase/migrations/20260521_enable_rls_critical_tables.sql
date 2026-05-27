-- Enable RLS on critical tables that had policies defined but RLS disabled
-- Identified via Supabase Studio audit (2026-05-21)
-- Affected: roles, jobs, interviews, links, system_settings

-- ============================================================
-- ROLES
-- ============================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roles_select_tenant" ON public.roles;
DROP POLICY IF EXISTS "roles_insert_tenant" ON public.roles;
DROP POLICY IF EXISTS "roles_update_tenant" ON public.roles;
DROP POLICY IF EXISTS "roles_delete_tenant" ON public.roles;

CREATE POLICY "roles_select_tenant" ON public.roles
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_super_admin());

CREATE POLICY "roles_insert_tenant" ON public.roles
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id());

CREATE POLICY "roles_update_tenant" ON public.roles
  FOR UPDATE TO authenticated
  USING (company_id = public.current_company_id())
  WITH CHECK (company_id = public.current_company_id());

CREATE POLICY "roles_delete_tenant" ON public.roles
  FOR DELETE TO authenticated
  USING (company_id = public.current_company_id());

-- ============================================================
-- JOBS (policies already defined — only enabling RLS)
-- ============================================================
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- INTERVIEWS (policies defined in 20260514_agenda_and_rls_hardening)
-- ============================================================
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- LINKS
-- ============================================================
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "links_public_read" ON public.links;
DROP POLICY IF EXISTS "links_modify_own_company" ON public.links;

CREATE POLICY "links_public_read" ON public.links
  FOR SELECT
  USING (true);

CREATE POLICY "links_modify_own_company" ON public.links
  FOR ALL TO authenticated
  USING (company_id = public.current_company_id())
  WITH CHECK (company_id = public.current_company_id());

-- ============================================================
-- SYSTEM_SETTINGS
-- ============================================================
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "system_settings_select_tenant" ON public.system_settings;
DROP POLICY IF EXISTS "system_settings_manage_tenant" ON public.system_settings;

CREATE POLICY "system_settings_select_tenant" ON public.system_settings
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_super_admin());

CREATE POLICY "system_settings_manage_tenant" ON public.system_settings
  FOR ALL TO authenticated
  USING (company_id = public.current_company_id() OR public.is_super_admin())
  WITH CHECK (company_id = public.current_company_id() OR public.is_super_admin());
