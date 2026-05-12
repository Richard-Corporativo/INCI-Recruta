# BALHA DESIGN SYSTEM v10.0.0 — "A Era dos Cards"

**Design System para IA de código. Otimizado para Conversão, Densidade Cognitiva e Navegação por Cards.**

**Versão:** 10.0.0 — Maio 2026 **Skill de Geração de Código, Layouts e Componentes | Cards como Unidade Primária | Foco no Usuário (F/Z-Pattern) | Scroll Zero por Princípio**

---

## Sumário

- **Bloco 0 — Metarregras** (Atualizadas com novo foco)  
- **Bloco 1 — Design System (Tokens)** (Consolidado e Corrigido)  
- **Bloco 2 — Agrupamento Visual (Chunks)** (Reforçado e Focado em Cards)  
- **Bloco 3 — Layout e Scroll Zero** (Totalmente Refatorado com Pesquisa)  
- **Bloco 4 — Componentes** (Foco em Cards, Tabs, Accordions e Ações)  
- **Bloco 5 — Acessibilidade (WCAG 2.1 AA)**  
- **Bloco 6 — Performance**  
- **Bloco 7 — Conversão**  
- **Bloco 8 — Auditoria**  
- **Bloco 9 — Glossário de Decisão**

---

## Bloco 0 — Metarregras

Estas regras governam toda a saída desta skill para garantir que cada pixel sirva ao propósito de conversão com o menor esforço cognitivo possível.

### 0.1 Prioridade de Execução (Nova Ordem)

