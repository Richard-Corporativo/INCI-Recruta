---
name: balha-framework
description: >
  Workflow de desenvolvimento em 4 fases (SPEC → BREAK → PLAN → EXEC) com agentes
  especializados para construir projetos de software. Use sempre que o usuário quiser
  planejar, arquitetar ou construir uma feature ou projeto novo.

  Palavras-chave que ativam este skill: "build a project", "create an app",
  "plan a feature", "write a spec", "break into issues", "execute with agents",
  "develop using framework", ou qualquer pedido que envolva planejar antes de codar.

  Agentes disponíveis: model-writer, action-writer, route-writer, component-writer,
  hook-writer, integration-writer, test-writer.

  SEMPRE use este skill para desenvolvimento de features em múltiplos passos.
---

# Balha Framework

Workflow spec-first que cria arquivos reais em cada fase.

```
SPEC  → [project]-docs/SPEC.md       (especificação completa)
BREAK → [project]-docs/ISSUES.md     (issues por camada)
PLAN  → [project]-docs/PLAN-[N].md   (plano de execução por issue)
EXEC  → código no projeto             (via agentes especializados)
```

**Regra de ouro: Nenhum código antes da spec ser aprovada.**

---

## 1. Detecção de Estado

> Antes de qualquer coisa, identifique onde o usuário está.

| O usuário forneceu | Comece em |
|--------------------|-----------|
| Nada (projeto novo) | SPEC |
| SPEC.md existente | BREAK |
| ISSUES.md existente | PLAN |
| PLAN-[N].md existente | EXEC |
| Artefato incompleto | Complete o artefato atual antes de avançar |

**Como identificar o projeto:**
Leia `package.json` → campo `name`. Se não existir, use o nome da pasta atual.
Substitua `[project]` por esse nome em todos os caminhos. Ex: projeto `my-app` → pasta `my-app-docs/`.

---

## 2. Critérios de Saída por Fase

Cada fase tem uma condição clara para avançar. **Nunca avance sem ela.**

| Fase | Critério de saída |
|------|-------------------|
| SPEC | Usuário diz "spec aprovada", "ok", "pode continuar" ou equivalente |
| BREAK | Usuário confirma a lista de issues ou pede ajuste |
| PLAN | Usuário aprova o plano da issue antes de executar |
| EXEC | Testes passam + usuário confirma + issue marcada como done |

---

## 3. Fases

### Phase 1: SPEC

**Objetivo:** Produzir especificação completa antes de qualquer código.

#### Passos

1. Peça ao usuário para descrever o projeto em linguagem natural
2. Se algo estiver ambíguo, **pergunte antes de assumir**
3. Gere a spec usando a estrutura abaixo
4. Salve em `<workdir>/[project]-docs/SPEC.md`
5. Apresente o arquivo e aguarde aprovação explícita

#### Estrutura do SPEC.md

```markdown
# SPEC: [Nome do Projeto]

Data: [YYYY-MM-DD]
Versão: 1.0
Status: draft | approved

---

## 1. OVERVIEW
### Problema
[Que problema resolve?]

### Solução
[Como resolve?]

### Usuários-alvo
[Quem vai usar?]

### Fora de escopo
[O que explicitamente NÃO faz]

---

## 2. PAGES
### [Nome da Página] — `[/rota]`
- **Propósito:** [o que o usuário faz aqui]
- **Componentes:** [lista]
- **Estados:** [loading, empty, error, success]
- **Acesso:** [público | autenticado | admin]

[Repetir para cada página]

---

## 3. COMPONENTS
### [NomeDoComponente]
- **Propósito:** [o que faz]
- **Props:** [lista com tipos]
- **Estados visuais:** [lista]
- **Reutilizado em:** [páginas que usam]

---

## 4. BEHAVIORS (Fluxos de usuário)
### [Nome do Fluxo]
1. [Passo 1]
2. [Passo 2]
- **Caminho feliz:** [resultado esperado]
- **Erros:** [o que pode dar errado e como tratar]

---

## 5. DATA MODEL
### Tabela: [nome]
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | PK |

### Relacionamentos
[Descreva foreign keys e cardinalidade]

### RLS (Row Level Security)
- [Política 1]: [quem pode ler/escrever o quê]

---

## 6. CHECKLIST DE APROVAÇÃO
- [ ] Todas as páginas cobertas
- [ ] Todos os erros mapeados
- [ ] Modelo de dados completo
- [ ] RLS definido
- [ ] Escopo negativo explícito
```

