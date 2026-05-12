---
name: agentic-ai-engineering
description: >
  Use para decisões de arquitetura agêntica: como estruturar agentes, orquestração,
  memória persistente, MCP, handoff entre agentes, loops de execução, e escolha de
  ferramentas agênticas. Ativa com "como estruturar meu agente", "que ferramenta usar",
  "como fazer meus agentes se comunicar", "arquitetura de agentes", ou variações.
---

# Agentic AI Engineering

## Executar sempre

1. Buscar `**/*.md` e `**/SKILL.md` no projeto — carregar os relevantes
2. Ler `MEMORY.md` — extrair contexto do projeto antes de responder
3. Responder com recomendação direta
4. Atualizar `MEMORY.md` silenciosamente com decisões novas

Se `MEMORY.md` não existir → criar antes de continuar.

---

## MEMORY.md — caveman

1 fato por linha. Max 1.5k tokens. Editar só linha que mudou.

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

## Princípios agênticos

**Agente = tarefa + memória + ferramentas + loop**

Loop padrão:
```
perceber → planejar → agir → observar → atualizar memória → repetir
```

Agente bom:
- Tarefa atômica e clara — sabe quando parou
- Memória persistente entre sessões (arquivo, DB, vector store)
- Ferramentas com escopo restrito — não acessa o que não precisa
- Falha graciosamente — não trava em loop infinito

---

## Padrões de arquitetura

**Single agent** — 1 agente, 1 objetivo, ferramentas compostas. Usar quando a tarefa é linear.

**Supervisor + workers** — supervisor decompõe, workers executam, supervisor agrega. Usar quando a tarefa tem paralelo ou especialização.

**Pipeline** — agente A passa output para agente B. Usar quando há etapas sequenciais com outputs distintos.

**Swarm** — agentes peer-to-peer, sem hierarquia, compartilham estado. Usar com cautela — difícil de debugar.

Regra: começar com single agent. Adicionar agentes só quando o problema exigir.

---

## Memória por tipo

| Tipo | Onde guardar | Quando usar |
|---|---|---|
| Fatos do projeto | `MEMORY.md` | Decisões, stack, prefs — sempre |
| Log de execução | `memory/YYYY-MM-DD.md` | O que aconteceu nessa sessão |
| Conhecimento semântico | Vector store (pgvector, Chroma) | RAG, busca por similaridade |
| Estado de tarefa | DB ou arquivo JSON | Checkpoints de execução longa |

---

## Stack — livre por projeto

Sem stack fixo. Avaliar: requisito, ecosistema existente, prazo, custo.

Registrar escolha em `MEMORY.md` com justificativa de 1 linha.

---

## Entrega

Recomendação técnica direta. Sem meta-comentário. Sem perguntas no final.
