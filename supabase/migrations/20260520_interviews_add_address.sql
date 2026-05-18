-- Add address column to interviews table
-- Distinguishes physical address from meeting link

ALTER TABLE interviews ADD COLUMN IF NOT EXISTS address TEXT;
COMMENT ON COLUMN interviews.address IS 'Endereço físico da entrevista presencial';
