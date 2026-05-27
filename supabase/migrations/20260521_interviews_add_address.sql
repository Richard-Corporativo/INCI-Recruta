-- Migração: 20260521_interviews_add_address
-- Objetivo: Adicionar coluna address à tabela interviews.
-- A coluna address armazena o endereço físico da entrevista (distinto de location, que é link de videochamada).

ALTER TABLE public.interviews
  ADD COLUMN IF NOT EXISTS address TEXT;
