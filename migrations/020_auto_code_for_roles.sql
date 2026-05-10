-- Sequence para geração automática de código de cargo
CREATE SEQUENCE IF NOT EXISTS roles_code_seq START 1 INCREMENT 1;

-- Trigger: gera #0001, #0002, etc. automaticamente ao inserir novo cargo
CREATE OR REPLACE FUNCTION generate_role_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := '#' || LPAD(nextval('roles_code_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_role_code
  BEFORE INSERT ON public.roles
  FOR EACH ROW EXECUTE FUNCTION generate_role_code();
