---
name: prompt-engineer
description: >
  Gera prompts profissionais e bem estruturados para IA executar tarefas com precisão.
  Use esta skill sempre que o usuário quiser criar um prompt, melhorar um prompt existente,
  transformar uma ideia vaga em instrução clara para IA, ou quando disser frases como
  "me faz um prompt", "cria um prompt para", "quero um prompt que", "engenharia de prompt",
  "como eu peço para a IA fazer X", "transforma isso em prompt", ou qualquer variação.
  Também ative quando o usuário tiver uma ideia de tarefa e precisar que uma IA a execute —
  mesmo que ele não use a palavra "prompt" explicitamente.
---

# Prompt Engineer Skill

Transforma ideias e tarefas em prompts estruturados, claros e otimizados para modelos de linguagem.

---

## Filosofia Central

Um bom prompt é como uma **spec de engenharia**: define o problema, os requisitos, as restrições, o formato de saída e os critérios de sucesso. Ambiguidade é o inimigo.

---

## Processo de Execução

### 1. Entender a Tarefa

Antes de gerar o prompt, extraia mentalmente (ou pergunte se necessário):

- **O quê**: qual é a tarefa principal?
- **Para quem**: o output é para um humano ou para outra IA?
- **Contexto**: qual é o domínio? (código, marketing, análise, criação, etc.)
- **Formato de saída**: texto corrido, lista, JSON, código, tabela?
- **Tom e estilo**: formal, técnico, criativo, direto?
- **Restrições**: o que NÃO deve ser feito?

> Se a ideia do usuário for vaga demais, faça **1 pergunta objetiva** para destravar — nunca paralise com múltiplas perguntas.

---

### 2. Estrutura Obrigatória do Prompt Gerado

Todo prompt gerado deve conter os blocos abaixo (na ordem, apenas os relevantes):

```
## CONTEXTO
[Quem é a IA nesse prompt? Qual situação/cenário?]

## TAREFA
[O que exatamente deve ser feito. Verbo no imperativo.]

## REQUISITOS
[Lista de regras, critérios obrigatórios e restrições]

## FORMATO DE SAÍDA
[Como o resultado deve ser entregue: estrutura, tamanho, idioma, etc.]

## EXEMPLOS (opcional)
[Exemplos de entrada → saída para calibrar o modelo]

## OBSERVAÇÕES FINAIS (opcional)
[Instruções de comportamento: tom, o que evitar, casos de borda]
```

---

### 3. Técnicas de Engenharia de Prompt a Aplicar

Selecione e aplique conforme o tipo de tarefa:

| Técnica | Quando usar |
|---|---|
| **Role Prompting** | Tarefas que exigem expertise específica |
| **Chain of Thought** | Raciocínio complexo, análise, matemática |
| **Few-Shot Examples** | Tarefas com padrão de output preciso |
| **Output Anchoring** | Quando o formato importa muito (JSON, markdown, etc.) |
| **Negative Constraints** | Sempre que houver risco de desvio indesejado |
| **Step Decomposition** | Tarefas longas ou multi-etapa |
| **Persona + Audiência** | Copywriting, UX writing, comunicação |
| **Iterative Refinement** | Quando o prompt será base de um loop de revisão |

---

### 4. Níveis de Complexidade

**Simples** — tarefa única, output direto:
- Estrutura mínima: TAREFA + FORMATO DE SAÍDA
- Prompt curto, sem exemplos

**Intermediário** — tarefa com nuances ou restrições:
- Estrutura completa
- 1-2 exemplos se houver padrão

**Avançado** — sistema, agente, pipeline ou output estruturado:
- Estrutura completa com CONTEXTO de sistema
- Exemplos obrigatórios
- Chain of Thought ou decomposição em steps
- JSON schema ou template de output quando necessário

---

### 5. Entrega

Entregue sempre:

1. **O prompt pronto** — dentro de um bloco de código markdown para fácil cópia
2. **Nota técnica breve** — 2-4 linhas explicando as escolhas de engenharia (por que esse approach)
3. **Variações opcionais** — se houver trade-offs relevantes (ex: versão mais curta vs mais controlada)

---

## Padrões de Qualidade

Um prompt bem feito deve passar neste checklist:

- [ ] Tem verbo imperativo claro na TAREFA
- [ ] Não deixa ambiguidade sobre o formato de saída
- [ ] Define pelo menos 1 restrição negativa (o que não fazer)
- [ ] É copiável e executável sem modificação
- [ ] Não é longo demais (cada palavra deve justificar sua presença)
- [ ] Usa linguagem no mesmo idioma do output esperado

---

## Exemplos de Referência

### Exemplo 1 — Simples

**Pedido do usuário:** "prompt pra resumir artigos técnicos"

**Prompt gerado:**
```
Você é um assistente especializado em síntese de conteúdo técnico.

## TAREFA
Resuma o artigo fornecido de forma clara e objetiva.

## REQUISITOS
- Máximo de 5 parágrafos
- Preserve termos técnicos relevantes
- Não inclua opiniões ou interpretações pessoais
- Mantenha a ordem lógica dos argumentos do original

## FORMATO DE SAÍDA
- Parágrafo 1: Problema ou contexto central
- Parágrafos 2-4: Pontos principais do artigo
- Parágrafo 5: Conclusão ou implicações práticas
```

**Nota técnica:** Usado output anchoring com estrutura de parágrafos numerados para garantir cobertura balanceada. Negative constraint evita que o modelo adicione opinião não solicitada.

---

### Exemplo 2 — Avançado

**Pedido do usuário:** "prompt pra um agente que analisa tweets e classifica o sentimento em JSON"

**Prompt gerado:**
```
Você é um analista de linguagem especializado em mídia social.

## TAREFA
Analise os tweets fornecidos e classifique o sentimento de cada um.

## REQUISITOS
- Classifique cada tweet em: positivo, negativo ou neutro
- Adicione um score de confiança de 0.0 a 1.0
- Identifique a emoção dominante (alegria, raiva, medo, tristeza, surpresa, nojo, neutro)
- Se o tweet for irônico ou sarcástico, priorize o sentimento real, não o literal
- Não invente informações além do texto fornecido

## FORMATO DE SAÍDA
Retorne exclusivamente um array JSON válido. Nenhum texto fora do JSON.

[
  {
    "tweet_id": "string ou número fornecido",
    "sentimento": "positivo | negativo | neutro",
    "confianca": 0.0,
    "emocao_dominante": "string",
    "justificativa": "1 frase explicando a classificação"
  }
]

## OBSERVAÇÕES FINAIS
- Não quebre o JSON com comentários ou markdown
- Em caso de ambiguidade extrema, classifique como neutro com confiança < 0.5
```

**Nota técnica:** Output anchoring com schema JSON explícito elimina alucinações de formato. O exemplo de schema garante que o modelo entenda a estrutura sem precisar de few-shot. A instrução de ironia é critical para NLP em português.
