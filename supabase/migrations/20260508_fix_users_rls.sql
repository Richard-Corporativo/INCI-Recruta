-- Migration: 20260508_fix_users_rls.sql
-- Objetivo: Corrigir políticas RLS da tabela public.users após hardening.
--   1. Adiciona política UPDATE para usuários atualizarem seus próprios dados
--   2. Corrige política admin que tinha referência recursiva (infinite recursion)

-- Política UPDATE para candidatos/usuários atualizarem seu próprio perfil
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Substitui users_admin_all que tinha recursão (EXISTS SELECT FROM public.users dentro da própria policy)
-- Usa auth.jwt() para checar o role sem consultar a tabela, evitando infinite recursion
DROP POLICY IF EXISTS "users_admin_all" ON public.users;
CREATE POLICY "users_admin_all" ON public.users
  FOR ALL TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
    OR id = auth.uid()
  );
