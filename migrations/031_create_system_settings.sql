-- Migration 031: Create system_settings table
-- Stores global configuration key-value pairs for the platform

CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist before recreating
DROP POLICY IF EXISTS "system_settings_read_all" ON system_settings;
DROP POLICY IF EXISTS "system_settings_write_admin" ON system_settings;

-- Admins and super_admins can read/write; others can only read
CREATE POLICY "system_settings_read_all"
ON system_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "system_settings_write_admin"
ON system_settings FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
);

-- Seed default manager_permissions
INSERT INTO system_settings (key, value)
VALUES (
    'manager_permissions',
    '{"move_to_finalist": true, "mark_not_selected": true, "return_candidate_stage": false, "close_job": false, "view_salaries": false}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
