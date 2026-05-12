---
name: ai-coding-prompt
description: >
  Use quando o usuário quiser criar prompts para ferramentas de AI coding: Claude Code,
  Cursor, Copilot, Windsurf, Aider ou qualquer agente de codificação. Ativa com frases
  como "me faz um prompt para o Claude Code", "prompt para o Cursor refatorar X",
  "escreve uma task para o agente", ou qualquer variação onde o destino é uma ferramenta
  de codificação por IA.
---

# AI Coding Prompt Skill

## Ordem de execução

1. **SKILLS** — buscar `**/*.md` e `**/SKILL.md` no projeto; carregar relevantes
2. **CONSULTAR** — ler `MEMORY.md`; extrair lang, arch, framework, prefs, decisões
3. **MODO** — identificar se é explore ou propose (ver abaixo)
4. **GERAR** — agir conforme o modo
5. **ATUALIZAR** — gravar nova info em `MEMORY.md` se surgiu

Se `MEMORY.md` não existir → CRIAR antes de continuar.

---

## Memória — Caveman

Ler/escrever `MEMORY.md` sempre em caveman. 1 linha = 1 fato. Max 1.5k tokens.
Editar só linha que mudou. Nunca reescrever tudo.

```
lang: TS | arch: FSD | framework: React | no-shadows
```

Template mínimo:
```md
# MEMORY
## PROJETO
nome: | status: [WIP|DONE|PAUSED] | repo:
## STACK
lang: | framework: | infra: | db: | llm:
## DECISÕES
[YYYY-MM-DD] [decisão]
## PREFS
[preferência]
```

---

## Modos de operação

### EXPLORE — pensar, não implementar

Ativar quando: ideia vaga, problema a investigar, comparação de abordagens, dúvida arquitetural.
Frases: "o que você acha de...", "como poderia...", "me ajuda a pensar...", "explora comigo..."

**Postura:**
- Parceiro de raciocínio — curioso, não prescritivo
- Ler arquivos e codebase para embasar; nunca escrever código
- Usar diagramas ASCII quando ajudar a clarificar
- Abrir threads, não funilar — deixar o usuário seguir o que ressoa
- Não forçar conclusão — o pensamento é o valor

**O que fazer no explore:**
- Fazer perguntas que emergem naturalmente do que o usuário disse
- Desafiar premissas
- Mapear arquitetura existente relevante
- Comparar abordagens com tabela ou diagrama
- Identificar riscos e lacunas

**Quando insights cristalizam**, oferecer:
- "Isso está sólido. Quer que eu monte um prompt de proposta?"
- Não capturar automaticamente — só oferecer

**Não fazer no explore:**
- Gerar prompt de implementação sem o usuário pedir
- Fazer perguntas em sequência forçada
- Apressar para conclusão

---

### PROPOSE — gerar prompt pronto para implementar

Ativar quando: usuário quer implementar algo, tarefa clara, feature definida.
Frases: "me faz um prompt", "cria uma task", "quero implementar...", "gera o prompt para..."

**Passos:**

#### 1. Identificar ferramenta alvo

| Ferramenta | Estilo do prompt |
|---|---|
| Claude Code | Longo, narrativo, multi-etapa, contexto completo |
| Cursor | Cirúrgico, escopo de arquivos preciso, curto |
| Copilot | Curto, inline ou chat, contexto vem do arquivo aberto |
| Windsurf | Objetivo de alto nível + restrições |
| Aider | Direto, atômico, especificar arquivos no comando |

Se ferramenta não informada → perguntar antes de gerar.

#### 2. Identificar tipo de tarefa e técnica

| Tipo | Técnica | Elementos obrigatórios |
|---|---|---|
| Criar feature/componente | Output Anchoring | Nome do arquivo, estrutura esperada, exports |
| Refatorar | Negative Constraints | O que manter, o que mudar, o que não tocar |
| Corrigir bug | Step Decomp | Reprodução, comportamento esperado, arquivos afetados |
| Criar testes | Few-Shot | Exemplo de teste existente, padrão de naming |
| Migração/upgrade | Chain of Thought | Passos, rollback, arquivos de impacto |
| Scaffold/arquitetura | Role + CoT | Papel do agente, estrutura de pastas, decisões a tomar |

#### 3. Montar blocos — só os necessários

```
## CONTEXTO
[stack + arch + convenções — extraído do MEMORY.md e skills em 2-3 linhas compactas]

## TAREFA
[verbo imperativo + o que fazer — atômico, cabe em 1 PR]

## ARQUIVOS
[caminhos a ler, editar ou criar]

## REQUISITOS
[regras técnicas + o que NÃO fazer]

## SAÍDA ESPERADA
[estrutura: arquivo, função, componente, schema]
```

#### 4. Validar antes de entregar

- Tarefa é atômica? (1 commit / 1 PR)
- Tem pelo menos 1 restrição negativa?
- Escopo de arquivos está claro?
- Contexto de stack/arch está no prompt ou no MEMORY.md?

---

## Entrega

**EXPLORE:** resposta conversacional, diagramas ASCII se útil, sem prompt de código.

**PROPOSE:** apenas o bloco copiável abaixo. Nada mais.

```
[prompt pronto]
```

---

## Proibido na entrega

- Sem emojis — nunca
- Sem seção "Por que este formato" ou qualquer meta-explicação
- Sem perguntas no final — entregar e parar
- Sem bullet list no CONTEXTO — linhas compactas tipo caveman
- Sem nota de rodapé, comentário ou markdown decorativo fora do prompt
- MEMORY.md update: silencioso, sem explicar o que foi atualizado
- 1 linha seca de nota técnica fora do bloco: só se acrescentar algo real
