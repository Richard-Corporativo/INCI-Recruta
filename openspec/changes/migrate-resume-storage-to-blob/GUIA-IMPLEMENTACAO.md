# 🚀 Guia Rápido de Implementação - BLOB Storage

## Change ID: `migrate-resume-storage-to-blob`

---

## ⚡ Quick Start (Para Desenvolvedores)

### 1️⃣ Executar Migration no Supabase (5 min)

```bash
# 1. Abra o Supabase SQL Editor
# 2. Cole o conteúdo de: migrations/003_create_candidate_resumes_blob_storage.sql
# 3. Execute a migration
# 4. Verifique com as queries de verificação no final do arquivo
```

**Verificação Rápida**:
```sql
-- Deve retornar a nova tabela
SELECT * FROM candidate_resumes LIMIT 1;

-- Deve mostrar a nova coluna
SELECT has_resume FROM candidates LIMIT 1;
```

---

### 2️⃣ Atualizar TypeScript Types (10 min)

**Arquivo**: `types.ts`

```typescript
// REMOVER esta linha:
// resume_url?: string;

// ADICIONAR estas linhas:
has_resume?: boolean;

// NOVA interface:
export interface CandidateResume {
  id: string;
  candidate_id: string;
  file_data: Uint8Array;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}
```

---

### 3️⃣ Atualizar CandidateService (30 min)

**Arquivo**: `src/services/CandidateService.ts`

#### A. Remover método antigo `uploadResume`

```typescript
// ❌ DELETAR ESTE MÉTODO COMPLETO:
async uploadResume(file: File, candidateEmail: string): Promise<string> {
  // ... código do Storage bucket ...
}
```

#### B. Adicionar novos métodos

```typescript
// ✅ ADICIONAR:

async uploadResume(file: File, candidateId: string): Promise<boolean> {
  // Validação
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Resume must be smaller than 5MB');
  }
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed');
  }

  // Converter File para Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Inserir no banco
  const { error } = await supabase
    .from('candidate_resumes')
    .upsert({
      candidate_id: candidateId,
      file_data: uint8Array,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size
    });

  if (error) {
    console.error('Error uploading resume:', error);
    return false;
  }
  return true;
},

async downloadResume(candidateId: string): Promise<{ blob: Blob; fileName: string } | null> {
  const { data, error } = await supabase
    .from('candidate_resumes')
    .select('file_data, file_name, mime_type')
    .eq('candidate_id', candidateId)
    .single();

  if (error || !data) {
    console.error('Resume not found:', error);
    return null;
  }

  // Converter Uint8Array para Blob
  const blob = new Blob([data.file_data], { type: data.mime_type });
  return { blob, fileName: data.file_name };
},

async hasResume(candidateId: string): Promise<boolean> {
  const { data } = await supabase
    .from('candidates')
    .select('has_resume')
    .eq('id', candidateId)
    .single();
  
  return data?.has_resume || false;
},

async deleteResume(candidateId: string): Promise<boolean> {
  const { error } = await supabase
    .from('candidate_resumes')
    .delete()
    .eq('candidate_id', candidateId);
  
  return !error;
}
```

#### C. Atualizar método `addCandidate`

```typescript
// MODIFICAR assinatura:
async addCandidate(
  candidate: Omit<Candidate, 'id' | 'applied_at'>,
  resumeFile?: File  // ← NOVO parâmetro
): Promise<Candidate | null> {
  
  // ... código existente de insert do candidato ...
  
  // ✅ ADICIONAR após insert do candidato:
  if (resumeFile && data) {
    try {
      await this.uploadResume(resumeFile, data.id);
    } catch (error) {
      console.error('Failed to upload resume:', error);
      // Opcional: rollback do candidato se resume falhar
    }
  }
  
  return mapDbToCandidate(data);
}
```

#### D. Atualizar `mapDbToCandidate`

```typescript
const mapDbToCandidate = (dbCandidate: any): Candidate => ({
  // ... campos existentes ...
  
  // ❌ REMOVER:
  // resume_url: dbCandidate.resume_url,
  
  // ✅ ADICIONAR:
  has_resume: dbCandidate.has_resume || false,
});
```

