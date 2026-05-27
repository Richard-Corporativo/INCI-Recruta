# Plano: Corrigir RLS Recursion em company_members (root cause do "Salvando..." travado)

## Contexto

O botão "Confirmar Agendamento" trava em "Salvando..." porque `InterviewService.addInterview()` chama `getCurrentCompanyId()`, que tenta consultar a tabela `company_members` — mas essa query trava indefinidamente devido a **recursão infinita no RLS**.

### Causa Raiz: RLS Recursion no PostgreSQL

A política SELECT de `company_members` chama `current_company_id()` e `is_staff_member()`:

```sql
CREATE POLICY "company_members_select" ON public.company_members
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (company_id = public.current_company_id()  -- ← PROBLEMA
        AND public.is_staff_member())              -- ← PROBLEMA
    OR public.is_super_admin()                     -- ← OK (usa JWT)
  );
```

Ambas as funções são `STABLE SECURITY DEFINER` e consultam `company_members`:

```sql
-- current_company_id(): STABLE → PostgreSQL pode "inline" seu corpo no plano de query
-- Quando inlined dentro da RLS de company_members → consulta a própria tabela → recursão
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER ...
AS $$ SELECT company_id FROM public.company_members WHERE user_id = auth.uid() ... $$;
```

**A palavra-chave `STABLE` é o gatilho**: o PostgreSQL tenta otimizar funções STABLE fazendo inline do corpo no plano de query. Quando isso ocorre dentro de uma política RLS da mesma tabela, cria loop infinito. A função `is_super_admin()` já foi corrigida na `20260514_fix_rls_recursion.sql` (trocada por JWT), mas `current_company_id()` e `is_staff_member()` não foram.

**Consequência em cadeia:**
1. `loadCompany()` no AuthContext consulta `company_members` → trava (sem timeout)
2. `primeTenantCache()` nunca é chamado → cache de company_id vazio
3. Modal "Confirmar Agendamento" → `getCurrentCompanyId()` → consulta `company_members` → trava 6s → retorna null → `throw 'Empresa não identificada'`
4. A exceção é capturada mas o estado `isSubmitting` não reseta corretamente por timing de unmount

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---|---|
| `supabase/migrations/20260520_fix_rls_stable_recursion.sql` | **NOVO** — corrige as 2 funções de STABLE → VOLATILE |
| `src/context/AuthContext.tsx` | Adicionar timeout a `loadCompany()` + chamar `primeTenantCache()` no fallback |
| `src/lib/tenant.ts` | Adicionar fallback JWT em `getCurrentCompanyId()` como belt-and-suspenders |

---

## Passos de Implementação

### 1. Migration — Corrigir STABLE → VOLATILE nas funções problemáticas

Criar `supabase/migrations/20260520_fix_rls_stable_recursion.sql`:

```sql
-- Correção: RLS Recursion em company_members
-- Causa: funções STABLE com SECURITY DEFINER que consultam company_members
-- são "inlined" pelo planner dentro da própria política RLS da tabela,
-- causando loop infinito. Fix: mudar para VOLATILE (nunca é inlined).

CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql
VOLATILE                -- era STABLE → VOLATILE quebra o inline pelo planner
SECURITY DEFINER
SET search_path = ''   -- era = public → '' é mais seguro (sem search path hijacking)
AS $$
  SELECT company_id
  FROM public.company_members
  WHERE user_id = (SELECT auth.uid())
    AND status = 'active'
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_staff_member()
RETURNS boolean
LANGUAGE sql
VOLATILE                -- era STABLE → VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE user_id = (SELECT auth.uid())
      AND status = 'active'
      AND role IN ('owner', 'admin', 'manager', 'recruiter', 'quality', 'dp')
  );
$$;
```

**Por que VOLATILE funciona:** O PostgreSQL nunca faz inline de funções VOLATILE no plano de query. Elas são tratadas como caixas-pretas opacas executadas em separado, o que quebra o ciclo de recursão.

---

### 2. AuthContext.tsx — Adicionar timeout em `loadCompany()` + cache no fallback

**Arquivo:** `src/context/AuthContext.tsx`

**Mudança A** — `loadCompany()`: adicionar Promise.race com timeout de 5s (igual ao padrão do projeto), retornar null se timeout:

```typescript
const loadCompany = useCallback(async (userId: string, metadata?: any): Promise<Company | null> => {
    try {
        const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT_LOAD_COMPANY')), 5000)
        );

        let member: any;
        try {
            const result = await Promise.race([
                supabase
                    .from('company_members')
                    .select('company_id, role, status')
                    .eq('user_id', userId)
                    .eq('status', 'active')
                    .maybeSingle(),
                timeout
            ]) as any;
            member = result?.data;
        } catch (e: any) {
            console.warn('[AuthContext] loadCompany timeout:', e.message);
            return null;  // Fallback: sem empresa disponível via DB
        }
        // ... resto do código continua igual
```

**Mudança B** — `fetchProfile()` fallback: após construir `fallbackUser`, verificar se o metadata tem `company_id` e chamar `primeTenantCache()`. Isso garante que serviços subsequentes usem o cache em vez de consultar o banco:

```typescript
// Logo após: console.log('[AuthContext] Fallback construído:', ...)
// Adicionar:
const fallbackCompanyId = metadata?.company_id ?? null;
if (fallbackCompanyId) {
    primeTenantCache(userId, fallbackCompanyId);
}
```

> **Nota:** `primeTenantCache` já é importado em `AuthContext.tsx` (verificar import na linha ~10).

---

### 3. tenant.ts — Fallback JWT em `getCurrentCompanyId()`

**Arquivo:** `src/lib/tenant.ts`

Adicionar fallback via JWT quando a query DB falha/retorna null. Isso garante que o company_id do JWT (populado no signup) seja usado como última defesa:

```typescript
export async function getCurrentCompanyId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { ... }

    // Cache hit — retorno imediato
    if (isBrowser && clientCachedUserId === user.id && clientCachedCompanyId) {
        return clientCachedCompanyId;
    }

    // ... código existente de fetchPromise com timeout ...

    // Após o fetchPromise (no finally ou após o try):
    // Se o DB retornou null, tenta o JWT como fallback de último recurso
    if (!result && user.user_metadata?.company_id) {
        const jwtCompanyId = user.user_metadata.company_id as string;
        if (isBrowser) {
            clientCachedUserId = user.id;
            clientCachedCompanyId = jwtCompanyId;
        }
        return jwtCompanyId;
    }
```

> **Obs:** Isso só funciona se o `company_id` foi salvo em `user_metadata` no momento do onboarding (verificar trigger em `20260504_update_user_sync_trigger.sql`).

---

## Ordem de Execução

1. **Aplicar migration no Supabase Dashboard** (SQL Editor) — esse é o fix definitivo
2. **Implementar mudanças no AuthContext.tsx** — fix de timeout + cache fallback
3. **Implementar mudança no tenant.ts** — belt-and-suspenders com JWT fallback

---

## Verificação

1. Aplicar migration → acessar o app → console NÃO deve mais mostrar `TIMEOUT_FETCH` nem `TIMEOUT_LOAD_COMPANY`
2. Abrir Kanban → arrastar candidato para "Entrevista RH" → modal abre
3. Preencher todos os campos → "Confirmar Agendamento" → deve fechar o modal em < 2s
4. Verificar no Supabase Dashboard: tabela `interviews` com novo registro contendo `job_id`, `stage`, `interviewer_names`
5. Verificar `audit_logs`: registro com `category='interview_scheduled'`
6. Logar como candidato → `/candidate/applications/[id]` → card "Próximas Entrevistas" aparece
