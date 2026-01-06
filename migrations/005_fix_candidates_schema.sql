-- CORREÇÃO CRÍTICA DO SCHEMA - CANDIDATES
-- Execute este script no SQL Editor do Supabase para corrigir o erro "column 'education' not found"

-- 1. Adicionar colunas complexas (JSON/Arrays)
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS feedbacks JSONB DEFAULT '[]'::jsonb;

-- 2. Adicionar colunas de texto simples do perfil
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS portfolio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. Garantir colunas de currículo
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS resume_name TEXT;

-- 4. Criar índices para performance em buscas JSON (Opcional mas recomendado)
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON candidates USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_candidates_education ON candidates USING GIN (education);
CREATE INDEX IF NOT EXISTS idx_candidates_experience ON candidates USING GIN (experience);

-- 5. Comentários para documentação
COMMENT ON COLUMN candidates.education IS 'Lista de formação acadêmica em JSON';
COMMENT ON COLUMN candidates.experience IS 'Lista de experiência profissional em JSON';
COMMENT ON COLUMN candidates.skills IS 'Array de habilidades técnicas/soft skills';

-- Confirmação
DO $$
BEGIN
    RAISE NOTICE '✅ Schema da tabela candidates corrigido com sucesso!';
END $$;
