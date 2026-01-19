# 🔧 GUIA RÁPIDO - Executar Migrations

## ⚡ SOLUÇÃO RÁPIDA

O erro `relation "storage.policies" does not exist` foi corrigido. Use este guia:

---

## 📋 PASSO A PASSO

### 1️⃣ Executar Script Principal

1. Abra: https://supabase.com/dashboard/project/wbvjqxqnvjwfmqxqzqhd/sql
2. Clique em **New Query**
3. Copie e cole o conteúdo de: `migrations/COMPLETE_SETUP.sql`
4. Clique em **RUN** ▶️

**Resultado Esperado:**
```
✅ All migrations and RLS policies have been applied successfully!
```

---

### 2️⃣ Configurar Storage Policies

**Opção A: Via SQL (Tente primeiro)**

1. No mesmo SQL Editor
2. Copie e cole: `migrations/003_storage_policies.sql`
3. Clique em **RUN** ▶️

**Opção B: Via Dashboard (Se SQL falhar)**

1. Vá para: **Storage** → **Policies**
2. Selecione bucket **`resumes`**
3. Clique em **New Policy**

**Criar 2 policies:**

**Policy 1: Upload**
```
Name: resumes_insert_public
Operation: INSERT
Target: public
Definition: bucket_id = 'resumes'
```

**Policy 2: Download**
```
Name: resumes_select_public
Operation: SELECT
Target: public
Definition: bucket_id = 'resumes'
```

---

### 3️⃣ Verificar Tudo Funcionou

Execute esta query:

```sql
-- Verificar roles
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'roles' AND column_name IN ('salary_min', 'salary_max');

-- Verificar jobs
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'jobs' AND column_name = 'role_id';

-- Verificar RLS
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'candidates';

-- Verificar policies
SELECT COUNT(*) as total_policies FROM pg_policies WHERE tablename = 'candidates';
```

**Resultado Esperado:**
| column_name | 
|-------------|
| salary_min  |
| salary_max  |
| role_id     |

| tablename  | rowsecurity |
|------------|-------------|
| candidates | true        |

| total_policies |
|----------------|
| 4              |

✅ **Se você vê isso, está tudo OK!**

---

## 🧪 TESTAR AGORA

### Teste Rápido 1: Salário
1. Vá para: http://localhost:5173/roles
2. Edite qualquer cargo
3. Defina salário: Min `5000`, Max `8000`
4. Salve
5. ✅ Recarregue a página → Valores devem estar salvos

### Teste Rápido 2: Candidatura
1. Vá para: http://localhost:5173/vagas
2. Clique em qualquer vaga
3. Clique em **Candidatar agora**
4. Preencha o formulário
5. Faça upload de um PDF
6. Submeta
7. ✅ Deve redirecionar sem erros

---

## ❌ ERROS COMUNS

### Erro: "column already exists"
✅ **Tudo bem!** Significa que a migration já foi executada antes.

### Erro: "permission denied"
❌ **Problema:** Você não tem permissão de admin.  
✅ **Solução:** Use a conta owner do projeto Supabase.

### Erro: "relation storage.policies does not exist"
✅ **Solução:** Use o arquivo `COMPLETE_SETUP.sql` atualizado (já corrigido).

### Storage policies não funcionam
✅ **Solução:** Configure via Dashboard (Opção B acima).

---

## 📊 CHECKLIST FINAL

Marque conforme completa:

- [ ] Script `COMPLETE_SETUP.sql` executado sem erros
- [ ] Colunas `salary_min` e `salary_max` existem em `roles`
- [ ] Coluna `role_id` existe em `jobs`
- [ ] RLS habilitado em `candidates` (rowsecurity = true)
- [ ] 4 policies criadas em `candidates`
- [ ] 2 storage policies criadas (INSERT e SELECT)
- [ ] Teste de salário passou
- [ ] Teste de candidatura passou

---

## 🎯 RESUMO

**Tempo estimado:** 5-10 minutos  
**Dificuldade:** Fácil  
**Arquivos necessários:**
- `migrations/COMPLETE_SETUP.sql` (principal)
- `migrations/003_storage_policies.sql` (storage)

**Próximo passo após concluir:**
Testar o sistema completo conforme `GUIA-EXECUCAO-COMPLETA.md`

---

**Última atualização:** 06/01/2026 11:47  
**Status:** ✅ Script corrigido e pronto para uso
