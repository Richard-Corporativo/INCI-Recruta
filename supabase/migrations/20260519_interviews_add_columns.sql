-- Migração: 20260519_interviews_add_columns
-- Objetivo: Adicionar colunas ausentes na tabela interviews para fechar lacunas de dados.
--   interviewer_names: nomes dos entrevistadores em texto livre (campo do formulário)
--   stage: etapa do Kanban que disparou o agendamento (ex: 'hr_interview', 'technical')

ALTER TABLE public.interviews
  ADD COLUMN IF NOT EXISTS interviewer_names TEXT,
  ADD COLUMN IF NOT EXISTS stage TEXT;
