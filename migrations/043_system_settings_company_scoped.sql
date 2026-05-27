-- Migration 043: system_settings com isolamento por empresa (multi-tenant)
-- Problema: a tabela armazenava manager_permissions de forma global (sem company_id),
-- permitindo que admins de empresas diferentes lessem/sobrescrevessem as mesmas settings.

-- 1. Adicionar coluna company_id
ALTER TABLE system_settings
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- 2. Substituir constraint único por (key, company_id)
ALTER TABLE system_settings
  DROP CONSTRAINT IF EXISTS system_settings_key_key,
  DROP CONSTRAINT IF EXISTS system_settings_pkey;

ALTER TABLE system_settings
  ADD CONSTRAINT system_settings_key_company_unique UNIQUE (key, company_id);

-- 3. Habilitar RLS (se ainda não estiver habilitado)
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 4. Remover policies antigas (se existirem)
DROP POLICY IF EXISTS system_settings_select ON system_settings;
DROP POLICY IF EXISTS system_settings_insert ON system_settings;
DROP POLICY IF EXISTS system_settings_update ON system_settings;
DROP POLICY IF EXISTS system_settings_upsert ON system_settings;
DROP POLICY IF EXISTS system_settings_all ON system_settings;

-- 5. SELECT: apenas settings da própria empresa
CREATE POLICY system_settings_select ON system_settings
  FOR SELECT
  USING (company_id = current_company_id());

-- 6. INSERT/UPDATE: apenas para admin/owner da própria empresa
CREATE POLICY system_settings_write ON system_settings
  FOR ALL
  USING (company_id = current_company_id())
  WITH CHECK (company_id = current_company_id());

-- 7. Índice de performance
CREATE INDEX IF NOT EXISTS idx_system_settings_company_id
  ON system_settings(company_id);
