# Tasks: Reorganização da Arquitetura do Projeto

> Executar em ordem. Cada fase deve ter o `npm run build` verde antes de avançar.

---

## Fase 1 — Fundação (Aliases + Tipos)

- [x] **[1.1] tsconfig.json**: Adicionar path aliases `@/*`, `@/components/*`, `@/hooks/*`, `@/services/*`, `@/lib/*`, `@/types`, `@/context/*` apontando para `src/`.
- [x] **[1.2] Criar `src/types/index.ts`**: Consolidar todos os tipos de `project/types.ts` neste arquivo.
- [x] **[1.3] Atualizar `openspec/project.md`**: Refletir stack real (Next.js 15, SQLite, Prisma, Tailwind CSS 4, React 19).
- [x] **[1.4] Criar `scripts/README.md`**: Documentar propósito de cada `fix-*.cjs` na raiz.

---

## Fase 2 — Unificação de Lib e Services

- [x] **[2.1] ~~Criar `src/lib/prisma.ts`~~**: N/A — projeto usa Supabase, não Prisma. Criado `src/lib/supabase.ts` em vez.
- [x] **[2.2] Unificar `lib/` e `src/lib/`**: Criado `src/lib/utils.ts`, `src/lib/supabase.ts`, `src/lib/storage.ts` como fontes canônicas.
- [x] **[2.3] Mover services para `src/services/`**: Criado `job.service.ts`, `candidate.service.ts`, `audit.service.ts`, `user.service.ts`, `role.service.ts` com imports `@src/*`.
- [x] **[2.4] Mover utils para `src/lib/`**: `formatters.ts` → `src/lib/formatters.ts`.
- [x] **[2.5] Atualizar imports dos services**: Novos services em `src/services/` já usam `@src/*`. Legacy em `project/` intacto.

---

## Fase 3 — Componentes

- [x] **[3.1] Mover `project/components/` → `src/components/`**: Copiado com `robocopy`. Mantidas subpastas `ui/`, `atoms/`, `molecules/`, `organisms/`, `templates/`, `candidate/`.
- [x] **[3.2] Reorganizar `src/components/`**: Criados `admin/` (14 componentes), `public/` (9 componentes), `shared/` (13 componentes cross-domain).
- [x] **[3.3] Mover components avulsos**: Sidebar, Breadcrumbs, BaseModal, ConfirmationModal, Toast, skeletons, selectors → `shared/`.
- [x] **[3.4] Atualizar barrel files**: `src/components/index.ts` com exports organizados por domínio.
- [x] **[3.5] Substituir imports nos pages**: Canônicos prontos. Legacy intacto até Fase 5.

---

## Fase 4 — Hooks e Contexts

- [x] **[4.1] Mover `project/hooks/` → `src/hooks/`**: Copiado 9 hooks. Imports atualizados p/ `@src/*`.
- [x] **[4.2] Mover `project/context/` → `src/context/`**: `AuthContext.tsx`, `QuickViewContext.tsx` copiados. Imports atualizados.
- [x] **[4.3] Remover duplicação hooks/services**: Auditado — hooks consomem services corretamente (hook=estado+efeitos, service=I/O puro). Sem duplicação real.
- [x] **[4.4] Atualizar imports**: Todos os 8 hooks + 2 contexts atualizados de paths relativos para `@src/*`.

---

## Fase 5 — Rotas App Router (Migração)

- [x] **[5.1] Criar `src/app/layout.tsx`**: Root layout com Providers wrapper (Auth, Toast, QuickView) + globals.css.
- [x] **[5.2] Criar route groups**: `(public)/`, `(candidate)/`, `(admin)/` com layouts.
- [x] **[5.3] Criar `src/middleware.ts`**: Scaffold com matcher. Aviso de deprecação: Next.js 16 recomenda `proxy.ts`.
- [x] **[5.4] Migrar rotas públicas**: 10 page.tsx criados em `(public)/`. Router-compat layer criada.
- [x] **[5.5] Migrar rotas candidato**: 4 page.tsx + wizard em `/perfil/completar`.
- [x] **[5.6] Migrar rotas admin**: 13 page.tsx em `(admin)/` + 5 rotas auth standalone.
- [x] **[5.7] Remover catch-all e Pages Router**: `pages/` renomeado → `pages.bak/`. App Router nativo ativo. Todas rotas 200 OK.

---

## Fase 6 — Decomposição de Páginas Monolíticas

- [x] **[6.1] Quebrar `Settings.tsx`**: Extraídas abas de Users, Privileges, Scope, Audit, e System para subcomponentes modulares.
- [x] **[6.2] Extrair `JobForm`**: Criar `src/components/admin/JobForm.tsx` reutilizado por `CreateJob` e `EditJob`.
- [x] **[6.3] Quebrar `CandidateSettings.tsx`**: Extrair seções em componentes independentes com hooks dedicados.
- [x] **[6.4] Quebrar `CandidateProfileDrawer.tsx` (32KB)**: Separar em subcomponentes por seção do perfil.
- [x] **[6.5] Quebrar `JobDetail.tsx` (27KB)**: Extrair sidebar de candidatos, header de vaga, e seção de pipeline.

---

## Fase 7 — Limpeza Final

- [x] **[7.1] Remover `project/` inteiro**: Após confirmação que nenhum import aponta para ele.
- [x] **[7.2] Auditoria de `src/lib/` e `src/utils/`**: Unificar utilitários de formatação e helpers duplicados.
- [x] **[7.3] Validar integridade de `AuthContext.tsx` e `useAuth.ts`**: Garantir que a camada de autenticação está resiliente e segue o padrão canônico.
- [x] **[7.4] Validar design system**: Rodar `npm run validate:design-system` e corrigir regressões.
    - [x] Correção de raios e cores Navy hardcoded.
    - [x] Correção de erros de import e tipagem em Layouts e Sidebar após remoção de `react-router-dom`.
    - [x] Correção de aliases canônicos em `QuickViewDrawer.tsx`.
- [x] **[7.5] Audit de dependências**: Removido `react-router-dom` (migrado para `@src/lib/router-compat`); `@supabase/supabase-js` mantido conforme arquitetura híbrida.
