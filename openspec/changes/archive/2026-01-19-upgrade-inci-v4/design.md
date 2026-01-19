# INCI Frontend Architecture V4.0.0

## 1. INTRODUÇÃO E GOVERNANÇA

### 1.1. Propósito
Este documento serve como a **Fonte Única da Verdade (SSOT)** para todo o desenvolvimento frontend. Ele define os padrões arquiteturais, de design, de código e de comportamento que garantem a escalabilidade, manutenibilidade e consistência do produto.

### 1.2. Escopo
Estas regras aplicam-se a:
*   Todo novo código escrito.
*   Toda refatoração de código existente.
*   Qualquer geração de código assistida por IA ou ferramentas low-code.

### 1.3. Princípios Fundamentais
1.  **Composição sobre Herança:** Prefira componentes que compõem lógica e UI a componentes que herdam propriedades complexas.
2.  **Previsibilidade:** O código deve se comportar exatamente como os tokens e classes definidos indicam. Sem "mágica".
3.  **Acessibilidade Nativa:** Se não é acessível, não está pronto.

---

## 2. REGRAS DE ESTILO E DESIGN SYSTEM (TOKENS)

### 2.1. Uso de Cores (Proibição de Hardcoding)
**MOTIVO:** Hardcoding impede a implementação consistente de Dark Mode e temas futuros.

*   **REGRAS:**
    *   ❌ **ESTRICTAMENTE PROIBIDO:** Uso de códigos HEX (`#000000`), RGB (`rgb(0,0,0)`) ou HSL diretos nas classes.
    *   ❌ **ESTRICTAMENTE PROIBIDO:** Uso de objetos `style={{ color: '...' }}` para definição de cores.
    *   ✅ **OBRIGATÓRIO:** Uso exclusivo de variáveis CSS (Tokens) mapeadas no Tailwind.

### 2.2. Tokens de Cor Oficiais
As variáveis abaixo são as únicas permitidas para referência de cor. Elas devem ser acessadas via classes Tailwind (ex: `bg-background`, `text-primary`).

```css
/* Definições Globais (globals.css) */
:root {
  /* Base Neutro */
  --background: 240 5% 96%;
  --foreground: 222.2 84% 4.9%;

  /* Componentes de Superfície */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;

  /* Cores de Ação (Primary) */
  --primary: 231 84% 30%;
  --primary-foreground: 0 0% 98%;

  /* Cores Secundárias */
  --secondary: 210 40% 98%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Estados Muted e Accent */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* Destrutivo */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;

  /* Bordas e Anéis de Foco */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 231 84% 30%;

  /* Sidebar (Navegação Lateral) */
  --sidebar: 0 0% 100%;
  --sidebar-foreground: 210 17% 8%;
  --sidebar-border: 216 19% 88%;
  --sidebar-accent: 220 14% 96%;
  --sidebar-accent-foreground: 208 91% 11%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 240 5% 95%;
  --card: 240 4.8% 10%;
  --card-foreground: 240 5% 95%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 240 5% 95%;
  --primary: 217 91% 65%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 240 5% 95%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 240 5% 95%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 240 5% 95%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 217 91% 65%;
  --sidebar: 240 5% 7%;
  --sidebar-foreground: 240 4% 91%;
  --sidebar-border: 240 5% 15%;
  --sidebar-accent: 240 4% 12%;
  --sidebar-accent-foreground: 240 5% 95%;
}
```

### 2.3. Tipografia (Escala e Peso)
**MOTIVO:** Pesos excessivos (>600) diminuem a legibilidade, poluem visualmente a interface e passam uma sensação de baixa qualidade.

*   **REGRA CRÍTICA DE PESO:**
    *   ❌ **PROIBIDO:** `font-bold` (700), `font-extrabold` (800), `font-black` (900).
    *   ✅ **MÁXIMO PERMITIDO:** `font-semibold` (600).
    *   ✅ **PADRÃO DE DESTAQUE:** `font-medium` (500).
    *   ✅ **CORPO DE TEXTO:** `font-normal` (400).

*   **Escala de Tamanhos Sugerida:**
    *   H1 (Page Title): `text-4xl font-semibold tracking-tight`
    *   H2 (Section Title): `text-3xl font-semibold tracking-tight`
    *   H3 (Card Title): `text-2xl font-semibold tracking-tight`
    *   H4 (Subtitle): `text-lg font-medium`
    *   Body Large: `text-base font-normal`
    *   Body Small/Label: `text-sm font-medium` (Labels de inputs, metadados)
    *   Caption: `text-xs font-normal text-muted-foreground`

### 2.4. Geometria (Border Radius e Espaçamento)

