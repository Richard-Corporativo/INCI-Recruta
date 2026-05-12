-- migration/20260504_update_user_sync_trigger.sql
-- Objetivo: Ajustar schema de usuários e trigger para suportar novos papéis (Candidato) e metadados (full_name, company_name)

-- 1. Adicionar colunas necessárias se não existirem
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_name TEXT;

-- 2. Atualizar a constraint de ROLE para incluir 'candidate'
-- Nota: Como é uma constraint de CHECK, precisamos remover e recriar se o nome for conhecido, 
-- ou simplesmente garantir que o tipo suporte os novos valores.
-- Se a constraint não tiver nome, podemos tentar alterá-la.
DO $$ 
BEGIN
    -- Tenta remover a constraint antiga se existir (o nome padrão costuma ser users_role_check)
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'manager', 'recruiter', 'quality', 'dp', 'candidate'));

-- 2b. Garantir status 'suspended' na constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE public.users 
ADD CONSTRAINT users_status_check 
CHECK (status IN ('active', 'suspended', 'pending_approval'));

-- 3. Atualizar a função handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate'),
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(NULLIF(EXCLUDED.name, ''), users.name),
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), users.full_name),
    company_name = COALESCE(NULLIF(EXCLUDED.company_name, ''), users.company_name),
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Sincroniza novos usuários do Auth para public.users, suportando candidatos e empresas.';
