# 📘 Runbook de Implementação: INCI Recruta V2

Este guia contém os comandos exatos (SQL) e instruções de código para o desenvolvedor executar a implementação das propostas aprovadas. Siga a ordem.

---

## 1. 🟢 Módulo: Banco de Talentos (`implementar-banco-talentos`)

### Passo 1.1: Banco de Dados (Executar no Supabase SQL Editor)
```sql
-- 1. Permitir que candidatos não tenham vaga (Pool)
ALTER TABLE candidates ALTER COLUMN job_id DROP NOT NULL;

-- 2. Adicionar campos de salário na tabela de Vagas
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min numeric;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max numeric;

-- 3. (OPCIONAL) Migrar dados legados (Copia do Role para o Job)
-- Execute apenas se já tiver vagas criadas que dependem do salário do cargo
UPDATE jobs 
SET 
  salary_min = roles.salary_min,
  salary_max = roles.salary_max
FROM roles 
WHERE jobs.role_id = roles.id;

-- 4. Remover campos de salário da tabela de Cargos (Limpeza)
ALTER TABLE roles DROP COLUMN IF EXISTS salary_min;
ALTER TABLE roles DROP COLUMN IF EXISTS salary_max;
```

### Passo 1.2: Backend (`src/services/CandidateService.ts`)
*   **Ação:** Localize o método `addCandidate`.
*   **Alteração:** Remova a obrigatoriedade do `jobId`.
```typescript
// Antes:
// async addCandidate(candidate: Omit<Candidate, 'id'>) { ... }

// Depois (Permitir partial):
async addCandidate(candidate: Partial<Candidate>) {
  // Se job_id for null, o Supabase aceita pois removemos a restrição
  // ... resto do código
}
```

### Passo 1.3: Frontend (Nova Rota)
*   **Ação:** Criar arquivo `src/pages/public/TalentPool.tsx`.
*   **Código Base:** Copiar `ApplyForm.tsx` mas remover o `useEffect` que carrega dados da vaga e fixar o título como "Banco de Talentos".
*   **Router:** No `App.tsx`, adicionar rota: `<Route path="/talentos" element={<TalentPool />} />`.

---

## 2. 🟢 Módulo: Gestão de Cargos (`reformular-gestao-cargos`)

### Passo 2.1: Banco de Dados
```sql
-- 1. Criar tipo ENUM para senioridade
CREATE TYPE seniority_level AS ENUM ('junior', 'pleno', 'senior');

-- 2. Adicionar novas colunas em Roles
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS mission text,
ADD COLUMN IF NOT EXISTS responsibilities text, -- ou jsonb se preferir estruturado
ADD COLUMN IF NOT EXISTS requirements_technical jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS requirements_behavioral jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS kpis text,
ADD COLUMN IF NOT EXISTS level seniority_level DEFAULT 'pleno';

-- 3. (Segurança) Bloquear Managers de editar Roles
-- Remover policy antiga se existir e recriar:
DROP POLICY IF EXISTS "Enable all access for managers" ON roles;
CREATE POLICY "Managers can only view roles" ON roles FOR SELECT TO authenticated USING (
  auth.jwt() ->> 'role' IN ('manager', 'admin', 'recruiter')
);
CREATE POLICY "Only admins manage roles" ON roles FOR ALL TO authenticated USING (
  auth.jwt() ->> 'role' IN ('admin', 'quality')
);
```

### Passo 2.2: Frontend (`src/pages/CreateRole.tsx`)
*   **Ação:** Adicionar inputs para os novos campos.
*   **Dica:** Use componentes `TextArea` para Missão/KPIs e um componente de lista dinâmica (add/remove item) para `requirements`.

---

## 3. 🟡 Módulo: Workflow de Vagas (`implementar-workflow-vagas`)

### Passo 3.1: Banco de Dados
```sql
-- 1. Status do Workflow
CREATE TYPE job_workflow_status AS ENUM ('draft', 'pending_approval', 'published', 'archived');

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS workflow_status job_workflow_status DEFAULT 'draft';

-- 2. Auditoria Granular
ALTER TABLE audit_logs
ADD COLUMN IF NOT EXISTS old_value jsonb,
ADD COLUMN IF NOT EXISTS new_value jsonb;
```