*   **Border Radius (Arredondamento):**
    *   `rounded-base` (0.775rem) → Obrigatório para **Botões**.
    *   `rounded-md` → Obrigatório para **Inputs, Selects, Textareas**.
    *   `rounded-lg` → Obrigatório para **Cards, Modais, Sheets**.
    *   `rounded-full` → Obrigatório para **Badges, Avatares**.
    *   `rounded-sm` → Permitido apenas para containers internos rígidos.

*   **Grid de Espaçamento (Base 4px):**
    *   Todo espaçamento deve ser múltiplo de `0.25rem` (4px).
    *   Use utilitários Tailwind: `p-1` (4px), `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px).
    *   ❌ Evite valores arbitrários como `p-[13px]`.

---

## 3. ARQUITETURA DE COMPONENTES E ESTRUTURA

### 3.1. Estrutura de Pastas (Padrão Monorepo/Feature-based)

A organização de arquivos deve facilitar a localização rápida e evitar conflitos de nomes.

```text
src/
├── app/                 # Rotas da aplicação (Next.js App Router) ou Páginas
├── components/
│   ├── ui/              # [SHADCN/UI] Componentes primitivos puros (Button, Input, Card)
│   ├── layout/          # Componentes estruturais (Header, Sidebar, Footer)
│   ├── features/        # Componentes de domínio de negócio (UserTable, DashboardStats)
│   └── forms/           # Componentes de formulários complexos (LoginForm, RegisterForm)
├── lib/
│   ├── utils.ts         # Funções utilitárias (cn, formatação de data)
│   └── hooks.ts         # Custom Hooks globais
└── styles/
    └── globals.css      # Injeção de variáveis CSS e reset
```

### 3.2. Filosofia de Componentização (DRY)

**Condição de Extração:**
Se um bloco de código JSX (HTML estruturado) aparecer **duas ou mais vezes** em diferentes partes do sistema, ele **deve** ser extraído para um componente React dedicado.

**Exemplo de Anti-Padrão (Copiar e Colar):**
```tsx
// ❌ ERRADO: Card repetido na página Dashboard e Relatórios
<div className="rounded-lg border p-4 shadow">
   <h3 className="text-lg font-semibold">Título</h3>
   <p className="text-muted-foreground">Texto</p>
</div>
```

**Exemplo de Padrão Correto (Componente):**
```tsx
// ✅ CORRETO: Criar src/components/features/StatCard.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  className?: string
}

