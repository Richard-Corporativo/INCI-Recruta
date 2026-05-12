# Project Context

## Purpose
Sistema interno de recrutamento (ATS) para gestores e RH. Gerencia vagas, pipeline de candidatos (Kanban) e auditoria de entrevistas.

## Tech Stack
- **Framework**: Next.js 15 (App Router — em migração de `pages/` para `src/app/`)
- **Runtime**: React 19
- **Language**: TypeScript 5.8 (strict: false)
- **Styling**: Tailwind CSS 4 (tokens semânticos via CSS custom properties)
- **Database**: SQLite (via Prisma ORM)
- **Auth**: Sessão gerenciada por Next.js API routes + cookies
- **Icons**: Material Symbols via `@iconify/react`

## Estrutura de Diretórios (canônica — ver `ARCHITECTURE.md`)
```
src/
  types/          ← fonte única de tipagem (index.ts)
  lib/            ← utilitários, prisma client, helpers
  services/       ← I/O puro (Prisma, API calls) — sem estado
  hooks/          ← estado + efeitos — consome services
  components/     ← UI pura — consome hooks ou props
  context/        ← providers globais (auth, quickview)
  app/            ← Next.js App Router (rotas nativas)
project/          ← LEGACY — em processo de migração para src/
```

## Project Conventions

### Code Style
- Componentes standalone com OnPush via React (sem NgModule).
- Hooks de domínio (`useJobs`, `useCandidates`) isolam lógica assíncrona dos componentes.
- Services são puramente I/O — sem JSX, sem estado React.
- Path alias canônico: `@src/*` → `./src/*` (legacy: `@/*` → `./project/*`).

### Design System — Balha v9.1.0
- **Mood**: Flat, data-dense, corporate SaaS.
- **Typeface**: Rethink Sans (tabular-nums para todos os dados).
- **Icons**: Material Symbols via Iconify.
- **Densidade**: High density, bento grid compacto.
- **Subtração Radical**: Zero shadows, zero gradients, zero backdrop-blur.
- **Tokens**: Exclusivamente CSS tokens (`bg-background`, `bg-card`, `bg-primary`, `bg-sidebar`).
- **Radius**: Cards (`rounded-2xl`), Dropdowns/Buttons (`rounded-xl`), Inputs (`rounded-lg`).
- **Proibido**: Valores HEX/RGB/HSL hardcoded, estilos inline, classes Tailwind não-tokenizadas.
- **Animações**: `duration-200 ease-in-out` obrigatório em todas as transições.

## Layer Contract (regras hard)
```
App (route) → Components → Hooks → Services → Prisma/API
                              ↓
                          Context (auth, ui state)
                              ↓
                          Lib (utils, prisma, storage)
```
- `services/` não importa de `components/` nem de `hooks/`.
- `hooks/` não importa de `components/`.
- `components/` não chama Prisma diretamente.
- Server Components (`page.tsx`) podem chamar `services/` diretamente via `async`.

## Important Constraints
- Performance: fetch assíncrono com loading states obrigatório.
- Security: validação no server-side (API routes / Server Actions).
- Sem `any` sem justificativa documentada em comentário.
