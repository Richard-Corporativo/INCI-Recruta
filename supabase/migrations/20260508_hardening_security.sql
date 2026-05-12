-- Migration: 20260508_hardening_security.sql
-- Objetivo: Hardening de segurança, proteção contra escalação de privilégios e privacidade de dados.

-- 1. Buckets Privados
UPDATE storage.buckets SET public = false WHERE id IN ('resumes', 'avatars');

-- 2. Limpeza de políticas públicas no Storage
DROP POLICY IF EXISTS "resumes_select_public" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- 3. Políticas de Acesso Seguro para Resumes
-- Apenas o dono ou usuários internos (RH/Admin/etc) podem ler
CREATE POLICY "resumes_secure_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text -- Dono
    OR 
    EXISTS ( -- Usuários internos
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'recruiter', 'manager', 'quality', 'dp')
      AND status = 'active'
    )
  )
);

-- 4. Ajuste da Trigger handle_new_user (Segurança Crítica)
-- Bloqueia escalação via metadata e força 'pending_approval' para roles privilegiados
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_role TEXT;
    new_status TEXT;
BEGIN
    -- NUNCA confie no role vindo do client (metadata) para privilégios
    -- Se for um cadastro público, o role padrão é 'candidate'
    -- Se for uma solicitação de empresa (manager), o status deve ser 'pending_approval'
    
    new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'candidate');
    
    -- Validação: Apenas 'candidate' pode ser ativado automaticamente via signUp público
    IF new_role = 'candidate' THEN
        new_status := 'active';
    ELSE
        -- Qualquer outro role (manager, recruiter, etc) via cadastro público nasce pendente
        new_status := 'pending_approval';
        -- Opcional: registrar o role solicitado para auditoria, mas manter o registro como candidate até aprovação
        -- Aqui vamos permitir o role solicitado na tabela users, mas o status bloqueia o acesso via Middleware/RLS
    END IF;

    -- Se o status vier explicitamente como pending_approval do client, respeitamos
    IF NEW.raw_user_meta_data->>'status' = 'pending_approval' THEN
        new_status := 'pending_approval';
    END IF;

    INSERT INTO public.users (
        id, 
        email, 
        name, 
        full_name,
        company_name, 
        role, 
        status
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Novo Usuário'),
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'company_name',
        new_role,
        new_status
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(NULLIF(EXCLUDED.name, ''), users.name),
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), users.full_name),
        company_name = COALESCE(NULLIF(EXCLUDED.company_name, ''), users.company_name),
        -- Não permite que o update via trigger mude o role se já existir, 
        -- a menos que seja um admin mudando via Dashboard (que não passaria por aqui)
        status = EXCLUDED.status;
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Auditoria de RLS nas tabelas críticas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Usuários só veem seus próprios dados, Admins veem tudo
DROP POLICY IF EXISTS "users_read_own" ON public.users;
CREATE POLICY "users_read_own" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "users_admin_all" ON public.users;
CREATE POLICY "users_admin_all" ON public.users FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin' AND status = 'active'));

COMMENT ON FUNCTION public.handle_new_user() IS 'Hardened: Sincroniza usuários e previne escalação de privilégios automática.';
