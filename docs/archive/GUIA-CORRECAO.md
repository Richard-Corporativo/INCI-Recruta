# 🚀 GUIA DE CORREÇÃO - PROBLEMAS CRÍTICOS

## ⚡ AÇÃO IMEDIATA - Execute estas migrations no Supabase

### Passo 1: Acesse o Supabase Dashboard
1. Vá para https://supabase.com/dashboard
2. Selecione o projeto: `wbvjqxqnvjwfmqxqzqhd`
3. Clique em **SQL Editor** no menu lateral

### Passo 2: Execute a Migration 001
**Arquivo:** `migrations/001_add_salary_to_roles.sql`

```sql
-- Copie e cole este código no SQL Editor:
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS salary_min INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS salary_max INTEGER DEFAULT 0;

COMMENT ON COLUMN roles.salary_min IS 'Minimum monthly salary for this role in BRL';
COMMENT ON COLUMN roles.salary_max IS 'Maximum monthly salary for this role in BRL';
```

**Clique em RUN** ▶️

**Resultado Esperado:** 
```
Success. No rows returned
```

### Passo 3: Execute a Migration 002 (OPCIONAL - Melhoria Arquitetural)
**Arquivo:** `migrations/002_add_role_id_to_jobs.sql`

```sql
-- Copie e cole este código no SQL Editor:
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;

UPDATE jobs 
SET role_id = (
    SELECT id 
    FROM roles 
    WHERE roles.title = jobs.title 
    LIMIT 1
)
WHERE role_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_role_id ON jobs(role_id);
```

**Clique em RUN** ▶️

---

## ✅ VERIFICAÇÃO PÓS-MIGRATION

### Teste 1: Verificar Colunas em Roles
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'roles' 
AND column_name IN ('salary_min', 'salary_max');
```

**Resultado Esperado:**
| column_name | data_type | column_default |
|-------------|-----------|----------------|
| salary_min  | integer   | 0              |
| salary_max  | integer   | 0              |

### Teste 2: Editar um Cargo com Salário
1. Acesse: http://localhost:5173/roles
2. Clique em **Editar** em qualquer cargo
3. Preencha os campos:
   - **Salário Mínimo:** 5000
   - **Salário Máximo:** 8000
4. Clique em **Salvar Alterações**
5. Volte para a lista e edite novamente
6. ✅ **Verificar:** Os valores devem estar salvos

### Teste 3: Verificar Sincronização Cargo → Vaga
1. Edite um cargo e altere o salário
2. Vá para **Vagas** e encontre uma vaga desse cargo
3. Clique em **Editar Vaga**
4. ✅ **Verificar:** O salário na sidebar deve estar atualizado

### Teste 4: Verificar Página Pública
1. Acesse: http://localhost:5173/vagas
2. Clique em uma vaga
3. ✅ **Verificar:** O salário deve aparecer no cabeçalho

---

## 🔍 INVESTIGAÇÃO - Problema de Candidatura

### Verificar RLS Policies
Execute no SQL Editor:

```sql
-- Ver policies da tabela candidates
SELECT * FROM pg_policies WHERE tablename = 'candidates';

-- Se não houver policies, criar:
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT para usuários autenticados
CREATE POLICY "Candidates can insert their own applications"
ON candidates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permitir INSERT para usuários anônimos (candidatura sem login)
CREATE POLICY "Anonymous users can apply"
ON candidates FOR INSERT
TO anon
WITH CHECK (true);

-- Permitir SELECT para o próprio candidato
CREATE POLICY "Candidates can view their own applications"
ON candidates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### Verificar Storage Policies (para upload de currículo)
```sql
-- Ver policies do bucket 'resumes'
SELECT * FROM storage.policies WHERE bucket_id = 'resumes';

-- Se não houver, criar:
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');
```

---

## 🧪 TESTE COMPLETO DE CANDIDATURA

### Cenário 1: Candidatura Anônima (sem login)
1. Acesse: http://localhost:5173/vagas
2. Clique em uma vaga
3. Clique em **Candidatar agora**
4. Preencha todos os campos obrigatórios
5. Faça upload de um PDF
6. Clique em **Finalizar candidatura**
7. ✅ **Verificar:** Deve redirecionar para `/candidate/dashboard`

### Cenário 2: Candidatura Autenticada
1. Faça login como candidato
2. Repita os passos acima
3. ✅ **Verificar:** Campos devem vir preenchidos
4. ✅ **Verificar:** Não deve permitir candidatura duplicada

### Verificar no Banco
```sql
-- Ver últimas candidaturas
SELECT 
    id,
    name,
    email,
    job_id,
    applied_at,
    resume_url
FROM candidates
ORDER BY applied_at DESC
LIMIT 10;
```

---

## 📊 CHECKLIST DE VALIDAÇÃO FINAL

Após executar as migrations e testes:

- [ ] Migration 001 executada com sucesso
- [ ] Salário salva corretamente em Cargos
- [ ] Salário sincroniza para Vagas
- [ ] Salário aparece na página pública
- [ ] RLS policies configuradas para `candidates`
- [ ] Storage policies configuradas para `resumes`
- [ ] Candidatura anônima funciona
- [ ] Candidatura autenticada funciona
- [ ] Upload de currículo funciona
- [ ] Verificação de duplicatas funciona

---

## 🆘 SE ALGO DER ERRADO

### Erro: "permission denied for table roles"
**Solução:** Você precisa estar logado como proprietário do projeto no Supabase

### Erro: "column already exists"
**Solução:** Tudo bem! A migration já foi executada antes. Pule para os testes.

### Erro: "relation does not exist"
**Solução:** Verifique se você está no projeto correto e se as tabelas existem

### Candidatura ainda não funciona
**Debug:**
1. Abra o Console do navegador (F12)
2. Vá para a aba **Network**
3. Tente se candidatar
4. Procure por requisições com status 400/500
5. Copie o erro e me envie

---

**Última Atualização:** 06/01/2026 11:24  
**Prioridade:** CRÍTICA  
**Tempo Estimado:** 15-30 minutos
