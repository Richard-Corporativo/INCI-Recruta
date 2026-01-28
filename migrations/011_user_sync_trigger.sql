-- migration/011_user_sync_trigger.sql

-- 1. Adicionar coluna de status do perfil na tabela public.users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_status TEXT DEFAULT 'incomplete';

-- Adicionar check constraint se for possível (opcional dependendo do ambiente)
-- ALTER TABLE public.users ADD CONSTRAINT check_profile_status CHECK (profile_status IN ('incomplete', 'complete'));

-- 2. Função para sincronizar automaticamente do Auth para a nossa tabela Users
-- Esta função é executada pelo banco de dados sempre que um novo usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status, profile_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Novo Candidato'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate'),
    'active',
    'incomplete'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), users.name),
    profile_status = users.profile_status; -- Mantém o status atual se já existir
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar o Trigger na tabela auth.users (tabela interna do Supabase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Script de reparo/sincronização inicial para usuários existentes
-- Execute isso uma vez no SQL Editor do Supabase se já houver usuários cadastrados:
/*
INSERT INTO public.users (id, email, name, role, status, profile_status)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'Usuário Antigo'), 
  COALESCE(raw_user_meta_data->>'role', 'candidate'),
  'active',
  'incomplete'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
*/

COMMENT ON FUNCTION public.handle_new_user() IS 'Sincroniza automaticamente novos usuários do Auth para a tabela public.users para evitar erro de Conta não encontrada.';
