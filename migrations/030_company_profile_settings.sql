-- Migration 030: Perfil completo da empresa + configurações
-- Adiciona campos de cadastro, localização e configurações à tabela companies

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS website           text,
  ADD COLUMN IF NOT EXISTS linkedin_url      text,
  ADD COLUMN IF NOT EXISTS segment           text,
  ADD COLUMN IF NOT EXISTS headcount         text,
  ADD COLUMN IF NOT EXISTS company_type      text,
  ADD COLUMN IF NOT EXISTS cep               text,
  ADD COLUMN IF NOT EXISTS state_code        text,
  ADD COLUMN IF NOT EXISTS city              text,
  ADD COLUMN IF NOT EXISTS address           text,
  ADD COLUMN IF NOT EXISTS work_model        text DEFAULT 'presencial',
  ADD COLUMN IF NOT EXISTS work_model_custom text,
  ADD COLUMN IF NOT EXISTS internal_roles    jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS talent_pool_settings jsonb DEFAULT '{
    "who_can_access": ["admin", "recruiter"],
    "visible_areas": [],
    "retention_days": 180,
    "allow_reuse": true
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS role_permissions  jsonb DEFAULT '{}'::jsonb;

-- Índice para facilitar lookups por company_id
CREATE INDEX IF NOT EXISTS idx_companies_id ON public.companies(id);
