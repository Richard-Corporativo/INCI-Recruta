# 🚨 PROBLEMA: Dados do Candidato Sumiram

## Data: 2026-01-05 23:09

### Sintomas
- Perfil do candidato (nome, telefone, etc.) não aparece mais
- Candidaturas/aplicações sumiram
- Usuário consegue fazer login mas não vê seus dados

### Possíveis Causas

#### 1. Exclusão Acidental via Funcionalidade Nova
A funcionalidade de exclusão de conta foi implementada hoje em `CandidateSettings.tsx`. Se o usuário:
- Clicou em "Excluir perfil"
- Digitou "EXCLUIR" no modal
- Confirmou a exclusão

Então os dados foram **intencionalmente deletados** do banco de dados.

#### 2. Problema com Cascade Delete
Se houver um trigger ou cascade delete mal configurado no Supabase, pode ter deletado dados relacionados.

#### 3. Problema com RLS (Row Level Security)
As políticas de RLS podem estar impedindo o usuário de ver seus próprios dados.

### Verificações Necessárias

#### 1. Verificar se os dados existem no banco
```sql
-- Verificar se há candidatos na tabela
SELECT * FROM candidates;

-- Verificar se há candidaturas
SELECT * FROM candidates WHERE user_id = 'SEU_USER_ID';
```

#### 2. Verificar políticas RLS
```sql
-- Ver políticas da tabela candidates
SELECT * FROM pg_policies WHERE tablename = 'candidates';
```

#### 3. Verificar logs do Supabase
- Ir para o Dashboard do Supabase
- Logs → SQL Editor
- Procurar por operações DELETE recentes

### Soluções

#### Se os dados foram deletados acidentalmente:

**Opção 1: Restaurar do Backup**
1. Ir para Supabase Dashboard
2. Database → Backups
3. Restaurar o backup mais recente (antes da exclusão)

**Opção 2: Recriar o Perfil**
Se não houver backup ou se a exclusão foi intencional:
1. Fazer logout
2. Criar uma nova conta de candidato
3. Preencher os dados novamente

#### Se os dados existem mas não aparecem:

**Problema de RLS ou Permissões**
1. Verificar se as políticas RLS estão corretas
2. Verificar se o `user_id` está correto
3. Verificar se há erros no console do navegador

### Código de Debug

Execute este código no console do navegador para verificar:

```javascript
// Verificar sessão atual
const { data: { session } } = await supabase.auth.getSession();
console.log('User ID:', session?.user?.id);

// Tentar buscar candidato
const { data, error } = await supabase
  .from('candidates')
  .select('*')
  .eq('user_id', session?.user?.id);
  
console.log('Candidate data:', data);
console.log('Error:', error);
```

### Prevenção Futura

1. **Implementar Soft Delete**: Em vez de deletar permanentemente, marcar como `deleted_at`
2. **Adicionar Confirmação Extra**: Requerer email de confirmação para exclusão de conta
3. **Backup Automático**: Configurar backups automáticos antes de operações destrutivas
4. **Audit Log**: Registrar todas as operações de DELETE

### Próximos Passos Imediatos

1. ✅ Verificar se os dados existem no Supabase
2. ✅ Verificar logs de DELETE
3. ✅ Se deletado: Restaurar do backup OU recriar perfil
4. ✅ Se existe mas não aparece: Verificar RLS e permissões
5. ✅ Adicionar proteção extra contra exclusão acidental

---

## Atualização da Funcionalidade de Exclusão

Para evitar que isso aconteça novamente, vamos melhorar a funcionalidade:

### Melhorias Propostas:

1. **Soft Delete** (Recomendado)
   - Adicionar coluna `deleted_at` na tabela `candidates`
   - Marcar como deletado em vez de remover do banco
   - Permitir recuperação dentro de 30 dias

2. **Confirmação por Email**
   - Enviar email de confirmação antes de deletar
   - Usuário precisa clicar no link do email

3. **Período de Graça**
   - Marcar conta para exclusão
   - Deletar apenas após 7 dias
   - Permitir cancelamento durante esse período

4. **Backup Antes de Deletar**
   - Criar snapshot dos dados do usuário
   - Armazenar em tabela de backup
   - Permitir restauração por admin
