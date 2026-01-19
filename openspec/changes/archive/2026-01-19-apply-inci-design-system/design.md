# INCI Design System — Guia Oficial Completo & Prompt Definitivo
**Compatível 100% com shadcn/ui**  
**Versão:** 3.0.0 (Extended)  
**Status:** Produção  
**Stack Padrão:** React 18+, Tailwind CSS 3+, shadcn/ui, TypeScript

---

## 🚨 Prefácio: A Fonte Única da Verdade
Este documento não é apenas uma guia de estilos; é **a instrução principal para a criação de software**. Qualquer código gerado, seja por um desenvolvedor humano ou uma Inteligência Artificial, deve seguir rigorosamente cada linha aqui descrita.

Se houver conflito entre a intuição do desenvolvedor e este documento, **este documento prevalece**.

---

## 🛑 Regras Absolutas (Inquebráveis)

1.  **Cores:**
    *   ❌ **NUNCA** use valores HEX (ex: `#FFFFFF`), RGB ou HSL direto nas classes Tailwind.
    *   ❌ **NUNCA** use `style={{ color: '...' }}`.
    *   ✅ **SEMPRE** use tokens de CSS Variables definidos na seção `Tokens Oficiais`.
    *   Exemplo correto: `bg-background`, `text-primary`, `border-border`.

2.  **Tipografia (Peso da Fonte):**
    *   ❌ **PROIBIDO** usar pesos acima de 600.
    *   ❌ Não use `font-bold` (700), `font-extrabold` (800) ou `font-black` (900).
    *   ✅ O peso máximo permitido é `font-semibold` (600).
    *   ✅ O padrão para corpo de texto é `font-normal` (400). Para destaques leves, use `font-medium` (500).

3.  **Estilos Inline:**
    *   ❌ O uso de `style={{ }}` é considerado má prática e deve ser evitado a todo custo, a menos que para cálculos dinâmicos específicos de posicionamento (top/left) que o Tailwind não suporte nativamente.

4.  **Reutilização (DRY):**
    *   ❌ **NUNCA** copie e cole blocos grandes de JSX (HTML) repetidos.
    *   ✅ Se um padrão visual se repete mais de duas vezes, ele **deve** ser extraído para um componente React reutilizável.

---

## 🎨 Tokens Oficiais (CSS Variables)

Estes são os únicos valores de cor permitidos no projeto.

```css
@layer base {
  :root {
    --radius: 0.775rem;

    /* Base */
    --background: 240 5% 96%;
    --foreground: 222.2 84% 4.9%;

    /* Card / Popover */
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;

    /* Primary / Secondary */
    --primary: 231 84% 30%;
    --primary-foreground: 0 0% 98%;
    --secondary: 210 40% 98%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    /* Muted / Accent */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    /* Destructive */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    /* UI Elements */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 231 84% 30%;

    /* Sidebar */
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
}
```

---

## ⚙️ Configuração Tailwind (tailwind.config.ts)

```ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        base: "0.775rem", // Padrão para botões
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

---

## 📐 Padrões de Geometria e Espaçamento

### Border Radius (Arredondamento)
*   **Botões:** `rounded-base`
*   **Inputs & Selects:** `rounded-md`
*   **Cards, Modals, Sheets:** `rounded-lg`
*   **Badges, Avatars:** `rounded-full`
*   **Alerts:** `rounded-base`

### Transições Padrão
Todas as interações visuais (hover, focus, active) devem ter transições suaves.
*   **Classe Padrão:** `transition-all duration-200 ease-in-out`
*   **Cores:** `transition-colors duration-200 ease-in-out`
*   **Transformações:** `transition-transform duration-200 ease-in-out`

### Espaçamento (Espaçamento Base 4px)
Sempre use múltiplos de 0.25rem (4px) para `padding` e `margin`.
*   Espaçamentos comuns: `p-4` (16px), `p-6` (24px), `p-8` (32px).
*   Evite valores arbitrários como `p-[13px]`.

---

## 🏗️ Arquitetura de Componentes e Reutilização

### Filosofia: Atomic Design & Features
A estrutura do projeto deve favorecer a descoberta e a reutilização.

1.  **Componentes Primitivos (`components/ui`):**
    *   São wrappers de baixo nível em torno de HTML ou Radix UI.
    *   Exemplos: `Button.tsx`, `Input.tsx`, `Label.tsx`.
    *   Elas não contêm lógica de negócios.

2.  **Componentes Compostos/Features (`components/` ou `features/`):**
    *   Combinações de primitivos que formam partes da UI específicas.
    *   Devem ser altamente reutilizáveis.
    *   Exemplo: `UserMenu.tsx`, `StatCard.tsx`, `DataTableHeader.tsx`.

### Regra de Ouro da Componentização
**"Se você precisa copiar e colar um bloco de código JSX com mais de 3 linhas, pare. Crie um componente."**

#### Padrão de Implementação de Componentes Reutilizáveis

Ao criar um componente customizado:

1.  **Use `forwardRef`:** Permite que o componente receba refs para foco de acessibilidade.
2.  **Use `cn`:** Utilize a função utilitária `clsx` e `tailwind-merge` (normalmente exportada como `cn` de `@/lib/utils`) para mesclar classes passadas via `props` com as classes padrão, garantindo que o usuário possa sobrescrever estilos se necessário.
3.  **Desestruture `className`:** Sempre permita que o `className` seja passado para o elemento raiz ou wrapper.

**Exemplo de Componente Correto:**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils" // Utilitário padrão para mesclar classes

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string
  description?: string
  icon?: React.ReactNode
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, description, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
```

