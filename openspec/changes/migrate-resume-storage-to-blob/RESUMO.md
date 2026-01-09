# 📊 RESUMO EXECUTIVO: Migração de Storage para BLOB

## Change ID: `migrate-resume-storage-to-blob`

---

## ✅ Status da Proposta

**Validação OpenSpec**: ✅ APROVADA (--strict)  
**Documentos Criados**: 4/4  
**Pronto para Implementação**: ✅ SIM

---

## 🎯 Objetivo

Eliminar a dependência de **Supabase Storage** (buckets externos) e armazenar currículos PDF diretamente no **PostgreSQL** usando o tipo de dado `bytea` (Binary Data).

---

## 🏗️ Arquitetura Proposta

### Antes (Storage-Based)
```
Frontend → CandidateService → Supabase Storage Bucket
                ↓
         candidates.resume_url (URL externa)
```

### Depois (BLOB-Based)
```
Frontend → CandidateService → PostgreSQL
                ↓
         candidates.has_resume (flag)
                ↓
         candidate_resumes.file_data (BLOB)
```

### 🔑 Decisão Arquitetural Crítica: **Tabela Satélite**

**Por que NÃO colocar o BLOB na tabela `candidates`?**

❌ **Problema**: Queries de listagem (Kanban) carregariam PDFs pesados desnecessariamente  
✅ **Solução**: Tabela separada `candidate_resumes` com relacionamento 1:1

**Resultado**:
- Kanban continua rápido (< 500ms para 100 candidatos)
- BLOB só é carregado quando usuário clica "Ver Currículo"

---

## 📋 Mudanças Principais

### 1. Banco de Dados

#### Nova Tabela: `candidate_resumes`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | PK |
| `candidate_id` | UUID | FK → candidates.id (UNIQUE) |
| `file_data` | **BYTEA** | 🔥 O BLOB (binário do PDF) |
| `file_name` | TEXT | Nome original |
| `mime_type` | TEXT | `application/pdf` |
| `file_size` | INTEGER | Tamanho em bytes |
| `created_at` | TIMESTAMPTZ | Data de upload |

#### Tabela Modificada: `candidates`
- ❌ **REMOVER**: `resume_url` (não será mais usada)
- ✅ **ADICIONAR**: `has_resume` (boolean, para UI saber se mostra ícone)

#### Trigger Automático
```sql
-- Mantém has_resume sincronizado automaticamente
CREATE TRIGGER update_has_resume
AFTER INSERT OR DELETE ON candidate_resumes
FOR EACH ROW EXECUTE update_candidate_has_resume();
```

### 2. Serviço (CandidateService)

#### Métodos Atualizados

| Método | Antes | Depois |
|--------|-------|--------|
| `uploadResume()` | Retorna URL (string) | Retorna boolean |
| `addCandidate()` | Recebe URL | Recebe File opcional |

#### Novos Métodos

```typescript
downloadResume(candidateId): Promise<{ blob: Blob, fileName: string }>
hasResume(candidateId): Promise<boolean>
deleteResume(candidateId): Promise<boolean>
```

### 3. Frontend

#### Upload (Antes)
```typescript
const url = await CandidateService.uploadResume(file, email);
await addCandidate({ ...data, resume_url: url });
```

#### Upload (Depois)
```typescript
await CandidateService.addCandidate(data, file);  // Transação atômica
```

#### Download (Antes)
```tsx
<a href={candidate.resume_url} target="_blank">Download</a>
```

#### Download (Depois)
```tsx
<button onClick={async () => {
  const resume = await CandidateService.downloadResume(candidate.id);
  const url = URL.createObjectURL(resume.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = resume.fileName;
  a.click();
  URL.revokeObjectURL(url);
}}>
  Download Resume
</button>
```

---

## 🚀 Benefícios

| Benefício | Impacto |
|-----------|---------|
| **Single Source of Truth** | Tudo no PostgreSQL, sem dependências externas |
| **Backup Simplificado** | Um único backup do DB inclui tudo |
| **Transações Atômicas** | Candidato + Currículo criados juntos ou rollback |
| **Performance Preservada** | Tabela satélite mantém Kanban rápido |
| **Segurança RLS** | Políticas de acesso aplicadas no banco |

---

## ⚠️ Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Crescimento do DB | Limite de 5MB por PDF + monitoramento |
| Performance degradada | **Tabela satélite** + nunca SELECT file_data em listings |
| Tráfego de rede | Lazy loading (só busca quando necessário) |

---

## 📊 Estimativa de Esforço

| Fase | Tarefas | Tempo |
|------|---------|-------|
| 🗄️ Database Schema | 4 | 2h |
| 🔧 Service Layer | 5 | 4h |
| 🎨 Frontend Updates | 4 | 4h |
| ✅ Testing | 3 | 2h |
| **TOTAL** | **16** | **~12h** |

---

## 📁 Documentos Criados

1. ✅ **proposal.md** - Visão geral e justificativa
2. ✅ **design.md** - Arquitetura detalhada (schema, RLS, fluxos)
3. ✅ **tasks.md** - 16 tarefas com dependências e validação
4. ✅ **specs/blob-storage/spec.md** - 10 requisitos com cenários

---

## 🎯 Critérios de Aceitação

- [ ] Tabela `candidate_resumes` criada com RLS
- [ ] Coluna `resume_url` removida de `candidates`
- [ ] Upload de PDF funciona (max 5MB)
- [ ] Download de PDF funciona
- [ ] Kanban carrega em < 500ms (100 candidatos)
- [ ] Zero referências a `supabase.storage` no código
- [ ] Todos os testes passam

---

## 🔄 Próximos Passos

### Opção A: Aprovação Imediata
```bash
# Se você aprovar esta arquitetura:
openspec apply migrate-resume-storage-to-blob
```

### Opção B: Revisão Necessária
Se você quiser ajustar algo, me avise qual parte:
- [ ] Schema do banco de dados
- [ ] Estratégia de performance (tabela satélite)
- [ ] API do CandidateService
- [ ] Fluxo de upload/download no frontend
- [ ] Limites (5MB, PDF only)

---

## 💬 Perguntas para Você

1. **Você aprova a estratégia de "Tabela Satélite"** para proteger a performance do Kanban?
2. **O limite de 5MB por PDF** é adequado para o seu caso de uso?
3. **Você quer migrar currículos existentes** do Storage para o DB, ou apenas novos uploads?
4. **Quando você quer implementar**: Agora ou depois de revisar?

---

**Proposta criada em**: 2026-01-09  
**Validação OpenSpec**: ✅ PASSOU (--strict)  
**Aguardando**: Sua aprovação para prosseguir com `/openspec-apply`