export function StatCard({ title, value, description, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6 shadow-sm", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="text-2xl font-semibold text-foreground mt-2">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
```

### 3.3. Implementação Técnica de Componentes (Boas Práticas)

Ao criar componentes reutilizáveis dentro do projeto, siga estritamente este padrão:

1.  **ForwardRef:** O componente deve exportar um `forwardRef` para permitir acesso ao elemento DOM via refs.
2.  **Merge de Classes (Utility `cn`):** Use sempre `clsx` + `tailwind-merge` (importado como `cn` de `@/lib/utils`) para permitir que o consumidor do componente sobrescreva estilos padrão.
3.  **Rest de Props:** Espalhe props restantes (`...props`) no elemento raiz para suportar atributos HTML padrão (ex: `data-id`, `onClick` nativo).

**Template Padrão:**
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  // Suas props customizadas aqui
  variant?: "default" | "secondary"
}

const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes-que-devem-existir-sempre",
          variant === "default" && "classes-para-variacao-default",
          className // Permite sobrescrita externa
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ComponentName.displayName = "ComponentName"

export { ComponentName }
```

---

## 4. ESPECIFICAÇÕES DE COMPONENTES PRIMITIVOS (shadcn/ui)

### 4.1. Botões
Todos os botões devem herdar do componente `<Button />`.

*   **Classe Base:** `rounded-base transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
*   **Variantes Definidas:**
    *   `default`: `bg-primary text-primary-foreground hover:bg-primary/90`
    *   `secondary`: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
    *   `outline`: `border border-input bg-background hover:bg-accent hover:text-accent-foreground`
    *   `ghost`: `hover:bg-accent hover:text-accent-foreground`
    *   `link`: `text-primary underline-offset-4 hover:underline`
*   **Feedback de Interação:**
    *   Hover: Transição suave de cor ou opacidade.
    *   Active: Leve transformação `active:scale-95` ou `active:translate-y-[1px]` para sensação tátil (opcional, mas recomendado para ações principais).

### 4.2. Inputs e Formulários
Todos os campos de entrada devem herdar de `<Input />`.

*   **Classe Base:** `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200`
*   **Interação:** A borda deve mudar para `ring-ring` ao receber foco.

### 4.3. Cards e Containers
*   **Classe Base:** `rounded-lg border border-border bg-card text-card-foreground shadow-sm`
*   **Hover:** Ao passar o mouse, considere adicionar `hover:shadow-md` se o card for clicável.

### 4.4. Modais e Diálogos
*   Devem ser construídos sobre o componente `<Dialog />` do Radix/shadcn.
*   Devem focar automaticamente no primeiro elemento interativo (`autoFocus`).
*   Devem travar o scroll do fundo (`ScrollLock`).

---

## 5. ESTADOS DA APLICAÇÃO (Loading, Error, Empty)

O design system não é apenas sobre estados estáticos; é crucial definir como o sistema se comporta durante interações assíncronas.

### 5.1. Estado de Carregamento (Loading)
*   **Evite:** Spinners isolados em telas inteiras (que dão sensação de lentidão).
*   **Prefira:** **Skeleton Screens**. Use o componente `<Skeleton />` do shadcn/ui para contornar onde o conteúdo aparecerá.
*   **Botões:** Ao submeter formulários, botões devem entrar em estado `disabled` e mostrar um ícone de loading pequeno se a operação demorar mais de 300ms.

### 5.2. Estado de Erro (Error)
*   **Validação de Formulário:** Use mensagens de erro pequenas, em vermelho (`text-destructive`), logo abaixo do input ou campo relacionado.
*   **Erro de Rede/Servidor:** Use um componente `<Alert variant="destructive">` ou uma seção dedicada de `ErrorBoundary` com opção de "Tentar Novamente".

### 5.3. Estado Vazio (Empty State)
*   Tabelas e listas que não possuem dados devem renderizar um componente `<EmptyState />` ilustrativo, informando o motivo e oferecendo uma ação principal (ex: "Cadastrar Novo Item").

---

## 6. RESPONSIVIDADE E LAYOUT

### 6.1. Abordagem Mobile-First
O código CSS deve ser escrito inicialmente para telas pequenas (mobile), usando modificadores para telas maiores (`md:`, `lg:`).

### 6.2. Pontos de Quebra (Breakpoints Padrão)
*   `sm`: 640px
*   `md`: 768px (Tablets)
*   `lg`: 1024px (Laptops)
*   `xl`: 1280px (Desktops largos)
*   `2xl`: 1536px (Telas ultrawide)

### 6.3. Padrão de Grid e Flex
*   Utilize `container mx-auto` para limitar a largura máxima do conteúdo centralizado.
*   Listas de cards devem usar `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`.
*   Navbar deve ser responsiva: `flex-col` em mobile e `flex-row` em desktop, utilizando `Hamburger Menu` ou `Sheet` em telas pequenas.

---

## 7. ACESSIBILIDADE (A11Y) - WCAG 2.1 AA

A acessibilidade é um requisito funcional, não estético.

1.  **Navegação por Teclado:** Todos os elementos interativos (`<button>`, `<a>`, inputs) devem ser acessíveis via teclado (`Tab`, `Enter`, `Espaço`).
2.  **Foco Visível:** O foco (o contorno ao redor do elemento selecionado) nunca deve ser removido (`outline-none` deve ser sempre acompanhado de um `ring` visível ou estado de foco equivalente).
3.  **Contraste:** Garantir contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande (os tokens oficiais já garantem isso).
4.  **ARIA:**
    *   Ícones sem texto (botões de ação) devem ter `aria-label="Descrição da ação"`.
    *   Formulários devem ter `<label>` associados ao `id` do input.
    *   Regiões dinâmicas devem usar `aria-live="polite"` para anunciar mudanças a leitores de tela.

---

## 8. CONVENÇÕES DE CODIFICAÇÃO

### 8.1. Nomenclatura
*   **Arquivos de Componentes:** PascalCase (`UserProfile.tsx`, `DataTable.tsx`).
*   **Arquivos de Utilitários/Hooks:** camelCase (`formatDate.ts`, `useAuth.ts`).
*   **Pastas:** kebab-case ou camelCase (`user-profile/` ou `userProfile/`). Manter consistência no projeto.

### 8.2. TypeScript
*   **Tipagem Estrita:** Nunca use `any`. Se o tipo é desconhecido, use `unknown`.
*   **Interfaces vs Types:** Prefira `interface` para formas de objetos e contratos de componentes; use `type` para uniões, tuplas ou tipos primitivos mapeados.
*   **Props de Componentes:** Sempre extenda `React.HTMLAttributes<ElementType>` se o componente for um wrapper de um elemento HTML.

### 8.3. Gerenciamento de Estado
*   **Estado Local:** Use `useState` para UI transitória (abas, modais, inputs de formulário simples).
*   **Estado Global:** Use Context API ou Zustand para estados compartilhados (Tema, Usuário Autenticado).
*   **Estado de Servidor:** Use React Query / SWR para cache, sincronização e otimização de dados vindos da API.
