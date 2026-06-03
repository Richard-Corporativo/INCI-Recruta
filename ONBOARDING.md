# Contexto: Fix — Candidato não movido após agendar entrevista no Kanban

## Bug

Ao agendar entrevista pelo `ScheduleInterviewModal` no Kanban (ex: mover para "Entrevista RH"), o agendamento é criado com sucesso em `/admin/agenda`, mas o candidato **não é movido de coluna**. O console mostra:

```
Error updating candidate a6857d2a-...: "Cannot coerce the result to a single JSON object"
```

Stack trace: `candidate.service.ts (588:21) → useCandidates.ts (73:13) → kanban/page.tsx (218:15)`

## Causa raiz

O `.update().select().single()` em `updateCandidate` em `src/services/candidate.service.ts` falha com PGRST116 quando o RETURNING retorna 0 linhas (a sessão auth pode não estar totalmente inicializada quando o UPDATE é feito após o agendamento). `.single()` é frágil — qualquer desvio de exatamente 1 linha retorna erro.

Nota: as colunas `current_stage_entry` e `hired_at` já foram adicionadas via migration `20260602_add_stage_tracking_columns.sql`.

## Fix — único arquivo a modificar

**`src/services/candidate.service.ts`** — em torno da linha 580

### Antes (linhas ~580–590):
```typescript
const { data, error } = await supabase
    .from('candidates')
    .update(dbPayload)
    .eq('id', id)
    .select()
    .single();

if (error) {
    console.error(`Error updating candidate ${id}:`, error?.message ?? error);
    throw error;
}
```

### Depois:
```typescript
const { data: rows, error } = await supabase
    .from('candidates')
    .update(dbPayload)
    .eq('id', id)
    .select();

if (error) {
    console.error(`Error updating candidate ${id}:`, error?.message ?? error);
    throw error;
}

const data = rows?.[0] ?? null;
if (!data) {
    const msg = `Update retornou 0 linhas para candidato ${id} — verifique RLS ou sessão`;
    console.error(msg);
    throw new Error(msg);
}
```

## Verificação

1. Kanban da vaga "Qualidade | Analyst ID #0007" → arrastar candidato para "Entrevista RH"
2. Preencher e confirmar o `ScheduleInterviewModal`
3. Candidato deve aparecer na coluna "Entrevista RH" sem toast de erro
4. Agendamento deve aparecer em `/admin/agenda`