---

## 🧩 Padrões Específicos de Componentes

### Botões (Estados e Variações)
Todo botão deve ser acessível e ter feedback visual claro.

*   **Base:** `rounded-base transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`
*   **Primary:** `bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm`
*   **Secondary:** `bg-secondary text-secondary-foreground hover:bg-secondary/80`
*   **Outline:** `border border-input bg-background hover:bg-accent hover:text-accent-foreground`
*   **Ghost:** `hover:bg-accent hover:text-accent-foreground`
*   **Link:** `text-primary underline-offset-4 hover:underline`

### Inputs (Formulários)
Inputs devem ter estados de foco nítidos para melhorar a UX.

*   **Classe Padrão:**
    ```tsx
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
    ```

### Cards
Cards são containers flexíveis.

*   **Classe Padrão:** `rounded-lg border border-border bg-card text-card-foreground shadow-sm`

### Tipografia (Texto)
*   **Títulos (H1-H4):** Use `font-semibold` (600) para ênfase. Nada maior que isso.
*   **Subtítulos:** Use `font-medium` (500).
*   **Corpo:** Use `font-normal` (400).
*   **Muted:** Use `text-muted-foreground` para textos secundários.

---

## 🌓 Modo Escuro (Dark Mode)
O projeto suporta troca de temas dinâmica.

*   **Implementação:** O modo escuro é ativado adicionando a classe `dark` ao elemento `<html>` ou `<body>`.
*   **Tokens:** Todos os componentes devem usar tokens HSL (ex: `hsl(var(--background))`) que mudam automaticamente de valor quando a classe `.dark` está presente no pai.
*   **Obrigatoriedade:** Todos os componentes novos devem ser testados visualmente em ambos os modos (Light/Dark).

---

## 📱 Responsividade e Mobile-First

O padrão adotado é **Mobile-First**.
1.  Escreva estilos base para telas pequenas (sem prefixo).
2.  Adicione modificadores para telas maiores: `md:`, `lg:`, `xl:`, `2xl:`.

**Exemplo de Grid:**
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

---

## ♿ Acessibilidade (A11y)

A acessibilidade não é opcional.

1.  **Foco Visível:** Todo elemento interativo deve ter um estado de foco claro (usando `ring-ring`).
2.  **Contraste:** Garantir que o texto tenha contraste suficiente com o fundo (os tokens oficiais já garantem isso).
3.  **ARIA Labels:** Botões que contenham apenas ícones (sem texto) devem ter `aria-label`.
    ```tsx
    <Button variant="ghost" size="icon" aria-label="Configurações">
      <Settings className="h-4 w-4" />
    </Button>
    ```
4.  **Semântica HTML:** Use `<button>` para ações, `<a>` para links, `<nav>` para navegação. Evite `<div>` clicáveis sem role apropriado.

---

## 🤖 Prompt de Instruções para a IA (Código)

Se você for uma IA gerando código para este projeto, siga este fluxo mental:

1.  **Analise a solicitação:** O usuário quer um componente ou página?
2.  **Verifique componentes existentes:** Se o componente existe em `shadcn/ui` ou na pasta `components/ui`, use-o. Não reinvente a roda.
3.  **Combine componentes:** Use primitivos para criar componentes de negócios mais complexos.
4.  **Aplique os Tokens:** Substitua qualquer cor ou estilo hardcoded por tokens do Design System.
5.  **Verifique a Tipografia:** Assegure-se de que nenhum `font-bold` foi usado. Substitua por `font-semibold` se necessário.
6.  **Verifique a Componentização:** O código resultante está monolítico? Quebre-o em subcomponentes.
7.  **Finalize:** Garanta transições suaves (`duration-200`), bordas visíveis (`border-border`) e feedback de hover/foco.

---

## ✅ Checklist de Validação (Pré-Commit)

Antes de considerar uma tarefa "Concluída", verifique:

- [ ] Nenhum código HEX, RGB ou HSL hardcodificado.
- [ ] Nenhum uso de `style={{ }}` para cores.
- [ ] Peso máximo de fonte é 600 (semibold).
- [ ] Componentes reutilizáveis foram extraídos (sem cópia/colar de lógica visual).
- [ ] Dark mode funciona (usando variáveis CSS).
- [ ] `rounded-base` em botões, `rounded-md` em inputs.
- [ ] Transições `duration-200` aplicadas em elementos interativos.
- [ ] Acessibilidade (aria-labels em ícones puros).
- [ ] Responsividade testada (mobile-first).

---

## 🏁 Status Final
Este documento é a **verdade absoluta** para o desenvolvimento frontend deste projeto. Ignorá-lo resultará em inconsistência visual, dificuldade de manutenção e código não padronizado.

**INCI Frontend Standard v3.0.0 — Extended Edition**