#### Regras da fase SPEC

- Cubra **toda** página, componente e fluxo — sem omissões
- Nunca pule cenários de erro
- Se algo estiver ambíguo, pergunte antes de assumir
- Defina explicitamente o que está **fora de escopo**
- Não avance para BREAK sem aprovação explícita

---

### Phase 2: BREAK

**Objetivo:** Transformar a spec em issues executáveis e ordenadas.

#### Passos

1. Leia `<workdir>/[project]-docs/SPEC.md`
2. Quebre em issues seguindo as camadas obrigatórias
3. Salve em `<workdir>/[project]-docs/ISSUES.md`
4. Apresente e aguarde confirmação do usuário

#### Camadas obrigatórias (nesta ordem)

```
Layer 1 — FOUNDATION
  Setup do projeto, schema do banco, auth, layout base
  → Sem isso, nada funciona

Layer 2 — VISUAL PROTOTYPES  
  Páginas com dados mockados, sem lógica real
  → Valida UI antes de construir lógica

Layer 3 — FEATURES
  Lógica de negócio, integrações, server actions
  → Implementa o que o usuário vê funcionando

Layer 4 — POLISH
  Responsividade, loading states, SEO, testes, performance
  → Deixa pronto para produção
```

#### Estrutura do ISSUES.md

```markdown
# ISSUES — [Nome do Projeto]

Atualizado em: [YYYY-MM-DD]

---

## Layer 1: Foundation
- [ ] ISSUE-1: [Título] — status: pending
- [ ] ISSUE-2: [Título] — status: pending

## Layer 2: Visual Prototypes
- [ ] ISSUE-3: [Título] — status: pending

## Layer 3: Features
- [ ] ISSUE-4: [Título] — status: pending

## Layer 4: Polish
- [ ] ISSUE-5: [Título] — status: pending

---

## Detalhes das Issues

### ISSUE-1: [Título]
**Camada:** Foundation
**Dependências:** nenhuma
**Descrição:** [o que faz]

**Arquivos a criar/modificar:**
- `caminho/exato/arquivo.ts` — [o que faz]
- `caminho/exato/outro.ts` — [o que faz]

**Escopo negativo (NÃO fazer nesta issue):**
- [ ] [o que explicitamente fica de fora]

**Critério de conclusão:**
- [ ] [como saber que está pronta]
- [ ] [teste que comprova]

---

### ISSUE-2: [Título]
[Repetir estrutura acima]
```

#### Regras da fase BREAK

- Máximo de **5 a 7 arquivos por issue**
- Cada issue deve ser **testável independentemente**
- Defina explicitamente o escopo negativo
- Liste **caminhos exatos** dos arquivos
- Não inicie issue se a dependência não estiver concluída
- Não avance para PLAN sem confirmação do usuário

---

### Phase 3: PLAN

**Objetivo:** Criar plano de execução detalhado para uma issue específica.

#### Passos

1. Pergunte qual issue planeja (se não especificada)
2. Leia a issue em `<workdir>/[project]-docs/ISSUES.md`
3. Pesquise o código existente no projeto
4. Pesquise documentação externa das libs relevantes
5. Crie o plano e salve em `<workdir>/[project]-docs/PLAN-[N].md`
6. **Aguarde aprovação antes de executar**

#### Estrutura do PLAN-[N].md

