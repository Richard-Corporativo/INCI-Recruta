-- Migration: candidate_saved_jobs
-- Descrição: Tabela para persistir vagas salvas/favoritadas por candidatos autenticados
-- Permite sincronização entre dispositivos via Supabase Auth
-- Criado em: 2026-04-30

-- ============================================================
-- 1. CRIAR TABELA
-- ============================================================
CREATE TABLE IF NOT EXISTS candidate_saved_jobs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id      TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Garante que um usuário não salve a mesma vaga duas vezes
    CONSTRAINT candidate_saved_jobs_unique UNIQUE (user_id, job_id)
);

-- ============================================================
-- 2. ÍNDICES PARA PERFORMANCE
-- ============================================================
-- Índice para busca por usuário (query mais comum)
CREATE INDEX IF NOT EXISTS idx_candidate_saved_jobs_user_id
    ON candidate_saved_jobs (user_id);

-- Índice para busca por vaga (ex: contar quantos salvaram)
CREATE INDEX IF NOT EXISTS idx_candidate_saved_jobs_job_id
    ON candidate_saved_jobs (job_id);

-- ============================================================
-- 3. HABILITAR RLS (Row Level Security)
-- ============================================================
ALTER TABLE candidate_saved_jobs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. POLÍTICAS DE SEGURANÇA RLS
-- ============================================================

-- Candidato só lê os SEUS próprios registros
CREATE POLICY "candidate_saved_jobs_select"
    ON candidate_saved_jobs FOR SELECT
    USING (auth.uid() = user_id);

-- Candidato só insere para si mesmo
CREATE POLICY "candidate_saved_jobs_insert"
    ON candidate_saved_jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Candidato só deleta os SEUS próprios registros
CREATE POLICY "candidate_saved_jobs_delete"
    ON candidate_saved_jobs FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- 5. COMENTÁRIOS DE DOCUMENTAÇÃO
-- ============================================================
COMMENT ON TABLE candidate_saved_jobs IS
    'Vagas favoritadas/salvas por candidatos autenticados. Sincronizadas via Supabase Auth.';

COMMENT ON COLUMN candidate_saved_jobs.user_id IS
    'ID do usuário autenticado no Supabase Auth (auth.users.id)';

COMMENT ON COLUMN candidate_saved_jobs.job_id IS
    'ID da vaga na tabela jobs (UUID ou texto conforme o modelo)';
