# Plano de Correções de Segurança — INCIRecruta
**Data:** 2026-06-01 | **Status:** Aprovado, aguardando implementação

Todas as correções foram diagnosticadas e aprovadas. Nenhum código foi alterado ainda.
Este arquivo contém o diff exato para cada correção — copie e aplique.

---

## PRIORIDADE 1 — CRÍTICO

### C1 — CORS `*` nas Edge Functions (30 min)

**Problema:** Ambas as Edge Functions usam `SUPABASE_SERVICE_ROLE_KEY` e têm
`"Access-Control-Allow-Origin": "*"`. Qualquer site pode fazer chamadas CORS com
o token de um usuário autenticado e criar/editar usuários em nome dele.

---

**Arquivo 1:** `supabase/functions/create-user-admin/index.ts`

Substituir as linhas 8–12 + 15–17 por:

```typescript
// ANTES (linha 8):
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: CORS_HEADERS });
    }
```

```typescript
// DEPOIS:
const ALLOWED_ORIGINS = [
    Deno.env.get("SITE_URL"),
    "https://recruta.incibrasil.com.br",
].filter(Boolean) as string[];

function getCorsHeaders(origin: string | null): Record<string, string> {
    const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? "";
    return {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
}

Deno.serve(async (req: Request) => {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        if (origin && !ALLOWED_ORIGINS.includes(origin)) {
            return new Response("Forbidden", { status: 403 });
        }
        return new Response("ok", { headers: corsHeaders });
    }
```

**IMPORTANTE:** Em todas as demais chamadas `new Response(...)` no mesmo arquivo,
substituir `{ ...CORS_HEADERS, ... }` por `{ ...corsHeaders, ... }`.
São 5 ocorrências nas linhas ~24, ~35, ~50, ~63, ~77, ~101, ~116, ~122.

---

**Arquivo 2:** `supabase/functions/update-user-admin/index.ts`

Mesma mudança idêntica. O arquivo tem estrutura igual ao `create-user-admin`.
Substituir o mesmo bloco CORS_HEADERS + OPTIONS handler.
Em seguida substituir todas as ocorrências de `CORS_HEADERS` por `corsHeaders`.

---

### C2 — `getPublicUrl()` → `createSignedUrl()` no CandidateWizard (30 min)

**Problema:** `src/views/candidate/CandidateWizard.tsx` linhas 107–109 usa `getPublicUrl`
para currículos. Se o bucket `resumes` estiver público, a URL nunca expira e qualquer
pessoa com a URL pode baixar o CV de qualquer candidato.

**Arquivo:** `src/views/candidate/CandidateWizard.tsx`

Substituir linhas 107–113:

```typescript
// ANTES:
                const { data: { publicUrl: url } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(filePath);

                publicUrl = url;
                fileNameOriginal = resumeFile.name;
```

```typescript
// DEPOIS:
                const { data: signedData, error: signedError } = await supabase.storage
                    .from('resumes')
                    .createSignedUrl(filePath, 3600);

                if (signedError || !signedData?.signedUrl) {
                    throw new Error('Falha ao gerar URL segura para o currículo.');
                }

                publicUrl = signedData.signedUrl;
                fileNameOriginal = resumeFile.name;
```

**Verificação adicional obrigatória:** No Supabase Dashboard → Storage → Bucket `resumes`
→ confirmar que "Public bucket" está **DESATIVADO**.

---

### C3 — Trigger de imutabilidade em `audit_logs` (20 min)

**Problema:** `audit.service.ts` linha 167 chama `delete_job_audit_logs` RPC.
Não há trigger no banco impedindo DELETE/UPDATE em `audit_logs`.
Audit logs são obrigatórios por LGPD e devem ser imutáveis.

**Criar arquivo:** `supabase/migrations/20260601_audit_logs_immutable_trigger.sql`

```sql
-- Torna audit_logs completamente imutáveis no nível do banco.
-- Nenhuma policy RLS, service_role ou superuser pode deletar/atualizar registros.
-- Incidente 2026-05-28: 26 logs perdidos permanentemente por ausência de proteção.

CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RAISE EXCEPTION
        'audit_logs são imutáveis. DELETE e UPDATE não são permitidos. (operation=%, id=%)',
        TG_OP, COALESCE(OLD.id::text, 'unknown');
END;
$$;

-- Impede DELETE
CREATE TRIGGER audit_logs_no_delete
    BEFORE DELETE ON public.audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- Impede UPDATE
CREATE TRIGGER audit_logs_no_update
    BEFORE UPDATE ON public.audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- Remove a RPC que permitia deleção via service_role
DROP FUNCTION IF EXISTS public.delete_job_audit_logs(uuid);
```