```markdown
# PLANO — ISSUE-[N]: [Título]

Data: [YYYY-MM-DD]
Status: draft | approved | executing | done

---

## 1. Pesquisa interna
[O que já existe no projeto que será reutilizado ou afetado]
- Arquivo: `caminho/arquivo.ts` — [relevância]

## 2. Pesquisa externa
[Documentação das libs/frameworks usados]
- [Lib]: [link ou trecho relevante da doc]

## 3. Decisões técnicas
### Abordagem escolhida
[Descreva a abordagem]

### Alternativas descartadas
- [Alternativa A]: descartada porque [motivo]

### Riscos identificados
- [Risco 1]: [como mitigar]

---

## 4. Implementação por arquivo

### `caminho/exato/arquivo.ts`
- **Ação:** criar | modificar
- **O que faz:** [descrição]
- **Exporta:** [funções, tipos, componentes]
- **Importa de:** [dependências]
- **Notas:** [detalhes relevantes]

[Repetir para cada arquivo da issue]

---

## 5. Ordem de execução
1. [arquivo 1] — porque [dependência]
2. [arquivo 2]
3. [arquivo 3]

## 6. Cenários de teste
- [ ] Cenário feliz: [o que deve funcionar]
- [ ] Erro 1: [o que deve falhar graciosamente]
- [ ] Erro 2: [outro caso de erro]

## 7. Checklist de conclusão
- [ ] Todos os arquivos criados/modificados
- [ ] Testes passando
- [ ] Sem erros de lint
- [ ] Revisado pelo usuário
```

#### Regras da fase PLAN

- Pesquise antes de inventar — **encontre, não crie do zero**
- Reutilize código existente sempre que possível
- Liste cada arquivo com **caminho completo**
- Identifique riscos explicitamente
- **Não execute sem aprovação do plano**

---

### Phase 4: EXEC

**Objetivo:** Executar a issue usando agentes especializados na ordem correta.

#### Pré-requisito

Só execute se `PLAN-[N].md` tiver `status: approved`.

#### Agentes disponíveis

Selecione **apenas os agentes necessários** para a issue. A ordem abaixo é obrigatória quando múltiplos agentes são usados:

| Ordem | Agente | Responsabilidade |
|-------|--------|-----------------|
| 1 | `model-writer` | Schema do banco, migrations, tipos TypeScript |
| 2 | `action-writer` | Server actions, lógica de negócio, validação |
| 3 | `route-writer` | Endpoints de API, middleware |
| 4 | `component-writer` | Componentes de UI e variantes |
| 5 | `hook-writer` | React hooks, gerenciamento de estado |
| 6 | `integration-writer` | Wrappers de serviços externos |
| 7 | `test-writer` | Testes unitários, de componente e e2e |

**Critério de seleção:** Use apenas agentes cujos arquivos estão listados no PLAN.

#### Protocolo por agente

Para cada agente necessário:

```
1. Identifique os arquivos da issue que são responsabilidade deste agente
2. Forneça como contexto:
   - Stack tecnológica do projeto
   - Código existente relevante
   - Seção do PLAN referente a esses arquivos
3. Execute o agente
4. Revise o output antes de passar para o próximo agente
5. Não prossiga se houver erros não resolvidos
```

#### Após completar todos os agentes

```
1. Execute os cenários de teste do PLAN-[N].md
2. Resolva falhas antes de marcar como done
3. Atualize ISSUES.md:
   - [x] ISSUE-N: [Título] — status: done
4. Atualize PLAN-[N].md:
   status: done
5. Faça commit com a mensagem:
   "feat(issue-N): [título da issue]"
```

---

## 4. Regras Globais

### ✅ Sempre

- Escrever spec antes de codar
- Quebrar em issues pequenas (máx 5-7 arquivos)
- Definir escopo negativo em cada issue
- Pesquisar código existente antes de criar novo
- Listar caminhos exatos dos arquivos
- Testar cada issue antes de marcar como done
- Manter lógica de negócio no servidor
- Usar componentes reutilizáveis
- Fazer commit ao final de cada issue
- Aguardar aprovação humana em cada transição de fase

### ❌ Nunca

- Começar a codar sem spec aprovada
- Avançar de fase sem critério de saída cumprido
- Deixar a IA decidir arquitetura sozinha
- Pular cenários de erro
- Colocar chaves de API no frontend
- Criar componente duplicado
- Pular testes
- Iniciar issue antes da dependência estar concluída
- Aceitar código sem revisão
- Refatorar junto com feature nova

---

## 5. Rastreamento de Estado

Todos os artefatos ficam em `<workdir>/[project]-docs/`:

| Arquivo | Fase | Atualizado quando |
|---------|------|-------------------|
| `SPEC.md` | SPEC | Spec criada ou revisada |
| `ISSUES.md` | BREAK + EXEC | Issues criadas ou concluídas |
| `PLAN-[N].md` | PLAN + EXEC | Plano criado ou executado |

O usuário pode retomar o trabalho a qualquer momento — basta apontar para os arquivos existentes.