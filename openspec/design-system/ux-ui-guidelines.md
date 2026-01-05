# GUIA DE UX/UI E PRINCÍPIOS VISUAIS — INCI DESIGN SYSTEM
**Versão:** 1.0.0  
**Foco:** Experiência do Usuário (UX), Interface (UI), Acessibilidade e Interação.  
**Status:** Padrão Obrigatório para Design e Desenvolvimento.

---

## 1. INTRODUÇÃO: A Filosofia do "Invisível"
O melhor design é aquele que o usuário não nota. Nossas interfaces devem ser invisíveis, permitindo que o usuário complete tarefas sem atrito, confusão ou esforço cognitivo desnecessário.

**Princípios Norteadores:**
1.  **Clareza sobre a Criatividade:** Se o usuário tem que pensar "o que isso faz?", o design falhou.
2.  **Consistência:** Padrões repetidos criam confiança e velocidade de uso.
3.  **Feedback Imediato:** O sistema deve sempre responder às ações do usuário.

---

## 2. HIERARQUIA VISUAL
A hierarquia guia o olho do usuário através da página. Sem ela, a tela é um bloco de ruído.

### 2.1. Dimensões de Hierarquia
Usamos três ferramentas principais para estabelecer importância:
1.  **Tamanho:** Elementos maiores chamam mais atenção.
2.  **Cor/Contraste:** Cores fortes (Primary) chamam atenção; cores neutras (Muted) recuem.
3.  **Espaçamento (Whitespace):** Agrupar itens próximos indica relação; afastá-los indica separação.

### 2.2. A Pirâmide de Conteúdo
Toda página deve seguir uma ordem estrita de importância visual:

| Nível | Elemento | Exemplo | Estilo Visual |
| :--- | :--- | :--- | :--- |
| **1** | **Título Principal (H1)** | "Dashboard Financeiro" | Tamanho Grande, Peso 600 (Semibold), Cor Foreground |
| **2** | **Ações Primárias** | "Novo Relatório", "Salvar" | Botão Primary, Cor de destaque |
| **3** | **Subtítulos / Seções (H2/H3)** | "Receita Mensal" | Tamanho Médio, Peso 500 (Medium), Cor Foreground |
| **4** | **Corpo de Texto** | Descrições, Parágrafos | Tamanho Base (16px), Peso 400 (Normal), Cor Foreground |
| **5** | **Metadados / Secundário** | Data, Status, Labels | Tamanho Pequeno (12px-14px), Peso 500, Cor Muted-Foreground |

**Regra de Ouro:** Nunca use `font-bold` (700) ou pesos maiores para títulos. O contraste e o tamanho são suficientes para criar hierarquia sem "gritar" com o usuário.

---

## 3. ESPAÇAMENTO E RESPIRO (WHITESPACE)
Espaço vazio não é espaço desperdiçado; é um elemento de design ativo.

### 3.1. O Ritmo Visual
Todo o layout deve seguir uma "respiração" constante baseada na nossa grid de 4px (definida no spec técnico).
*   **Densidade Interno:** Elementos relacionados (ex: ícone e texto ao lado) devem ter pouco espaço (`gap-2` ou `8px`).
*   **Separação de Grupos:** Blocos de conteúdo diferentes (ex: um card e outro) devem ter espaço moderado (`gap-4` ou `16px`).
*   **Separação de Seções:** Áreas distintas da página (ex: Header e Conteúdo) devem ter espaço amplo (`py-8` ou `32px+`).

### 3.2. Evitar o "Efeito Parede de Tijolos"
❌ **Errado:** Cards colados uns aos outros, sem margem, dificultando a distinção do começo e fim de cada informação.
✅ **Certo:** Uso de `p-6` (padding interno) e `gap-6` (espaço externo) para dar fôlego ao conteúdo.

---

## 4. PSICOLOGIA DAS CORES E APLICAÇÃO
Como traduzir nossos tokens de cor em intenção de design.

| Token | Uso Intencional | Significado Psicológico | Quando Usar |
| :--- | :--- | :--- | :--- |
| **Primary** | **Ação Principal** | Foco, Importância | Botão de "Salvar", "Confirmar", Link principal da navegação. |
| **Destructive** | **Ação Perigosa** | Alerta, Perigo | Botão de "Excluir", "Cancelar Assinatura". |
| **Secondary** | **Ação Secundária** | Suporte, Alternativa | Botão "Cancelar", "Voltar". Menos proeminente que Primary. |
| **Muted / Muted-Foreground** | **Informação Passiva** | Suporte, Contexto | Textos de data, labels de formulário, descrições longas. Não compete com a ação principal. |
| **Accent** | **Destaque Sutil** | Seleção, Hover | Fundo de linhas de tabela ao passar o mouse, seleção de tabs. |

**Regra de Contraste:** Nunca use `text-primary` sobre um fundo `background` para textos longos (causa fadiga visual). Use `text-foreground`. Reserv `text-primary` para títulos curtos ou links.

---

## 5. TIPOGRAFIA: LEGIBILIDADE SOBRE ESTILO

