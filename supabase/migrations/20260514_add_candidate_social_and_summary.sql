-- Garante que as colunas de links sociais e resumo existam na tabela candidates.
-- Segura de re-executar (IF NOT EXISTS).

ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS github    TEXT,
  ADD COLUMN IF NOT EXISTS portfolio TEXT,
  ADD COLUMN IF NOT EXISTS summary   TEXT;
