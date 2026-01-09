# 📦 OpenSpec Change: Migrate Resume Storage to BLOB

## Change ID
`migrate-resume-storage-to-blob`

---

## 📚 Documentação Disponível

### 🎯 Para Decisores / Product Owners
- **[RESUMO.md](./RESUMO.md)** - Resumo executivo com benefícios, riscos e estimativas

### 🏗️ Para Arquitetos / Tech Leads
- **[proposal.md](./proposal.md)** - Proposta completa da mudança
- **[design.md](./design.md)** - Arquitetura detalhada, schema DB, RLS, fluxos

### 👨‍💻 Para Desenvolvedores
- **[GUIA-IMPLEMENTACAO.md](./GUIA-IMPLEMENTACAO.md)** - Guia prático passo-a-passo
- **[tasks.md](./tasks.md)** - 16 tarefas detalhadas com dependências
- **[specs/blob-storage/spec.md](./specs/blob-storage/spec.md)** - Especificação técnica com requisitos

### 🗄️ Para DBAs
- **[../../migrations/003_create_candidate_resumes_blob_storage.sql](../../migrations/003_create_candidate_resumes_blob_storage.sql)** - Script SQL completo

---

## ⚡ Quick Links

| Eu quero... | Leia este arquivo |
|-------------|-------------------|
| Entender o que vai mudar | [RESUMO.md](./RESUMO.md) |
| Ver a arquitetura técnica | [design.md](./design.md) |
| Começar a implementar | [GUIA-IMPLEMENTACAO.md](./GUIA-IMPLEMENTACAO.md) |
| Ver todas as tarefas | [tasks.md](./tasks.md) |
| Executar a migration SQL | [../../migrations/003_create_candidate_resumes_blob_storage.sql](../../migrations/003_create_candidate_resumes_blob_storage.sql) |
| Validar requisitos | [specs/blob-storage/spec.md](./specs/blob-storage/spec.md) |

---

## 🎯 O Que Esta Mudança Faz?

**Antes**: Currículos armazenados em **Supabase Storage** (buckets externos)  
**Depois**: Currículos armazenados como **BLOB no PostgreSQL** (bytea)

### Por Que?
✅ Elimina dependência externa  
✅ Simplifica backup/restore  
✅ Transações atômicas (candidato + currículo)  
✅ Mantém performance do Kanban (tabela satélite)

---

## 📊 Impacto

| Área | Impacto | Detalhes |
|------|---------|----------|
| **Database** | 🔴 Alto | Nova tabela, trigger, RLS policies |
| **Backend** | 🟡 Médio | Atualização do CandidateService |
| **Frontend** | 🟡 Médio | Upload/download de arquivos |
| **Performance** | 🟢 Baixo | Tabela satélite protege Kanban |
| **Usuários** | 🟢 Baixo | Funcionalidade idêntica |

---

## ⏱️ Estimativa

**Tempo Total**: ~12 horas (2 dias)

| Fase | Tempo |
|------|-------|
| Database Schema | 2h |
| Service Layer | 4h |
| Frontend Updates | 4h |
| Testing | 2h |

---

## ✅ Status

- [x] Proposta criada
- [x] Design aprovado
- [x] Tasks definidas
- [x] Specs escritas
- [x] Validação OpenSpec passou
- [ ] **Aguardando aprovação para implementar**

---

## 🚀 Próximos Passos

### Se você é um **Desenvolvedor**:
1. Leia [GUIA-IMPLEMENTACAO.md](./GUIA-IMPLEMENTACAO.md)
2. Execute a migration SQL
3. Siga os passos 2-6 do guia

### Se você é um **Tech Lead**:
1. Revise [design.md](./design.md)
2. Aprove a arquitetura de tabela satélite
3. Autorize a equipe a implementar

### Se você é um **Product Owner**:
1. Leia [RESUMO.md](./RESUMO.md)
2. Avalie benefícios vs. riscos
3. Decida se aprova a mudança

---

## 📞 Perguntas Frequentes

### Por que não usar Supabase Storage?
Storage é ótimo, mas adiciona complexidade (2 sistemas para backup, URLs que podem quebrar, etc.). BLOB centraliza tudo no PostgreSQL.

### Isso vai deixar o Kanban lento?
**Não!** Usamos uma **tabela satélite** separada. O Kanban só carrega metadados leves (`has_resume`), nunca o BLOB pesado.

### E se o banco ficar muito grande?
Limitamos PDFs a 5MB. Com 10.000 candidatos, isso dá ~50GB, que é gerenciável no PostgreSQL moderno.

### Posso migrar currículos existentes?
Sim, mas está **fora do escopo** desta mudança. Seria um script manual separado.

---

## 🔗 Comandos OpenSpec

```bash
# Validar a especificação
openspec validate migrate-resume-storage-to-blob --strict

# Ver detalhes da mudança
openspec show migrate-resume-storage-to-blob

# Aplicar a mudança (quando aprovado)
openspec apply migrate-resume-storage-to-blob
```

---

**Criado em**: 2026-01-09  
**Validação**: ✅ PASSOU (openspec validate --strict)  
**Autor**: OpenSpec Workflow  
**Status**: 📋 Aguardando Aprovação
