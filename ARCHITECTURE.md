# Arquitetura — INCIRecruta

> Documento de referência para manutenção e onboarding.

---

## Estrutura de Diretórios

```
INCIRecruta/
├── src/                        ← CANÔNICO (fonte de verdade)
│   ├── app/                    ← Next.js App Router (**ATIVO**)
│   │   ├── layout.tsx          ← Root layout + Providers
│   │   ├── providers.tsx      ← Client wrapper (Auth, Toast, QuickView)
│   │   ├── globals.css        ← CSS + tokens Balha
│   │   ├── page.tsx           ← Root redirect (role-based)
│   │   ├── not-found.tsx      ← 404 global
│   │   ├── (public)/           ← Rotas públicas (vagas, login, cadastro)
│   │   ├── (candidate)/        ← Rotas candidato (dashboard, applications)
│   │   └── (admin)/            ← Rotas admin (dashboard, jobs, kanban, audit)
│   ├── pages/                  ← Componentes de página migrados (35 files)
│   ├── lib/                    ← Utilitários (cn, supabase, storage, formatters, router-compat)
│   ├── constants/              ← Constantes de domínio (departments, benefits)
│   ├── middleware.ts           ← Guards server-side (scaffold)
├── project/                    ← LEGACY — não usar em código novo
├── pages.bak/                  ← Pages Router (desativado)
├── prisma/                     ← Schema (SQLite)
├── scripts/                    ← Utilitários de build (ver scripts/README.md)
├── openspec/                   ← Documentação de changes
└── migrations/                 ← SQL migrations legadas (Supabase)
```

---

## Regras de Camadas

```
App (route/page) → Components → Hooks → Services → Supabase/Prisma
                                  ↓
                              Context (auth, ui state)
                                  ↓
                              Lib (utils, supabase, storage)
```

| Camada | Pode importar de | NÃO pode importar de |
|--------|------------------|---------------------|
| `services/` | `lib/`, `types/` | `components/`, `hooks/`, `context/` |
| `hooks/` | `services/`, `lib/`, `types/`, `context/` | `components/` |
| `components/` | `hooks/`, `lib/`, `types/`, `context/` | `services/` (exceto Server Components) |
| `context/` | `lib/`, `types/`, `services/` | `components/`, `hooks/` |
| `app/` (pages) | tudo | — |

---

## Path Aliases

| Alias | Resolve para | Uso |
|-------|-------------|-----|
| `@src/*` | `./src/*` | **CANÔNICO** — usar em todos os novos arquivos |
| `@/*` | `./project/*` | **LEGACY** — não usar em código novo |

---

## Nomenclatura de Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Service | `kebab.service.ts` | `job.service.ts` |
| Hook | `camelCase.ts` | `useJobs.ts` |
| Component | `PascalCase.tsx` | `CandidateCard.tsx` |
| Context | `PascalCase.tsx` | `AuthContext.tsx` |
| Type | `index.ts` | `src/types/index.ts` |
| Util | `camelCase.ts` | `formatters.ts` |

---

## Design System — Balha v9.1.0

| Propriedade | Regra |
|-------------|-------|
| Fonte | Rethink Sans (`font-sans`) |
| Peso máximo | `font-semibold` (600) |
| Shadows | **Proibido** |
| Gradients | **Proibido** |
| Backdrop-blur | **Proibido** |
| Cores | Somente tokens CSS (`bg-primary`, `text-foreground`, etc.) |
| HEX/RGB/HSL | **Proibido** em classes Tailwind |
| Radius cards | `rounded-2xl` |
| Radius botões | `rounded-xl` |
| Radius inputs | `rounded-lg` |
| Transições | `duration-200 ease-in-out` obrigatório |
| Icons | `@iconify/react` (Material Symbols) |

---

## Status da Migração

| Fase | Status | Observação |
|------|--------|-----------|
| 1 — Fundação | ✅ | aliases, tipos, project.md, scripts docs |
| 2 — Lib/Services | ✅ | 5 services + 4 libs canônicos |
| 3 — Componentes | ✅ | 36 componentes reorganizados em admin/public/shared |
| 4 — Hooks/Contexts | ✅ | 9 hooks + 2 contexts com imports @src/* |
| 5 — App Router | ✅ | 34 page.tsx + root redirect + 404. Router-compat layer. Todas rotas 200 |
| 6 — Decomposição | ⏸ | Depende de sprint dedicado |
| 7 — Limpeza | ⏳ | ARCHITECTURE.md criado. Falta remover project/ e pages.bak/ |
