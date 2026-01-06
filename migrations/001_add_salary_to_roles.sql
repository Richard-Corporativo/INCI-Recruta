-- ============================================
-- MIGRATION: Add Salary Fields to Roles Table
-- Date: 2026-01-06
-- Description: Adds salary_min and salary_max columns to support role-based salary management
-- ============================================

-- Add salary columns to roles table
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS salary_min INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS salary_max INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN roles.salary_min IS 'Minimum monthly salary for this role in BRL';
COMMENT ON COLUMN roles.salary_max IS 'Maximum monthly salary for this role in BRL';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'roles' 
AND column_name IN ('salary_min', 'salary_max');
