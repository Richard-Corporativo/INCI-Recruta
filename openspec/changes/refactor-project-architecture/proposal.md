# Proposal: Reorganização da Arquitetura do Projeto

## Summary

Consolidar e reorganizar a estrutura de diretórios e responsabilidades do INCIRecruta para atingir separação de concerns clara, eliminar duplicidade de código e estabelecer convenções que permitam crescimento sem retrabalho. O projeto está funcional mas acumulou estruturas redundantes (duas `lib/`, dois `pages/`, lógica de serviço misturada com hooks) que tornam manutenção e onboarding custosos.

## Motivation

A estrutura atual apresenta os seguintes problemas críticos de manutenção:

1. **Duplicidade de módulos**: Existe `project/lib/` e `project/src/lib/` com responsabilidades sobrepostas. Idem para `project/pages/` (routing legacy) e `pages/` (Next.js App Router). O roteamento atual roda via React Router embutido no Next.js, contornando o sistema de rotas nativo.

2. **Acoplamento pages ↔ lógica**: Páginas como `Settings.tsx` (77KB), `CreateJob.tsx` (38KB) e `CandidateSettings.tsx` (39KB) combinam UI, lógica de negócio e chamadas de serviço sem divisão de camadas — violando SRP e dificultando testes.

3. **Serviços desconectados de hooks**: `src/services/` e `project/hooks/` não têm contrato explícito. Hooks como `useCandidates.ts` replicam lógica já presente em `CandidateService.ts`.

4. **Scripts de correção avulsos na raiz**: `fix-duplicate-classnames.cjs`, `fix-icon-titles.cjs`, `fix-icons.cjs`, `fix-public-pages.cjs`, `fix-typography.cjs` estão na raiz do projeto — indicam problemas sistêmicos não endereçados na fonte.

5. **Contexts genéricos**: `AuthContext` e `QuickViewContext` vivem em `project/context/` mas há `lib/supabase.ts` e `lib/storage.ts` em paralelo sem hierarquia clara.

6. **`openspec/project.md` desatualizado**: Documenta React 18 + Supabase, mas o projeto real usa Next.js 15 + SQLite/Prisma — confunde qualquer contribuidor novo.

## Scope

### 1. Estrutura de Diretórios
- Estabelecer `src/` como raiz canônica da aplicação Next.js.
- Unificar as duas `lib/` em `src/lib/` com subpastas por domínio.
- Mover todos os componentes, hooks, services e contexts para `src/`.
- Remover `project/` como camada intermediária redundante.

### 2. Separação de Camadas
- **Services** (`src/services/`): Apenas I/O — fetch, Prisma, API calls. Sem estado.
- **Hooks** (`src/hooks/`): Apenas estado + efeitos. Consomem services. Sem JSX.
- **Components** (`src/components/`): Apenas UI. Consomem hooks ou props. Sem serviços diretos.
- **Pages** (`src/app/` via Next.js App Router): Apenas composição de layout + componentes.

### 3. Decomposição de Páginas Monolíticas
- Quebrar `Settings.tsx` (77KB) em subcomponentes por aba.
- Extrair formulários de `CreateJob.tsx` e `EditJob.tsx` em componentes reutilizáveis.
- Separar `CandidateSettings.tsx` em seções independentes com hooks dedicados.

### 4. Limpeza e Padronização
- Mover scripts de fix para `scripts/` e documentar seu propósito ou removê-los.
- Atualizar `openspec/project.md` com stack real (Next.js 15, SQLite, Prisma, Tailwind 4).
- Criar `src/types/` como fonte única de verdade para tipagem.
- Unificar exportação de componentes via barrel files por domínio.

### 5. Documentação de Arquitetura
- Criar `ARCHITECTURE.md` na raiz documentando a estrutura canônica, convenções e regras de camadas.

## Risks & Mitigations

- **Quebra de imports**: Reorganização de diretórios invalida todos os paths de import. *Mitigação*: Usar path aliases (`@/components`, `@/hooks`, `@/services`) via `tsconfig.json` — uma mudança no alias corrige todos os imports.
- **Regressões visuais**: Mover componentes pode romper o design system. *Mitigação*: Executar em fases, uma camada por vez, com `npm run dev` rodando continuamente para feedback imediato.
- **Perda de contexto dos scripts de fix**: Scripts na raiz podem ser necessários. *Mitigação*: Documentar propósito de cada um antes de mover ou remover.
