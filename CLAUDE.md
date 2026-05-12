# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**INCIRecruta** — Sistema ATS (Applicant Tracking System) full-stack em Next.js 15 com App Router, Supabase e TypeScript. Possui dois portais distintos: admin/recrutadores e candidatos.

## Commands

```bash
npm run dev                    # Servidor de desenvolvimento (localhost:3000)
npm run build                  # Build de produção
npm run start                  # Servidor de produção
npm run validate:design-system # Valida conformidade com Balha Design System
```

**Variáveis de ambiente necessárias (`.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RH_NOTIFICATIONS_EMAIL=
RESEND_API_KEY=          # Opcional: notificações por email
```

## Architecture

### Layered Data Flow

```
Route/Page → Component → Hook → Service → lib/supabase → Supabase DB
```

**Regras de importação por camada** (não violar):

| Camada | Pode importar de | Não pode importar de |
|--------|-----------------|----------------------|
| `services/` | `lib/`, `types/` | `components/`, `hooks/`, `context/` |
| `hooks/` | `services/`, `lib/`, `types/`, `context/` | `components/` |
| `components/` | `hooks/`, `lib/`, `types/`, `context/` | `services/` |
| `context/` | `lib/`, `types/`, `services/` | `components/`, `hooks/` |

Use sempre o alias `@src/*` → `./src/*` para importações internas.

### Key Directories

- `src/app/` — App Router com grupos de rota: `(public)`, `(candidate)`, `(admin)`
- `src/services/` — Camada de negócio: `job`, `candidate`, `user`, `analytics`, `audit`, `recommendation`, `role`, `location`
- `src/hooks/` — Hooks de dados: todos prefixados com `use` (ex: `useJobs`, `useCandidates`)
- `src/context/` — `AuthContext.tsx` (RBAC + sessão) e `QuickViewContext.tsx` (drawers)
- `src/types/index.ts` — Definições TypeScript centralizadas (única fonte de verdade para tipos de domínio)
- `src/lib/` — `supabase.ts`, `storage.ts`, `formatters.ts`, `job-helpers.ts`, `utils.ts`
- `src/constants/` — Enumerações de roles, departamentos, configs de Kanban
- `migrations/` — SQL migrations do Supabase

### RBAC

Quatro papéis gerenciados em `AuthContext.tsx`: `admin`, `recruiter`, `manager`, `candidate`. O middleware em `src/app/middleware.ts` faz os guards server-side. Lógica de redirecionamento por papel em `src/app/page.tsx`.

### State Management

Sem Redux ou Zustand — estado gerenciado via React Context (`AuthContext`, `QuickViewContext`) + hooks locais que chamam services. Dados do Supabase consumidos diretamente nos hooks com `useEffect`.

## Balha Design System v10

Restrições obrigatórias ao escrever componentes:

- **Cores:** usar apenas tokens (`bg-primary`, `text-foreground`) — proibido hex/RGB/HSL hardcoded
- **Tipografia:** fonte Rethink Sans, peso máximo `font-semibold` (600)
- **Bordas:** cards `rounded-2xl`, botões `rounded-xl`, inputs `rounded-lg`
- **Transições:** `duration-200 ease-in-out` obrigatório
- **Proibido:** shadows customizadas, gradientes, blur
- **Ícones:** `@iconify/react` com Material Symbols

## Naming Conventions

- Services: `kebab-case.service.ts`
- Hooks: `useCamelCase.ts`
- Components: `PascalCase.tsx`
- Tipos: centralizados em `src/types/index.ts`

## Important Notes

- `src/pages/` é código legado (Pages Router) — não usar para novas features; todo desenvolvimento novo vai em `src/app/`
- `MEMORY.md` na raiz documenta decisões de arquitetura e bugs conhecidos — consultar antes de mudanças estruturais
- `ARCHITECTURE.md` é a referência definitiva para estrutura e padrões da migração
- Storage do Supabase usa buckets privados com signed URLs (compliance LGPD)
- Audit logs são imutáveis — não deletar/editar registros em `audit_logs`
