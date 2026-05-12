-- Migration 017: Add missing columns to roles table
-- These columns exist in the TypeScript types but were never added via migration,
-- causing INSERT failures and roles not appearing after creation.
ALTER TABLE public.roles
  ADD COLUMN IF NOT EXISTS mission TEXT,
  ADD COLUMN IF NOT EXISTS area TEXT,
  ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS revision_code TEXT DEFAULT '01',
  ADD COLUMN IF NOT EXISTS kpis TEXT,
  ADD COLUMN IF NOT EXISTS competencies TEXT,
  ADD COLUMN IF NOT EXISTS requirements_technical TEXT,
  ADD COLUMN IF NOT EXISTS requirements_behavioral TEXT,
  ADD COLUMN IF NOT EXISTS seniority TEXT;