---

### 4️⃣ Atualizar Frontend - Upload (20 min)

**Arquivo**: `pages/public/JobApplication.tsx`

```typescript
// ❌ ANTES:
const resumeUrl = await CandidateService.uploadResume(formData.resume, formData.email);
await CandidateService.addCandidate({
  ...candidateData,
  resume_url: resumeUrl
});

// ✅ DEPOIS:
await CandidateService.addCandidate(
  candidateData,
  formData.resume  // ← Passa o File diretamente
);
```

**Arquivo**: `pages/candidate/CandidateSettings.tsx`

```typescript
// ❌ ANTES:
const publicUrl = await CandidateService.uploadResume(file, currentCandidate?.email);
await updateProfile({ resume_url: publicUrl, resumeName: file.name });

// ✅ DEPOIS:
const success = await CandidateService.uploadResume(file, currentCandidate?.id);
if (success) {
  await updateProfile({ resumeName: file.name });
}
```

---

### 5️⃣ Atualizar Frontend - Download (20 min)

**Arquivo**: `components/QuickViewDrawer.tsx`

```typescript
// ❌ ANTES:
{candidate.resume_url && (
  <a href={candidate.resume_url} target="_blank">
    <span className="material-symbols-outlined">description</span>
  </a>
)}

// ✅ DEPOIS:
{candidate.has_resume && (
  <button onClick={async () => {
    const resume = await CandidateService.downloadResume(candidate.id);
    if (resume) {
      const url = URL.createObjectURL(resume.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  }}>
    <span className="material-symbols-outlined">description</span>
  </button>
)}
```

**Arquivo**: `components/CandidateProfileDrawer.tsx`

```typescript
// Mesmo padrão acima - substituir <a href> por <button onClick>
```

---

### 6️⃣ Remover Código Deprecated (10 min)

**Buscar e remover**:

```bash
# Procurar por referências ao Storage:
rg "supabase\.storage" --type ts --type tsx

# Procurar por resume_url:
rg "resume_url" --type ts --type tsx

# Remover todas as referências encontradas
```

**Arquivos comuns**:
- `lib/storage.ts` - Adicionar aviso de deprecated
- Qualquer import de `StorageService` relacionado a resumes

---

## ✅ Checklist de Validação

Após implementar, teste:

- [ ] **Upload**: Candidatar-se a vaga com PDF < 5MB → ✅ Sucesso
- [ ] **Upload**: Tentar PDF > 5MB → ❌ Erro "Resume must be smaller than 5MB"
- [ ] **Upload**: Tentar arquivo .docx → ❌ Erro "Only PDF files are allowed"
- [ ] **Download**: Clicar em "Ver Currículo" → PDF baixa corretamente
- [ ] **Kanban**: Carregar 50+ candidatos → Tempo < 500ms
- [ ] **Flag**: Candidato com currículo mostra ícone, sem currículo não mostra
- [ ] **Delete**: Deletar candidato → Currículo deletado automaticamente (CASCADE)
- [ ] **RLS**: Candidato só vê próprio currículo, admin vê todos

---

## 🐛 Troubleshooting

### Erro: "Invalid byte sequence"
**Causa**: Arquivo não é PDF válido  
**Solução**: Validar `file.type === 'application/pdf'` antes de upload

### Erro: "Duplicate key value violates unique constraint"
**Causa**: Candidato já tem currículo  
**Solução**: Usar `upsert()` em vez de `insert()` no método `uploadResume`

### Kanban lento após migração
**Causa**: Query está buscando BLOB data  
**Solução**: Verificar que queries usam apenas `select('id, name, email, has_resume')`

### Download não funciona
**Causa**: Conversão Uint8Array → Blob incorreta  
**Solução**: Verificar que está usando `new Blob([data.file_data], { type: data.mime_type })`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase (SQL Editor → Logs)
2. Verifique RLS policies estão ativas
3. Teste queries manualmente no SQL Editor
4. Consulte `design.md` para detalhes arquiteturais

---

**Tempo Total Estimado**: ~2 horas  
**Complexidade**: Média  
**Impacto**: Alto (mudança arquitetural)
