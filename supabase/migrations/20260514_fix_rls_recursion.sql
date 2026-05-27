-- MIGRATION: Correção de Recursão Infinita e Erros de Permissão (Users e Settings)
-- Aplique este SQL no editor do Supabase para corrigir os erros de "infinite recursion" e permissão de administrador.

-- 1. Corrigir recursão infinita na função is_super_admin
-- Antigamente ela lia a tabela 'users' dentro da política da tabela 'users', causando loop.
-- Agora ela usa os metadados do JWT do Auth para verificar a role.
CREATE OR REPLACE FUNCTION public.is_super_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
    SELECT (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin';
$function$;

-- 2. Limpar e simplificar políticas de SELECT da tabela 'users'
DROP POLICY IF EXISTS "Admins view all profiles" ON public.users;
DROP POLICY IF EXISTS "super_admin_view_all_users" ON public.users;
DROP POLICY IF EXISTS "users_admin_all" ON public.users;
DROP POLICY IF EXISTS "users_select_self" ON public.users;
DROP POLICY IF EXISTS "users_read_own" ON public.users;

-- Nova política unificada para visualização de perfis
-- Permite que o próprio usuário se veja ou que Admins/SuperAdmins vejam todos via JWT
CREATE POLICY "user_view_policy" ON public.users
FOR SELECT TO authenticated
USING (
    (auth.uid() = id) OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 3. Corrigir permissões de SYSTEM_SETTINGS
-- Garante que a tabela system_settings possa ser lida por administradores
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;
CREATE POLICY "Admins can manage settings" ON public.system_settings
FOR ALL TO authenticated
USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);

DROP POLICY IF EXISTS "All users can view settings" ON public.system_settings;
CREATE POLICY "All users can view settings" ON public.system_settings
FOR SELECT TO authenticated
USING (true);

-- 4. Garantir que as tabelas de auditoria tenham políticas de visualização para admins
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT TO authenticated
USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);
