# scripts/ — Utilitários de Desenvolvimento

Scripts utilitários criados durante sprints de migração. **Todos operam sobre `project/`.**
Executar via `node scripts/<nome>.cjs` da raiz do projeto.

---

## fix-icons.cjs

**Status**: Legado — já aplicado  
**Propósito**: Migração única de `<span className="material-symbols-outlined">icon_name</span>` para `<Icon icon="material-symbols:icon-name" />` (Iconify).  
**Efeito colateral**: Também remove `shadow-*`, `rounded-xl` em botões `bg-primary`, e substitui cores hardcoded `blue-*` por tokens Balha.  
**Ação**: Manter para referência. Não rodar novamente sem revisar os replacements de className.

---

## fix-icon-titles.cjs

**Status**: Legado — já aplicado  
**Propósito**: Envolve `<Icon title="...">` em `<span title="..."><Icon></span>` — corrige acessibilidade de tooltips que o Iconify não suporta via prop `title`.  
**Ação**: Pode ser removido. Problema corrigido na fonte.

---

## fix-duplicate-classnames.cjs

**Status**: Legado — já aplicado  
**Propósito**: Mesclava `className="..."` + `aria-hidden="true"` + segundo `className={...}` em um único atributo — corrigia erro de JSX inválido gerado durante migração de ícones.  
**Ação**: Pode ser removido. Fonte do problema (fix-icons.cjs) foi corrigida.

---

## fix-public-pages.cjs

**Status**: Legado — já aplicado  
**Propósito**: Substituição em massa de classes Tailwind hardcoded (`bg-slate-*`, `text-slate-*`, `border-slate-*`, `shadow-*`) por tokens semânticos Balha DS em `project/pages/public/`.  
**Ação**: Manter para referência de mapeamento de tokens. Ver `openspec/design-system/` para a fonte de verdade.

---

## fix-typography.cjs

**Status**: Legado — já aplicado. **PATH HARDCODED** (linha 41 — aponta para máquina original)  
**Propósito**: Substituía `font-bold/extrabold/black` por `font-semibold` e `font-mono/display` por `font-sans` conforme Balha DS (peso máximo 600).  
**Ação**: **Corrigir path antes de reutilizar** ou remover — a regra já está codificada no `validate-design-system.cjs`.

---

## validate-design-system.cjs

**Status**: Ativo — rodar em CI ou antes de PRs  
**Propósito**: Valida que nenhum arquivo em `project/` usa classes proibidas pelo Balha DS v9.1.0 (shadows, gradients, cores hardcoded, fonts não-permitidas).  
**Uso**: `npm run validate:design-system`
