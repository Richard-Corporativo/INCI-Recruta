-- Migration 029: RLS policies para super_admin (acesso cross-tenant)
-- ════════════════════════════════════════════════════════════════════════════════
-- INSTRUÇÕES DE APLICAÇÃO
-- ════════════════════════════════════════════════════════════════════════════════
-- PASSO 1 → Cole e execute TODO este arquivo no Supabase > SQL Editor
-- PASSO 2 → Crie a conta em: https://seu-dominio.com/cadastro/candidato
--           usando o e-mail: israel.richard@incibrasil.com.br
-- PASSO 3 → Volte ao SQL Editor e execute APENAS o bloco do PASSO 2
--           (marcado ao final deste arquivo)
-- ════════════════════════════════════════════════════════════════════════════════


-- ── Helper: is_super_admin() ─────────────────────────────────────────────────
-- SECURITY DEFINER evita recursão infinita quando a policy de `users`
-- precisa consultar a própria tabela `users` para verificar o role.
DROP FUNCTION IF EXISTS is_super_admin() CASCADE;
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    );
$$;

GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;


-- ── companies ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "super_admin_view_all_companies" ON companies;
CREATE POLICY "super_admin_view_all_companies" ON companies
    FOR SELECT TO authenticated
    USING (is_super_admin());

DROP POLICY IF EXISTS "super_admin_update_companies" ON companies;
CREATE POLICY "super_admin_update_companies" ON companies
    FOR UPDATE TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());


-- ── company_members ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "super_admin_view_all_members" ON company_members;
CREATE POLICY "super_admin_view_all_members" ON company_members
    FOR SELECT TO authenticated
    USING (is_super_admin());


-- ── jobs ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "super_admin_view_all_jobs" ON jobs;
CREATE POLICY "super_admin_view_all_jobs" ON jobs
    FOR SELECT TO authenticated
    USING (is_super_admin());


-- ── candidates ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "super_admin_view_all_candidates" ON candidates;
CREATE POLICY "super_admin_view_all_candidates" ON candidates
    FOR SELECT TO authenticated
    USING (is_super_admin());


-- ── users ────────────────────────────────────────────────────────────────────
-- Usa is_super_admin() (SECURITY DEFINER) para evitar recursão na self-query
DROP POLICY IF EXISTS "super_admin_view_all_users" ON users;
CREATE POLICY "super_admin_view_all_users" ON users
    FOR SELECT TO authenticated
    USING (is_super_admin());

DROP POLICY IF EXISTS "super_admin_update_all_users" ON users;
CREATE POLICY "super_admin_update_all_users" ON users
    FOR UPDATE TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());


-- ── audit_logs ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "super_admin_view_all_audit_logs" ON audit_logs;
CREATE POLICY "super_admin_view_all_audit_logs" ON audit_logs
    FOR SELECT TO authenticated
    USING (is_super_admin());


-- ════════════════════════════════════════════════════════════════════════════════
-- PASSO 2 — Execute este bloco APÓS criar a conta no INCI Recruta
-- (substitui o role de candidato pelo super_admin)
-- ════════════════════════════════════════════════════════════════════════════════

-- UPDATE users
--     SET role   = 'super_admin',
--         status = 'active'
-- WHERE email = 'israel.richard@incibrasil.com.br';
