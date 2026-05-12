# Design: Telas /candidate → Balha v10 (Scroll Zero + Cards)

## Context
Telas do portal candidato precisam ser refatoradas para Balha Design System v10.0.0. Princípios: Scroll Zero, Cards como unidade atômica, navegação horizontal, tabs, progressive disclosure via accordions, zero shadows/gradients, Rethink Sans.

## Goals
- 100% das telas de ação acessíveis sem scroll vertical
- Cards substituem sections como unidade de layout
- Tokens Balha v10 em todo código (bg-background/bg-card/border, etc.)
- font-weight max 600, Rethink Sans, tabular-nums em dados numéricos
- CTA sticky global por viewport

## Decisions

### 1. Dashboard — Grid de Cards + Chunk de Conversão
- **Antes**: single column max-w-3xl, chunks empilhados
- **Depois**:
  - Header sticky: "Portal do Talento" + "Completar Perfil" CTA (ghost/secondary)
  - **Grid 2-col** de cards:
    - Card Identidade: avatar + nome + role + localização + contato
    - Card Métricas: % completeness + badge status
    - Card Resumo: "Sobre mim" (accordion toggle dentro do card)
    - Card Links: LinkedIn/GitHub/Portfolio + currículo download
  - **Horizontal scroll** (overflow-x-auto, scroll-snap): cards de ação rápida ("Minhas Candidaturas", "Ver Vagas", "Editar Perfil")
  - **CTA sticky**: botão "Nova Candidatura" fixed bottom-8 right-8
- **Tokens**: bg-background page, bg-card cards, border-border separators

### 2. My Applications — Grid de Metric Cards + Card List
- **Antes**: single column, stats bar + card list vertical
- **Depois**:
  - **Horizontal strip** de metric-cards: Total | Ativos | Encerrados (contador grande, label small)
  - **Grid 2-3 col** de cards de candidatura: título, empresa, stage badge com pulse, data
  - Card interativo: `card-interactive` com hover → bg-muted
  - Empty state: card único com dashed border + CTA "Explorar Vagas"
- **scroll-snap**: `scroll-snap-type: x mandatory` nas métricas

### 3. Application Detail — Timeline em Cards Horizontais
- **Antes**: timeline vertical única + action buttons
- **Depois**:
  - Back link breadcrumb
  - **Card job header**: status badge + title + meta (local/model/data)
  - **Horizontal scroll de stage cards**: cada stage vira um card (320px min-width). Stage atual com ping animation. Stage completed com check icon. Stage rejected com erro.
  - **Accordion de ações**: "FAQ" + "Desistir" dentro de accordion no rodapé do card principal
  - Modal de confirmação mantido (wrapper com overlay)
- **scroll-snap** habilitado nos stage cards

### 4. Settings — Tabs Mantidas, ProfileSection em Grid de Cards
- **Antes**: 4 tabs, ProfileSection com 6 accordions dentro de 1 card
- **Depois**:
  - **Tab bar** mantida (Perfil | Notificações | Segurança | Dados)
  - Tab "Perfil" → **grid 2-col de cards** (6 cards, um por seção):
    1. Card Dados Pessoais (nome, role, phone, location, salary)
    2. Card Resumo Profissional (textarea)
    3. Card Formação (EducationListEditor compacto)
    4. Card Experiência (ExperienceListEditor compacto)
    5. Card Habilidades (SkillsSelector + LanguagesSelector)
    6. Card Links (LinkedIn/GitHub/Portfolio + resume upload)
  - Cada card tem seu próprio CTA "Salvar" (independente) ou "Salvar Tudo" no footer global
  - **Scroll zero**: grid 2-col cabe no viewport (≤6 cards em 3 linhas)
  - Demais tabs: cada uma em card único (já são compactas)

### 5. CandidateLayout — Sidebar Colapsada + Header Sticky
- **Antes**: layout simples, sidebar não-colapsada
- **Depois**:
  - **Sidebar**: w-16 icon-only default, w-64 expanded. Active pill em bg-primary.
  - **Header**: sticky top, bg-background, 64px height, border-b border-border
  - **Content**: padding-section gap, bg-background, grid de cards
  - **Breadcrumbs** em fluxos >2 níveis

### 6. Wizard — Stepper Mantido, Estilização Balha
- **Antes**: tokens legados, shadow, gradiente no header
- **Depois**:
  - bg-background page, bg-card stepper card
  - Progress bar com bg-muted track + bg-primary fill
  - Buttons: button-primary (bg-primary) e button-secondary (ghost)
  - Header dark bar → bg-foreground com text-primary-foreground
  - Zero shadow/gradient

### 7. Remoção de Anti-Patterns Balha (global)
- `shadow-*` → remover (usar bg-card vs bg-background p/ elevação)
- `font-bold` (700+) → `font-semibold` (600)
- `bg-white` ou `#ffffff` → `bg-background` (#F9FAFB)
- hardcoded colors → tokens CSS

## Non-Goals
- Não alterar comportamento de formulários/lógica de save
- Não alterar rotas ou estrutura de URLs
- Não migrar CSS modules para Tailwind (manter o que está)
- Não refatorar serviços/hooks (só UI)

## Risks / Trade-offs
- **Grid 2-col em Settings**: pode ficar apertado em 1024px. Fallback: 1-col em <1024px via Tailwind grid-cols-1 lg:grid-cols-2.
- **Cards independentes com Save próprio**: aumenta chamadas de API. Trade-off aceito por Scroll Zero.
- **Scroll horizontal**: requer indicador visual (next card parcialmente visível) + CSS scroll-snap. Testar em mobile.

## Open Questions
- "Salvar Tudo" no Settings precisa debounce para evitar múltiplas chamadas simultâneas? Decisão: cada card salva independente. "Salvar Tudo" opcional.
- Avatar upload: manter dentro do card Dados Pessoais ou em card separado? Decisão: dentro do card Dados Pessoais para coesão visual.
