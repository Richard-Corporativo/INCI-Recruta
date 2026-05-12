# Change: Refatorar Telas do /candidate para Balha Design System v10

## Why
Telas atuais do `/candidate` usam layout legado (single-column scroll com max-w-3xl, seções empilhadas verticalmente). Balha v10 exige **Scroll Zero**, **Cards como unidade atômica**, navegação horizontal e tabs. Settings (`CandidateProfileSection`) tem 6 accordions expansíveis → scroll vertical excessivo, viola regra central do Balha.

## What Changes
- **Dashboard** (`/candidate/dashboard`): perfil read-only → grid de cards (2 colunas) + horizontal scroll para ações rápidas. CTA sticky global.
- **Applications** (`/candidate/applications`): lista vertical → grid de cards + stats em metric-card horizontal. Scroll zero.
- **Application Detail** (`/candidate/applications/[id]`): timeline vertical única → cards horizontais com snap. FAQ/Desistir em accordion dentro do card.
- **Settings** (`/candidate/settings`): tabs mantidas, mas ProfileSection quebrada em cards independentes por accordion (6 cards no grid). Cada card = 1 seção de formulário autocontida. Scroll zero.
- **Layout** (`CandidateLayout.tsx`): sidebar colapsada (64px icon-only) + header sticky + grid de cards no content.
- **Wizard** (`/perfil/completar`): stepper mantido, mas estilizado com tokens Balha v10 (bg-background, bg-card, sem sombras).
- Remover **todo** shadow/gradient/bold>600. Aplicar Rethink Sans consistente.

## Impact
- Affected specs: `candidate-portal` (MODIFIED — requisitos de UI alinhados a Balha v10)
- Affected files: 6 page/component files + 1 layout + 1 hook + 2 service files (CSS token mapping)
- Breaking: layout change on all screens (visual only, no API/behavior change)