1. **Design System Balha** → Regra absoluta (Tokens \#031525 e Rethink Sans).  
2. **Acessibilidade WCAG 2.1 AA** → Não negociável. Contraste, foco e semântica.  
3. **Scroll Zero e Navegação por Cards** → O conteúdo deve ser navegado, não scrollado. Cards são a unidade atômica de informação.  
4. **Agrupamento Visual e Carga Cognitiva** → Densidade otimizada para decisão rápida (Lei de Hick).  
5. **Performance** → Meta de carregamento \< 3s.  
6. **Conversão** → O objetivo final de cada componente.

### 0.2 Princípio Guia: Balha Identity (Atualizado)

O Balha é focado em **Subtração Radical com Propósito**:

- **Scroll é Inimigo da Conversão:** Cada pixel abaixo do "Above the Fold" perde 80% da atenção do usuário. Substituímos scroll vertical por **navegação horizontal (Cards, Tabs) e progressive disclosure (Accordions).**  
- **Cards como Molécula Primária:** A unidade de layout não é a `section`, mas o `Card`. Cada Card é uma oportunidade de conversão autocontida, seguindo o **F-Pattern** de leitura (escaneamento horizontal e vertical).  
- **Zero Sombras, Zero Gradientes.**  
- **Hierarquia por Contraste de Fundo e Peso Tipográfico (máx. 600).**  
- **Agnóstico ao Projeto:** Adapte os princípios Balha aos componentes disponíveis (shadcn, radix, etc.). A lógica é do Balha, a implementação é sua.  
- **Mobile First e Horizontal:** Todo layout deve ser funcional em telas pequenas, mas a expansão natural é para grids de cards, não para longas seções de scroll.

### 0.3 Formato de Decisão (Atualizado)

| Situação | Ação Obrigatória |
| :---- | :---- |
| Elemento não existe no DS | PARE. Não invente. Sinalize. |
| Cor não é variável | Use a variável semântica (ex: `text-foreground`). |
| Espaçamento quebrado | Ajuste para o múltiplo de 8px mais próximo. |
| **Layout requer scroll vertical excessivo** | **Reorganize em Cards horizontais, Grid de Cards (2-3 colunas) ou Tabs. SCROLL ZERO SEMPRE.** |
| **Conteúdo denso e secundário** | **Use Accordions ou Tabs para Progressive Disclosure. Nunca deixe o usuário scrollar por ele.** |
| Interação complexa | Adicione feedback visual (`loading`/`disabled`) e estados claros. |

---

## Bloco 1 — Design System (Tokens)

### 1.1 Tokens de Cor (Consolidado e Corrigido)

**Regra Zero:** Nunca hardcode cores.

- **Background:** `bg-background` (\#F9FAFB \- Cinza claríssimo, NÃO branco puro, para reduzir fadiga visual e preservar o alto contraste). Branco puro (\#FFFFFF) é reservado para `bg-card`.  
- **Foreground:** Azul Marinho (`#031525`) — Máximo contraste e autoridade.  
- **Primary:** Azul Balha (`#0C228F`) — Ação e confiança.  
- **Secondary:** Laranja Alerta (`#FF9500`) — Urgência e destaque secundário.  
- **Muted (Fundo neutro):** `bg-muted` (\#EDEDED) — Para backgrounds de chunks e áreas não interativas.  
- **Card (Fundo de conteúdo):** `bg-card` (\#FFFFFF) — O contêiner prioritário de informação, destacando-se sobre o `bg-background`.  
- **Border:** `border-border` (\#E5E5E5) — Separação sutil.  
- **Regra 60-30-10:** 60% `bg-background` (Cinza claríssimo), 30% `bg-card`/`bg-muted`, 10% `bg-primary` (Ação).  
- **Feedback:** `success` (\#10b981), `warning` (\#f59e0b), `error` (\#ef4444).

### 1.2 Tokens de Tipografia

- **Fonte Única:** Rethink Sans. (**Proibido Monospace/Bold 700+**).  
- **Peso Limite:** `font-semibold` (600) é o máximo permitido.  
- **Tabular Nums:** Obrigatório em qualquer dado numérico (`font-variant-numeric: tabular-nums`).  
- **Escala:**  
  - `display`: 48px/1.1 (`tracking-tight`)  
  - `heading-1`: 32px/1.2 (`tracking-wide`)  
  - `heading-2`: 24px/1.3  
  - `body`: 16px/1.5  
  - `small`: 14px/1.5  
  - `caption`: 12px/1.5

### 1.3 Tokens de Espaçamento

- **Escala base 8px:** `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px).  
- **Padding interno:** Mínimo de `p-4` para áreas clicáveis dentro de Cards (44x44px).

### 1.4 Tokens de Sombra e Elevação (Reforçado)

- **PROIBIDO:** `shadow-*`, `drop-shadow-*`, `bg-gradient-*`.  
- **Alternativa de Profundidade:** Use `border border-border` ou `bg-muted` para separar Cards do Background. A diferença entre `bg-background` e `bg-card` já cria a elevação necessária.

### 1.5 Animação e Transição

- **Transições:** Rápidas (150ms) para `hover` e `active`.  
- **Preferência de Movimento:** `@media (prefers-reduced-motion: reduce)` obrigatório.

---

## Bloco 2 — Agrupamento Visual (Chunks)

### 2.1 Princípio da Proximidade (Aplicado a Cards)

- **Elementos relacionados** dentro de um único Card: `gap-2` a `gap-4`.  
- **Grupos de Cards independentes:** `gap-6` a `gap-8`.  
- Um Chunk não é mais uma seção, é um **Grupo de Cards com um título comum**.

### 2.2 Chunks Visuais Obrigatórios (Refatorado para Cards)

Cada grupo de informação deve ser um card ou um conjunto de cards autocontidos.

- **Chunk de Conversão (Card Principal):**  
  1. Heading Claro (Benefício principal).  
  2. 3 Benefícios Secundários em ícones \+ texto curto.  
  3. CTA Primário (Verbo \+ Objeto).  
  4. Prova Social adjacente (ex: "Junta-te a \+2.000 empresas").  
  - **Layout:** Este Card deve ser o destaque visual no grid.

### 2.3 Densidade Informacional (Foco no Usuário)

- **F-Pattern e Z-Pattern:** O layout de Cards é a materialização desses padrões de leitura. O olho percorre a linha superior de cards (Z-Pattern) ou a coluna da esquerda (F-Pattern), encontrando blocos de informação autônomos.  
- **Lei de Hick:** Ofereça opções como Cards comparáveis, não como uma lista longa. A decisão é mais rápida quando as opções são visíveis lado a lado.  
- **Progressive Disclosure:** Use Accordions **dentro de Cards** (ex: "Ver detalhes técnicos") ou Tabs para esconder detalhes que poluiriam a experiência principal. Nunca os coloque em uma longa página de scroll.  
- **PROIBIDO BENTO GRID:** Use grids de cards simples e modulares (2-3 colunas).

---

## Bloco 3 — Layout e Scroll Zero (Totalmente Refatorado com Pesquisa)

**Princípio Supremo:** 100% do conteúdo de ação deve ser acessível sem scroll vertical. A navegação é horizontal e por Chunks de Cards.

### 3.1 Above the Fold — Anatomia Obrigatória (Sem Scroll)

O primeiro viewport deve ser um painel de controle, não uma página.

1. **Header Sticky (Opcional mas recomendado):** Logo \+ Navegação Essencial \+ CTA Secundário.  
   - *Nota:* Se a aplicação for muito simples, um Header fixo pode ocupar espaço vital. Considere integrar a navegação como Filtros/Tabs no topo.  
2. **Área de Filtros e Tabs:** Imediatamente abaixo, controles para segmentar os Cards. Ex: Tabs (`Todos`, `Ativos`, `Pausados`).  
3. **Grid de Cards (O Coração da Experiência):** Um grid com `scroll-snap` horizontal ou um grid de 2-3 colunas. Cada Card é uma unidade de ação. Ex: Card de Projeto, Card de Relatório, Card de Métrica.  
4. **CTA Primário Persistente:** Um botão de ação principal "Criar Novo" ou "Gerar Relatório" fixo no canto inferior direito, sempre visível.

### 3.2 Alternativas ao Scroll (Hierarquia de Uso)

| Técnica | Quando Usar | Regra Balha |
| :---- | :---- | :---- |
| **Cards Horizontais** | Conjunto de itens de navegação ou ações (ex: projetos recentes). | **Uso Primário.** Use `flex` com `overflow-x-auto` e `scroll-snap-x mandatory`. |
| **Grid de Cards** | Visualização principal de um dashboard ou lista de itens. | **Uso Primário.** 2-3 colunas que se ajustam no mobile. É a `section` do Balha. |
| **Tabs** | Para conteúdo relacionado dentro de um mesmo contexto. | **Uso Estratégico.** Perfeito para "Descrição", "Funcionalidades", "Preços" no Above the Fold. |
| **Accordions** | Para detalhes técnicos, FAQs ou informações secundárias dentro de um Card. | **Uso para Progressive Disclosure.** Ótimo para esconder complexidade, mas nunca para esconder CTAs. |
| **Steppers** | Para fluxos lineares (ex: checkout, onboarding). | Manter. Um Stepper é a antítese do scroll, é um caminho guiado. |

### 3.3 CTA Sempre Visível (Sticky e Contextual)

- **CTAs em Cards:** Cada Card deve ter seu próprio CTA contextual ("Abrir Projeto", "Ver Relatório").  
- **CTA Global:** Um único botão de ação primária (`bg-primary`) fixo no viewport (ex: posição `fixed bottom-8 right-8`) para a ação mais importante da tela.

---

## Bloco 4 — Componentes (Foco em Cards, Tabs e Ações)

### 4.1 Cards — O Componente Central (Nova Especificação)

O Card é a unidade lógica e visual do Balha System.

**Anatomia do Card:**

- **Contêiner:** `bg-card`, `border border-border`, `rounded-[var(--radius)]`.  
- **Cabeçalho:** Título do item (`font-semibold`) \+ Tag de Status (se aplicável). Alinhado ao topo.  
- **Corpo:** Informação essencial, muito curta (2-3 linhas máx.). Use `text-foreground`.  
- **Rodapé:** Ação contextual (Botão Secundário "Ver Mais", ícone de ação) e Meta-dados (ex: data, autor).  
- **Estados de Interação:** O Card inteiro deve ser clicável se for um link de navegação. Use `cursor-pointer` e um efeito de `bg-muted` ao hover.

**Diretrizes de Layout do Card:**

- **Em um Grid (2-3 colunas):** Use `w-full`.  
- **Em um Scroll Horizontal:** Use `min-w-[320px] max-w-[400px]` para controlar a largura e garantir que o próximo card seja parcialmente visível (indicando scroll).

### 4.2 Tabs e Accordions (Novo)

- **Tabs:**  
  - **Uso:** Navegação de conteúdo no topo do "Above the Fold". Substitui a necessidade de scroll para ver diferentes seções.  
  - **Estilo:** Tab ativa com `border-b-2 border-primary` e `text-primary`. Tabs inativas com `text-muted-foreground`.  
- **Accordion:**  
  - **Uso:** Exclusivamente para detalhes secundários. Ex: "Especificações Técnicas" dentro de um card de produto.  
  - **Comportamento:** `collapsible`. O conteúdo oculto não deve conter CTAs primários.

### 4.3 Botões — Hierarquia e Ação (Refinado)

- **Primário:** `bg-primary`, `text-primary-foreground`. **Máximo 1 por Card.**  
- **Secundário:** `bg-muted`, `text-foreground` ou `border border-border`. Ações menos críticas.  
- **Terciário/Ghost:** Apenas ícone \+ texto, sem fundo. Para ações de "low profile" no rodapé do Card.  
- **Estados:** `:hover` (sutil escurecimento/`opacity-90`), `:focus-visible` (`ring-2 ring-ring`), `:disabled` (`opacity-50 cursor-not-allowed`).  
- **Copy:** Sempre **\[Verbo\] \+ \[Objeto\]**. Ex: "Gerar Relatório". Nunca "Clique Aqui".

### 4.4 Formulários, Inputs e Validação

- **Labels:** Sempre visíveis no topo do input. (Evite apenas placeholder).  
- **Validação:** Inline e em tempo real. Mensagens de erro claras em `text-error`, com um ícone de alerta.  
- **Contexto:** Formulários complexos devem ser quebrados em **Steppers** (Bloco 3.2), onde cada passo é um Card autocontido.

### 4.5 Navegação e Sidebar

- **Sidebar:** `w-16` para ícones ou `w-64` expandida.  
- **Item Ativo:** Pill sólido em `bg-primary`.  
- **Breadcrumbs:** Obrigatórios em fluxos com mais de 2 níveis de profundidade. Fornecem contexto sem scroll.

---

## Blocos 5-9 — Diretrizes Gerais

### Bloco 5: Acessibilidade (WCAG 2.1 AA)

- **Contraste:** Mínimo 4.5:1 para texto normal (`#031525` em `#FFFFFF`/`#F9FAFB` garante \>14:1).  
- **Foco Visível:** `ring-2 ring-ring` obrigatório para todos os elementos interativos.  
- **Áreas de Clique:** Mínimo 44x44px (garantido por `p-4` em Cards e botões).  
- **Semântica para Cards:** Use `role="list"` e `role="listitem"` para grids de cards, melhorando a navegação por leitores de tela. Cada Card deve ter um `aria-label` descritivo se não tiver um título visível.  
- **HTML Semântico:** Use `main`, `nav`, `section` (para chunks de cards), e `aside`.

### Bloco 6: Performance

- **Carregamento Inicial \< 3s:** Priorize o carregamento do primeiro Grid de Cards visível.  
- **Lazy Loading:** Carregue os Cards sob demanda conforme o usuário navega (ex: Intersection Observer para scroll horizontal ou carregamento de Tabs).

### Bloco 7: Conversão

- **Fórmula de Conversão do Card:** **(Proposta de Valor em 3s) \+ (Benefícios Auto-contidos) \+ (Prova Social Adjacente) \+ (CTA com Verbo de Ação) \= Conversão.**  
- **Redução de Fricção:** A experiência sem scroll remove a "fricção de exploração". O usuário vê tudo que importa em um só lugar e decide mais rápido.

### Bloco 8: Auditoria (Checklist Final de Geração)

Antes de entregar o código, a IA deve verificar e remover/ajustar:

1. **`bg-white` ou `#ffffff` como fundo principal?** Trocar por `bg-background` (\#F9FAFB).  
2. **Existe `shadow-*`?** Remova e use `border`.  
3. **Existe `font-bold` (700+)?** Trocar por `font-semibold` (600).  
4. **Existe scroll vertical excessivo (\>2 viewports)?** Refatorar para Cards, Grids ou Tabs.  
5. **A fonte é Rethink Sans?** Confirmar.  
6. **A cor de foreground é Azul Marinho (`#031525`)?** Confirmar.  
7. **Os Cards têm ações claras e são semanticamente corretos?** Adicionar `role` e `aria-label`.

### Bloco 9: Glossário de Decisão Rápida

| Conceito | Regra Balha v10 |
| :---- | :---- |
| **Cor de Fundo da Página** | `bg-background` (\#F9FAFB), NUNCA branco puro. |
| **Cor de Fundo do Conteúdo** | `bg-card` (\#FFFFFF), para criar contraste e elevação sem sombras. |
| **Unidade de Layout Principal** | O Card. Substitui `section`s longas. |
| **Método Principal de Navegação** | Scroll Horizontal (Cards) e Tabs. Scroll Vertical é erro. |
| **Agrupamento de Conteúdo** | Chunks de Cards. Cada Chunk tem um título e um grid de Cards. |
| **Peso de Fonte Máximo** | 600 (`font-semibold`). |
| **Sombras** | Proibidas. |
| **Gradientes** | Proibidos. |
| **Foco do Usuário** | Decisão rápida (F-Pattern) com carga cognitiva mínima (Lei de Hick). |

