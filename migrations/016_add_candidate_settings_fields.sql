-- Adicionar colunas faltantes no perfil do candidato (Settings)
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS pretension_min NUMERIC,
ADD COLUMN IF NOT EXISTS pretension_max NUMERIC,
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS search_status TEXT,
ADD COLUMN IF NOT EXISTS desired_work_model TEXT,
ADD COLUMN IF NOT EXISTS competencies TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "whatsapp": true}'::jsonb;

-- Confirmação
DO $$
BEGIN
    RAISE NOTICE '✅ Novas colunas do perfil de candidato adicionadas com sucesso!';
END $$;
