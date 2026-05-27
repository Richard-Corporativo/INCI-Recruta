-- MIGRATION: Corrigir políticas RLS que referenciam user_metadata (vulnerabilidade crítica)
--
-- PROBLEMA: As políticas abaixo usavam auth.jwt() -> 'user_metadata' ->> 'role', que é
-- editável pelo próprio usuário via supabase.auth.updateUser(). Qualquer usuário podia
-- se autopromover para 'admin' ou 'super_admin' sem permissão.
--
-- SOLUÇÃO: Função SECURITY DEFINER com SET row_security = off lê public.users
-- diretamente sem disparar RLS — quebra a recursão infinita sem expor user_metadata.

-- 1. Função helper: lê o role do usuário atual sem disparar RLS (evita recursão)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- 2. Corrigir is_super_admin() para usar a tabela, não user_metadata editável
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(public.get_my_role() = 'super_admin', false);
$$;

-- 3. Corrigir policy de public.users (era a causa original da recursão)
DROP POLICY IF EXISTS "user_view_policy" ON public.users;
CREATE POLICY "user_view_policy" ON public.users
FOR SELECT TO authenticated
USING (
  auth.uid() = id
  OR public.get_my_role() IN ('admin', 'super_admin')
);

-- 4. Corrigir policy de public.system_settings
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;
CREATE POLICY "Admins can manage settings" ON public.system_settings
FOR ALL TO authenticated
USING (
  public.get_my_role() IN ('admin', 'super_admin')
);

-- 5. Corrigir policy de public.audit_logs
--    Mantém acesso por tenant (company_id) além do acesso admin global
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
FOR SELECT TO authenticated
USING (
  public.get_my_role() IN ('admin', 'super_admin')
  OR public.current_company_id() = company_id
);
