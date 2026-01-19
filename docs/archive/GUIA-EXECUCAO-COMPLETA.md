# 🚀 GUIA DE EXECUÇÃO COMPLETA - Phases 1 & 2

## ⚡ AÇÃO IMEDIATA NECESSÁRIA

Este guia te leva através da execução das migrations e configuração de RLS policies no Supabase.

---

## 📋 Pré-requisitos

- [ ] Acesso ao Supabase Dashboard
- [ ] Projeto: `wbvjqxqnvjwfmqxqzqhd`
- [ ] Permissões de administrador

---

## 🔧 PHASE 1: Database Schema Fixes

### Passo 1: Acessar o SQL Editor

1. Vá para: https://supabase.com/dashboard/project/wbvjqxqnvjwfmqxqzqhd/sql
2. Clique em **"New Query"**

### Passo 2: Executar Script Completo

**Opção A: Executar tudo de uma vez (RECOMENDADO)**

1. Abra o arquivo: `migrations/COMPLETE_SETUP.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em **RUN** ▶️
5. Aguarde a execução (pode levar 10-30 segundos)

**Resultado Esperado:**
```
✅ All migrations and RLS policies have been applied successfully!
📋 Next steps:
1. Test role salary management in the admin panel
2. Test job creation and verify role_id is saved
...
```

**Opção B: Executar passo a passo (se preferir controle)**

#### 2.1 Migration 001: Salary Columns

```sql
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS salary_min INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS salary_max INTEGER DEFAULT 0;
```

**Clique em RUN** ▶️

**Resultado Esperado:** `Success. No rows returned`

#### 2.2 Migration 002: Role ID Foreign Key

```sql
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;

UPDATE jobs 
SET role_id = (
    SELECT id FROM roles 
    WHERE roles.title = jobs.title 
    LIMIT 1
)
WHERE role_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_role_id ON jobs(role_id);
```

**Clique em RUN** ▶️

**Resultado Esperado:** `Success. X rows affected` (onde X = número de jobs)

### Passo 3: Verificar Migrations

Execute esta query para verificar:

```sql
-- Verificar estrutura de roles
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'roles' 
AND column_name IN ('salary_min', 'salary_max');

-- Verificar estrutura de jobs
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name = 'role_id';

-- Verificar quantos jobs foram linkados
SELECT 
    COUNT(*) FILTER (WHERE role_id IS NOT NULL) as jobs_com_role,
    COUNT(*) FILTER (WHERE role_id IS NULL) as jobs_sem_role,
    COUNT(*) as total_jobs
FROM jobs;
```

**Resultado Esperado:**
| column_name | data_type | column_default |
|-------------|-----------|----------------|
| salary_min  | integer   | 0              |
| salary_max  | integer   | 0              |

✅ **Checkpoint 1:** Se você vê as colunas acima, Phase 1 está completa!

---

## 🔒 PHASE 2: RLS Policy Configuration

### Passo 4: Configurar Policies da Tabela Candidates

Execute este bloco:

```sql
-- Habilitar RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Limpar policies antigas (se existirem)
DROP POLICY IF EXISTS "candidates_insert_auth" ON candidates;
DROP POLICY IF EXISTS "candidates_insert_anon" ON candidates;
DROP POLICY IF EXISTS "candidates_select_own" ON candidates;
DROP POLICY IF EXISTS "candidates_select_admin" ON candidates;

-- Criar policies novas
CREATE POLICY "candidates_insert_auth"
ON candidates FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "candidates_insert_anon"
ON candidates FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "candidates_select_own"
ON candidates FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "candidates_select_admin"
ON candidates FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'recruiter', 'manager')
    )
);
```

**Clique em RUN** ▶️

**Resultado Esperado:** `Success. No rows returned`

### Passo 5: Configurar Policies do Storage (Resumes)

#### Opção A: Via SQL (Preferido)

```sql
DROP POLICY IF EXISTS "resumes_insert_public" ON storage.objects;
DROP POLICY IF EXISTS "resumes_select_public" ON storage.objects;

CREATE POLICY "resumes_insert_public"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "resumes_select_public"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'resumes');
```

**Clique em RUN** ▶️

#### Opção B: Via Dashboard (Se SQL falhar)

1. Vá para: **Storage** → **Policies**
2. Selecione o bucket **`resumes`**
3. Clique em **New Policy**

**Policy 1: Upload**
- Name: `resumes_insert_public`
- Allowed operation: `INSERT`
- Target roles: `public`
- Policy definition: `bucket_id = 'resumes'`

**Policy 2: Download**
- Name: `resumes_select_public`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition: `bucket_id = 'resumes'`

### Passo 6: Verificar RLS Policies

```sql
-- Verificar RLS habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'candidates';

-- Listar policies de candidates
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'candidates'
ORDER BY policyname;

-- Listar policies de storage
SELECT name, definition
FROM storage.policies 
WHERE bucket_id = 'resumes';
```

**Resultado Esperado:**

**Candidates:**
| policyname | cmd | roles |
|------------|-----|-------|
| candidates_insert_anon | INSERT | {anon} |
| candidates_insert_auth | INSERT | {authenticated} |
| candidates_select_admin | SELECT | {authenticated} |
| candidates_select_own | SELECT | {authenticated} |

**Storage:**
| name | definition |
|------|------------|
| resumes_insert_public | bucket_id = 'resumes' |
| resumes_select_public | bucket_id = 'resumes' |

✅ **Checkpoint 2:** Se você vê as policies acima, Phase 2 está completa!

---

## ✅ VERIFICAÇÃO FINAL

Execute este script para um resumo completo:

```sql
SELECT 
    'Roles com salary' as metrica,
    COUNT(*) FILTER (WHERE salary_min > 0 OR salary_max > 0) as valor