**Após aplicar a migration:** Atualizar `src/services/audit.service.ts` — remover o método
`deleteJobLogs` (linhas 166–170) pois a RPC foi dropada:

```typescript
// REMOVER este método inteiro do AuditService:
  async deleteJobLogs(jobId: string): Promise<number> {
    const { data, error } = await supabase.rpc('delete_job_audit_logs', { p_job_id: jobId });
    if (error) throw error;
    return data as number;
  }
```

Verificar se `deleteJobLogs` é chamado em algum outro lugar:
```bash
grep -r "deleteJobLogs" src/
```

---

## PRIORIDADE 2 — ALTO

### A1 — Validação de extensão de arquivo (20 min)

**Problema:** `src/services/candidate.service.ts` linha ~295 valida apenas `file.type`
(MIME type definido pelo browser, falsificável). Um `.exe` renomeado para `.pdf` passa.

**Arquivo:** `src/services/candidate.service.ts`

Localizar o método `uploadResume` (~linha 291) e substituir:

```typescript
// ANTES:
    async uploadResume(file: File, candidateId: string): Promise<boolean> {
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Tamanho do arquivo excede 5MB');
        }
        if (file.type !== 'application/pdf') {
            throw new Error('Apenas arquivos PDF são permitidos');
        }
```

```typescript
// DEPOIS:
    async uploadResume(file: File, candidateId: string): Promise<boolean> {
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Tamanho do arquivo excede 5MB');
        }
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext !== 'pdf' || file.type !== 'application/pdf') {
            throw new Error('Apenas arquivos PDF são permitidos');
        }
```

Fazer o mesmo para `uploadAvatar` (localizar no mesmo arquivo, ~linha 175):

```typescript
// ANTES:
        if (!file.type.startsWith('image/')) {
            throw new Error('...');
        }
```

```typescript
// DEPOIS:
        const allowedImageExts = ['jpg', 'jpeg', 'png', 'webp'];
        const imgExt = file.name.split('.').pop()?.toLowerCase();
        if (!imgExt || !allowedImageExts.includes(imgExt) || !file.type.startsWith('image/')) {
            throw new Error('Apenas imagens JPG, PNG ou WebP são permitidas');
        }
```

**Fazer o mesmo em `CandidateWizard.tsx`** — a validação de `resumeFile` no `handleFinish`
(linha ~89) não verifica extensão. Adicionar antes do upload:

```typescript
// Adicionar ANTES do bloco "if (resumeFile) {" (~linha 89):
            if (resumeFile) {
                const ext = resumeFile.name.split('.').pop()?.toLowerCase();
                if (ext !== 'pdf' || resumeFile.type !== 'application/pdf') {
                    throw new Error('Apenas arquivos PDF são permitidos para currículo.');
                }
```

---

### A2 — Remover fallback `user_metadata` para roles (30 min)

**Problema:** Se o Supabase DB ficar indisponível por segundos, `middleware.ts` linha 106
usa `user.user_metadata?.role` como fallback. Um atacante que setou seu próprio
`user_metadata.role = 'owner'` via `supabase.auth.updateUser()` poderia escalar
privilégios nessa janela.

**Arquivo 1:** `src/middleware.ts` linha 106

```typescript
// ANTES (linha 106):
        const role = dbUser?.role || user.user_metadata?.role || 'candidate';

// DEPOIS:
        const role = dbUser?.role ?? 'candidate';
```

**Arquivo 2:** `src/context/AuthContext.tsx` — no `fetchProfile`, linhas 158–159 e 175:

```typescript
// ANTES (linha 158–159, dentro do bloco if (profileData)):
                    role: profileData.role || (metadata?.role as User['role']) || 'candidate',

// DEPOIS:
                    role: profileData.role ?? 'candidate',
```

```typescript
// ANTES (linha 175, no fallback de metadata — manter fallback APENAS para candidatos):
                role: (metadata?.role as User['role']) || 'candidate',

// DEPOIS — hardcodar 'candidate' quando banco falha, nunca usar metadata para role:
                role: 'candidate',
```

