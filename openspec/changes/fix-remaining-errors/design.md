# Design: Fix Remaining Errors

## Implementação Faltante em CandidateService
O hook `useCandidates.ts` faz uso das seguintes funções de `CandidateService.ts` que não estão implementadas:
1. `addCandidate(candidate)`: Precisa fazer o insert na tabela `candidates`.
2. `searchCandidates(filters)`: Precisa executar uma busca combinando parâmetros (ex: texto, job, status, tags).

### Solução
- Em `CandidateService.ts`, vamos adicionar:
  - `addCandidate`: Faz chamadas via `supabase.from('candidates').insert()`.
  - `searchCandidates`: Cria um query builder simples filtrando resultados na tabela `candidates`.

## Revisão de Componentes Renderizados no Server
Verificar outros arquivos no escopo `admin` (components e hooks) que possam estar com a diretiva `"use client"` ausente, para previnir o Next.js de levantar erros de SSR (Server-Side Rendering).