FROM roles
UNION ALL
SELECT 
    'Jobs com role_id',
    COUNT(*) FILTER (WHERE role_id IS NOT NULL)
FROM jobs
UNION ALL
SELECT 
    'Policies em candidates',
    COUNT(*)
FROM pg_policies 
WHERE tablename = 'candidates'
UNION ALL
SELECT 
    'Policies em storage',
    COUNT(*)
FROM storage.policies 
WHERE bucket_id = 'resumes';
```

**Resultado Esperado:**
| metrica | valor |
|---------|-------|
| Roles com salary | 0-X (depende dos dados) |
| Jobs com role_id | X (número de jobs) |
| Policies em candidates | 4 |
| Policies em storage | 2 |

---

## 🧪 TESTES IMEDIATOS

Após executar as migrations e policies, teste:

### Teste 1: Salário em Cargo ✅

1. Acesse: http://localhost:5173/roles
2. Clique em **Editar** em qualquer cargo
3. Role até "Proposta Salarial"
4. Digite: Min: `5000`, Max: `8000`
5. Clique em **Salvar Alterações**
6. **Aguarde** o loading
7. Volte para a lista de cargos
8. Edite o mesmo cargo novamente
9. ✅ **Verificar:** Os valores `5000` e `8000` devem estar salvos

### Teste 2: Criar Vaga com Role ID ✅

1. Acesse: http://localhost:5173/jobs/create
2. Selecione um cargo (o mesmo que você editou)
3. Complete o formulário
4. Clique em **Salvar vaga**
5. Abra o console do navegador (F12)
6. Vá para: **Application** → **Supabase** → **jobs**
7. Encontre a vaga que você criou
8. ✅ **Verificar:** Campo `role_id` deve estar preenchido com um UUID

### Teste 3: Sincronização Cargo → Vaga ✅

1. Edite o cargo novamente
2. Mude o salário para: Min: `6000`, Max: `10000`
3. Salve
4. Vá para **Vagas**
5. Edite a vaga que você criou
6. Olhe a sidebar "Dados Vitais"
7. ✅ **Verificar:** Salário deve mostrar `R$ 6000 - R$ 10000`

### Teste 4: Página Pública ✅

1. Acesse: http://localhost:5173/vagas
2. Clique na vaga que você criou
3. ✅ **Verificar:** Salário `R$ 6.000 - R$ 10.000` aparece no cabeçalho

### Teste 5: Candidatura ✅

1. Na página da vaga, clique em **Candidatar agora**
2. Preencha todos os campos
3. Faça upload de um PDF (qualquer arquivo PDF < 5MB)
4. Clique em **Finalizar candidatura**
5. ✅ **Verificar:** Deve redirecionar para `/candidate/dashboard`
6. ✅ **Verificar:** Sem erros no console

### Teste 6: Verificar no Banco ✅

```sql
-- Ver última candidatura
SELECT 
    id,
    name,
    email,
    job_id,
    resume_url,
    applied_at
FROM candidates
ORDER BY applied_at DESC
LIMIT 1;
```

✅ **Verificar:** Deve aparecer a candidatura que você acabou de fazer

---

## 🐛 Troubleshooting

### Erro: "permission denied for table roles"
**Solução:** Você precisa estar logado como proprietário do projeto

### Erro: "column already exists"
**Solução:** Tudo bem! A migration já foi executada. Pule para o próximo passo.

### Erro: "relation does not exist"
**Solução:** Verifique se está no projeto correto

### Candidatura não funciona
**Debug:**
1. Abra Console (F12) → **Network**
2. Tente se candidatar
3. Procure requisições com status 400/500
4. Copie o erro e me envie

### Upload de currículo falha
**Verificar:**
1. Bucket `resumes` existe?
2. Policies de storage foram criadas?
3. Arquivo é PDF e < 5MB?

---

## 📊 Checklist Final

Marque conforme completa:

**Phase 1: Database Schema**
- [ ] Migration 001 executada (salary columns)
- [ ] Migration 002 executada (role_id foreign key)
- [ ] Colunas verificadas
- [ ] Jobs linkados aos roles
- [ ] Índice criado

**Phase 2: RLS Policies**
- [ ] RLS habilitado em candidates
- [ ] 4 policies criadas em candidates
- [ ] 2 policies criadas em storage
- [ ] Policies verificadas

**Testes**
- [ ] Salário salva em cargo
- [ ] Vaga criada com role_id
- [ ] Sincronização funciona
- [ ] Página pública mostra dados corretos
- [ ] Candidatura funciona
- [ ] Upload de currículo funciona

---

## 🎉 Sucesso!

Se todos os checkboxes acima estão marcados, você completou:
- ✅ Phase 1: Database Schema Fixes
- ✅ Phase 2: RLS Policy Configuration
- ✅ Phase 3: Application Layer Updates (já estava pronto)
- ✅ Phase 4: Testing & Validation

**Próximo:** Phase 5 (Data Normalization) é OPCIONAL e pode ser feito depois.

---

**Última Atualização:** 06/01/2026 11:42  
**Tempo Estimado:** 20-30 minutos  
**Prioridade:** CRÍTICA