### 5.1. Linhagem (Line-Height)
Para textos longos (corpo), a altura da linha deve ser confortável.
*   **Corpo (Base):** `leading-relaxed` ou `leading-7`. Isso permite que o olho "pule" de linha para linha sem se perder.
*   **Títulos:** `leading-tight`. Títulos não precisam de muito espaço entre linhas, pois são curtos.

### 5.2. Comprimento da Linha (Measure)
Linhas muito longas causam fadiga ocular; linhas muito curtas fazem o olho pular demais.
*   **Ideal:** Entre 60 e 75 caracteres por linha.
*   **Implementação:** Em telas largas (Desktop), use containers com `max-w-prose` (cerca de 65ch) ou colunas em grid para quebrar o texto. Não estique o texto de ponta a ponta da tela.

---

## 6. MICRO-INTERAÇÕES E FEEDBACK
A interface deve sentir-se "viva". Cada interação do usuário deve ter uma resposta do sistema.

### 6.1. O Estado de "Falso Carregamento" (Skeleton Screen)
Conforme discutido na especificação técnica, usamos a técnica de **Skeleton Screen** para evitar o sentimento de lentidão.
*   **Por que funciona:** O usuário percebe estrutura antes do conteúdo. Mostrar o contorno cinza pulsante (`animate-pulse`) faz o cérebro acreditar que o conteúdo está "carregando".
*   **Regra:** **NUNCA** use Spinners (círculos girando) para carregar uma lista inteira. Use Spinner apenas para ações pontuais (ex: clicar em "Salvar" dentro de um botão).

### 6.2. Transições (A Mágica dos 200ms)
Todas as mudanças de estado (hover, focus, modal abrindo) devem durar exatamente `200ms`.
*   **Muito rápido (<100ms):** Parece instável ou imperceptível.
*   **Muito lento (>300ms):** Parece que o site está travado.
*   **Curva:** `ease-in-out`. Começa devagar, acelera no meio, termina devagar. É a curva mais natural para o movimento humano.

### 6.3. Estados Interativos Obrigatórios
Todo elemento clicável (botões, links, cards de ação) deve ter três estados visuais claros:
1.  **Rest:** Aparência padrão.
2.  **Hover:** Mudança sutil de cor (`bg-primary/90`) ou movimento (`translate-y-[-1px]`).
3.  **Active:** Pressionar para baixo (`translate-y-[0px]` ou `scale-95`). Isso dá uma sensação "cliqueável" (tátil).

---

## 7. DESIGN DE FORMULÁRIOS (FORM UX)
Formulários são onde a UX geralmente falha. Siga estas regras para criar fluxos eficientes.

### 7.1. Alinhamento de Labels
*   **Regra Geral:** Coloque labels **acima** (`block`) do input, e não ao lado.
*   **Motivo:** Facilita a leitura em Mobile (evita quebra de layout) e permite inputs mais largos para digitação.

### 7.2. Validação em Tempo Real (Real-time Validation)
*   Não espere o usuário clicar em "Enviar" para dizer que o email é inválido.
*   Valide assim que o usuário terminar de digitar o campo (`onBlur` ou após algumas teclas).
*   Mensagens de erro devem ser: Claras, construtivas e aparecer logo abaixo do campo com a cor `text-destructive`.

### 7.3. Agrupamento Lógico
Agrupe campos relacionados em Cards ou Seções (`Fieldset`).
*   Exemplo: "Dados Pessoais" (Nome, Email, CPF) separados visualmente de "Endereço" (Rua, Cidade, CEP).

---

## 8. ACESSIBILIDADE COGNITIVA
Não é apenas sobre leitores de tela; é sobre facilitar a vida de quem está cansado, com pressa ou em um ambiente barulhento.

### 8.1. Zonas de Toque (Mobile)
*   O tamanho mínimo clicável para dedos humanos é **44px x 44px**.
*   Botões pequenos (ícones) devem ter um padding invisível (`p-2`) para aumentar a área de toque sem aumentar o ícone visualmente.

### 8.2. Redução de Carga Cognitiva
*   Não peça tudo de uma vez. Se um formulário for longo, quebre-o em passos (Wizards/Steps).
*   Use defaults inteligentes (pré-preencher campos se possível).
*   Oculte informações complexas atrás de um link "Mostrar detalhes avançados".

---

## 9. CHECKLIST DE UX/UI (Para Designers e Devs)
Antes de entregar uma tela, pergunte-se:

*   **O que o usuário deve olhar primeiro?** (Hierarquia clara?)
*   **O que ele deve fazer aqui?** (Ação principal visível?)
*   **A tela está poluída?** (Podemos remover ou tornar algo "muted"?)
*   **O sistema parece responsivo?** (Há feedbacks de hover/foco?)
*   **A fonte está confortável de ler?** (Linha e tamanho adequados?)
*   **O formulário é fácil de preencher?** (Labels claros, ajuda em caso de erro?)

---

## 🏁 CONCLUSÃO
Este documento, aliado à Especificação Técnica de Código, forma a base completa do **INCI Design System**. A Técnica garante que funcione; este Guia garante que seja amado pelos usuários.

**INCI UX/UI Guidelines v1.0.0**