**Nota:** O fallback de `name` via metadata pode ser mantido (não é role).
Somente o campo `role` deve ser hardcoded como `'candidate'` quando DB falha.
O comentário na linha ~174 deve ser atualizado para refletir isso.

---

### A3 — Guard explícito de `super_admin` nos services cross-tenant (45 min)

**Problema:** As 4 funções cross-tenant em `src/services/super-admin.service.ts`
dependem 100% de RLS. Se uma migration acidental desabilitar RLS nessas tabelas,
qualquer usuário autenticado pode acessar todos os dados de todas as empresas.

**Arquivo:** `src/services/super-admin.service.ts`

Adicionar esta helper function ANTES da linha 202 (onde começa `getAllJobsCrossTenant`):

```typescript
// Helper: segunda linha de defesa se RLS falhar
async function assertSuperAdmin(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
    if (profile?.role !== 'super_admin') {
        throw new Error('Acesso negado: requer super_admin');
    }
}
```

Adicionar `await assertSuperAdmin();` como **primeira linha** dentro de cada uma das
4 funções cross-tenant:
- `getAllJobsCrossTenant` (linha ~204)
- `getAllRolesCrossTenant` (linha ~241)
- `getAllCandidatesCrossTenant` (linha ~273)
- `getAllAuditLogsCrossTenant` (linha ~305)

Exemplo para `getAllJobsCrossTenant`:

```typescript
export async function getAllJobsCrossTenant(
    { page = 1, pageSize = 50 }: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<JobWithCompany>> {
    await assertSuperAdmin();  // ← ADICIONAR ESTA LINHA
    const offset = (page - 1) * pageSize;
    // ...resto igual
```

---

## PRIORIDADE 3 — MÉDIO (pode deixar para depois)

### M1 — Rate limiting nas Edge Functions
**O que fazer:** Não existe solução nativa simples nas Edge Functions do Supabase.
A abordagem mais prática é criar uma tabela `rate_limits` no Supabase e incrementar
um contador por `user_id` + janela de 1 minuto. Baixa prioridade pois as funções
já exigem Bearer token válido.

---

## CHECKLIST DE VERIFICAÇÃO PÓS-IMPLEMENTAÇÃO

```bash
# 1. Build sem erros TypeScript
npm run build

# 2. C1: Verificar CORS
# Testar no browser console com site diferente do permitido:
# fetch('https://[SUPABASE_URL]/functions/v1/create-user-admin', {method:'OPTIONS'})
# Deve retornar 403

# 3. C3: Verificar trigger
# No Supabase SQL Editor:
# DELETE FROM audit_logs WHERE id = (SELECT id FROM audit_logs LIMIT 1);
# → Deve retornar ERRO do trigger

# 4. grep para confirmar que deleteJobLogs foi removido
grep -r "deleteJobLogs" src/

# 5. Verificar bucket resumes é privado
# Dashboard → Storage → resumes → Policy → Public deve estar OFF
```

---

## ESTADO ATUAL DO CÓDIGO (referência)

| Arquivo | Linha chave | Problema |
|---------|------------|---------|
| `supabase/functions/create-user-admin/index.ts` | 9 | `"*"` no CORS |
| `supabase/functions/update-user-admin/index.ts` | 9 | `"*"` no CORS |
| `src/views/candidate/CandidateWizard.tsx` | 107 | `getPublicUrl` para resumes |
| `src/services/audit.service.ts` | 166–170 | `deleteJobLogs` existe |
| `src/services/candidate.service.ts` | ~295 | valida só MIME, não extensão |
| `src/middleware.ts` | 106 | fallback `user_metadata?.role` |
| `src/context/AuthContext.tsx` | 159, 175 | fallback `metadata?.role` |
| `src/services/super-admin.service.ts` | 202–334 | sem guard super_admin |

## MIGRAÇÕES JÁ EXISTENTES (não recriar)
- `20260528_fix_audit_logs_rls_policies.sql` — corrige INSERT policy
- `20260529_audit_logs_rls_cleanup_and_safeguard.sql` — cleanup + safeguard
- `20260528_delete_job_audit_logs.sql` — cria a RPC `delete_job_audit_logs`
  (esta RPC será **REMOVIDA** pela migration C3 acima)