### Passo 3.2: Backend (`src/services/JobService.ts`)
*   **Ação:** Adicionar método para transição de estado.
```typescript
async updateJobStatus(id: string, status: 'draft' | 'pending_approval' | 'published', userRole: string) {
  if (status === 'published' && !['admin', 'quality'].includes(userRole)) {
    throw new Error('Unauthorized: Only Admin/Quality can publish jobs');
  }
  return supabase.from('jobs').update({ workflow_status: status }).eq('id', id);
}
```

---

## 4. 🟡 Módulo: Busca Inteligente (`criar-motor-busca-candidatos`)

### Passo 4.1: Banco de Dados (Indexação)
```sql
-- Índice GIN para buscar dentro do JSON de skills (Array de strings)
CREATE INDEX idx_candidates_skills ON candidates USING gin (skills);
```

### Passo 4.2: Backend (Supabase RPC - Opcional mas recomendado)
*   **Arquivo:** SQL Editor
```sql
CREATE OR REPLACE FUNCTION search_candidates(
  p_skills text[], 
  p_role_level seniority_level
) 
RETURNS SETOF candidates AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM candidates
  WHERE 
    (p_skills IS NULL OR skills ?& p_skills) -- ?& garante que tenha TODAS as skills
    AND (p_role_level IS NULL OR role_level = p_role_level); -- Assumindo que migramos role_level para candidate ou fazemos join
END;
$$ LANGUAGE plpgsql;
```

---

## 5. 🔴 Módulo: SLA e Forecast (`implementar-sla-forecast`)

### Passo 5.1: Banco de Dados
```sql
CREATE TABLE candidate_stage_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  stage_id text NOT NULL, -- ID da coluna do Kanban
  entered_at timestamptz DEFAULT now(),
  exited_at timestamptz,
  duration_seconds integer GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (exited_at - entered_at))) STORED
);

CREATE INDEX idx_stage_history_candidate ON candidate_stage_history(candidate_id);
```

### Passo 5.2: Backend (`src/services/CandidateService.ts`)
*   **Ação:** Modificar `updateCandidate` (quando muda coluna).
```typescript
// Pseudo-código
async moveCandidate(candidateId, newColumnId) {
  // 1. Fechar histórico anterior
  await supabase.from('candidate_stage_history')
    .update({ exited_at: new Date().toISOString() })
    .eq('candidate_id', candidateId)
    .is('exited_at', null);
    
  // 2. Criar novo registro
  await supabase.from('candidate_stage_history')
    .insert({ candidate_id: candidateId, stage_id: newColumnId });
    
  // 3. Atualizar candidato
  return await supabase.from('candidates').update({ column_id: newColumnId }).eq('id', candidateId);
}
```

---

## 6. 🔴 Módulo: Analytics (`implementar-analytics-diversidade`)

### Passo 6.1: Banco de Dados
```sql
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS demographics jsonb DEFAULT '{}'::jsonb;

-- Segurança: Bloquear acesso direto a essa coluna para usuários normais
-- (Isso requer criar uma View segura ou usar 'Security Definer' functions para analytics)
```

---

## 7. 🔴 Módulo: Central de Comunicação (`implementar-central-comunicacao`)

### Passo 7.1: Banco de Dados
```sql
CREATE TABLE email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE communication_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id uuid REFERENCES candidates(id),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL, -- 'email', 'whatsapp', 'phone'
  content text,
  sent_at timestamptz DEFAULT now()
);
```

### Passo 7.2: Backend (Edge Function ou Service)
*   **Nota:** Configurar integração com **Resend** ou **SendGrid**.
*   Criar função `Validation/SendEmail` que insere na tabela `communication_logs` após sucesso.

---

> **Legenda de Prioridade:**
> 🟢 **Alta** (Core do sistema)
> 🟡 **Média** (Melhoria de processo)
> 🔴 **Baixa/Complexa** (Funcionalidade avançada)
