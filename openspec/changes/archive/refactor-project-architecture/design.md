# Design: Reorganização da Arquitetura do Projeto

## 1. Estrutura de Diretórios Canônica

A estrutura alvo elimina a camada `project/` e consolida tudo em `src/` seguindo as convenções do Next.js App Router.

```
INCIRecruta/
├── src/
│   ├── app/                        # Next.js App Router (rotas nativas)
│   │   ├── layout.tsx              # Root layout (providers globais)
│   │   ├── page.tsx                # Root redirect (RoleRedirect)
│   │   ├── (public)/               # Route group: portal candidato
│   │   │   ├── vagas/page.tsx
│   │   │   ├── vagas/[id]/page.tsx
│   │   │   ├── vagas/[id]/candidatar/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── cadastro/page.tsx
│   │   │   └── ...
│   │   ├── (candidate)/            # Route group: área logada candidato
│   │   │   ├── layout.tsx          # CandidateLayout + guard
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── applications/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── (admin)/                # Route group: área admin
│   │       ├── layout.tsx          # AdminLayout + guard
│   │       ├── dashboard/page.tsx
│   │       ├── jobs/page.tsx
│   │       ├── jobs/[id]/page.tsx
│   │       └── ...
│   ├── components/
│   │   ├── ui/                     # Átomos: Button, Input, Badge, Toast
│   │   ├── shared/                 # Moléculas cross-domain: Sidebar, Breadcrumbs
│   │   ├── admin/                  # Organismos admin: Kanban, QuickViewDrawer
│   │   ├── candidate/              # Organismos candidato
│   │   └── public/                 # Seções do portal público: HeroSection, etc.
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useJobs.ts
│   │   ├── useCandidates.ts
│   │   └── ...                     # 1 hook por domínio, consome services
│   ├── services/
│   │   ├── job.service.ts          # JobService — Prisma I/O
│   │   ├── candidate.service.ts    # CandidateService — Prisma I/O
│   │   ├── user.service.ts
│   │   ├── audit.service.ts
│   │   └── role.service.ts
│   ├── context/
│   │   ├── AuthContext.tsx         # Único context de auth
│   │   └── QuickViewContext.tsx
│   ├── lib/
│   │   ├── prisma.ts               # Singleton Prisma client
│   │   ├── utils.ts                # cn(), formatters
│   │   └── storage.ts              # localStorage helpers
│   ├── types/
│   │   └── index.ts                # Fonte única: User, Job, Candidate, etc.
│   └── styles/
│       └── globals.css             # Tokens Balha DS, base CSS
├── scripts/                        # Scripts utilitários documentados
│   ├── validate-design-system.cjs
│   └── README.md                   # Documenta cada script
├── openspec/                       # Specs e decisões de arquitetura
├── docs/                           # Documentação técnica
├── prisma/                         # Schema + migrations SQLite
├── public/                         # Assets estáticos
└── pages/                          # REMOVIDO — migrado para src/app/
```

## 2. Regras de Camadas (Layer Contract)

```
App (route) → Components → Hooks → Services → Prisma/API
                              ↓
                          Context (auth, ui state)
                              ↓
                          Lib (utils, prisma, storage)
```

**Regras hard:**
- `services/` não importa de `components/` nem de `hooks/`
- `hooks/` não importa de `components/`
- `components/` não chama Prisma diretamente
- Server Components (`page.tsx` em `app/`) podem chamar `services/` diretamente via `async`
- Client Components (`"use client"`) consomem `hooks/`

## 3. Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types": ["./src/types/index.ts"],
      "@/context/*": ["./src/context/*"]
    }
  }
}
```

## 4. Decomposição das Páginas Monolíticas

### Settings.tsx (77KB → ~5KB por módulo)
```
src/app/(admin)/settings/
├── page.tsx                    # Composição das abas
├── _components/
│   ├── UsersTab.tsx
│   ├── RolesTab.tsx
│   ├── AuditTab.tsx
│   ├── SystemTab.tsx
│   └── SLATab.tsx
└── _hooks/
    └── useSettingsData.ts
```

### CreateJob / EditJob (37KB + 19KB → compartilhados)
```
src/components/admin/
├── JobForm.tsx                 # Form reutilizável com controlled state
├── JobForm.schema.ts           # Validação Zod
└── sections/
    ├── BasicInfoSection.tsx
    ├── RequirementsSection.tsx
    └── BenefitsSection.tsx
```

## 5. Roteamento: React Router → Next.js App Router

O `App.tsx` com `BrowserRouter` será substituído pelos Route Groups nativos do Next.js. Guards de auth virarão middleware Next.js ou layouts com redirect server-side.

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  if (pathname.startsWith('/candidate') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/candidate/:path*']
}
```

## 6. Estratégia de Migração Faseada

Para minimizar risco de regressão, a migração ocorre em fases sem big-bang rewrite:

| Fase | Foco | Validação |
|------|------|-----------|
| 1 | `tsconfig` aliases + mover `types/` | Build verde, sem mudança visual |
| 2 | Unificar `lib/` + `services/` | Hooks continuam funcionando |
| 3 | Mover `components/` para `src/` | Visual idêntico, só paths mudam |
| 4 | Mover `hooks/` para `src/` | Comportamento funcional preservado |
| 5 | Migrar rotas para App Router | Feature flag: `NEXT_PUBLIC_USE_APP_ROUTER` |
| 6 | Quebrar páginas monolíticas | Por página, uma por sprint |
| 7 | Limpar `project/`, `pages/`, scripts raiz | Após tudo estável |
