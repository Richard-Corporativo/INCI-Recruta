# Exemplos de Comandos Virtual Phronesis

Todos os exemplos mostram como os comandos devem responder com conteúdo real do usuário, nunca placeholders genéricos.

## 1. Sequência Matinal

### /context
```
/context ~/Documents/knowledge-base
```
**Resposta correta (com conteúdo real):**
```markdown
## Contexto Carregado

### Projetos Ativos (última atualização: 2026-03-22)
1. **API de Pagamentos** - status: em desenvolvimento, último commit: ontem
   - Sua nota de 2026-03-20 diz: "Falta integrar webhook do Stripe"
2. **Blog Pessoal** - status: rascunho, último post: "Por que parei de usar Notion"
   - Você mencionou querer publicar semanalmente (nota de 2026-03-15)
3. **Estudo de Tomismo** - status: contínuo, último livro: "Suma Teológica I-II"

### Prioridades Recentes (mencionadas nos últimos 7 dias)
- "Finalizar módulo de autenticação" (2026-03-20, 2026-03-22)
- "Ler capítulo 5 da Suma" (2026-03-21)
- "Responder email do Marcus sobre o projeto" (2026-03-19)

### Reflexões Recentes
- 2026-03-22: "Estou procrastinando a parte difícil da API"
- 2026-03-20: "Tomismo me ajuda a pensar sobre arquitetura de software"
```

**Resposta incorreta (placeholders genéricos):**
```markdown
### Projetos Ativos
1. [Projeto 1] - [status]
2. [Projeto 2] - [status]
```

### /today
```
/today
```
**Resposta correta:**
```markdown
## Plano para 2026-03-25

Baseado na sua nota de 2026-03-22 ("quero terminar a autenticação até sexta") e nos PRs abertos:

### Prioridades
1. **Finalizar autenticação JWT** - você disse "urgente" em 3 notas diferentes esta semana
   - Subtarefa: integrar refresh token (sua nota de 2026-03-21 diz que "falta isso")
2. **Revisar PR #47 do João** - aberto há 5 dias, você comentou em 2026-03-20: "preciso olhar isso amanhã"
3. **Ler Suma Teológica I-II q.64** - você planejava começar esta semana (nota de 2026-03-18)

### Compromissos
- 10:00 - Daily standup (seu calendário)
- 14:00 - 1:1 com Marcus (seu calendário)

### Alerta
Você mencionou em 2026-03-22: "estou evitando a parte difícil da API". Hoje pode ser o dia de encarar isso.
```

## 2. Conexões Entre Domínios

### /connect
```
/connect "filosofia tomista" "arquitetura de software"
```
**Resposta correta:**
```markdown
## Conexões Encontradas

### Notas que Ligam os Dois Domínios

1. **"Causa Final em APIs"** (2026-03-18)
   - Você escreveu: "Uma API sem causa final clara é como um corpo sem alma"
   - Conecta: teleologia aristotélica → design de endpoints

2. **"Hierarquia de Conceitos como Clean Architecture"** (2026-03-10)
   - Trecho: "Aristóteles organizava conhecimento em hierarquia. Clean Architecture faz o mesmo com código. Coincidência?"
   - Conecta: lógica aristotélica → Onion Architecture

3. **"Virtude e Padrões de Design"** (2026-02-28)
   - Trecho: "SOLID é temperança aplicada a código - remover excesso, manter medida"
   - Conecta: virtudes cardinais → princípios SOLID

### Padrão Identificado
Você consistentemente usa metáforas tomistas para explicar decisões de arquitetura. Isso sugere que seu framework mental para software é influenciado por filosofia aristotélica - não é coincidência, é seu modo de pensar.

### Insight Inesperado
Sua nota de 2026-03-05 sobre "burocracia cognitiva" aparece tanto em reflexões sobre processos de código quanto em notas sobre estudo. Talvez o problema não seja a ferramenta, mas a falta de causa final clara em ambos.
```

## 3. Geração de Ideias

### /ideas
```
/ideas
```
**Resposta correta:**
```markdown
## Ideias Baseadas nos Seus Padrões

### Ferramentas para Construir
1. **CLI que aplica phronesis a decisões de código**
   - Por quê: Você tem 8 notas sobre "automação ética" e 5 sobre "ferramentas CLI". A intersecção é clara.
   - Nota-chave: 2026-03-15 - "Queria uma ferramenta que me perguntasse 'por que' antes de automatizar"

2. **Plugin de vim que mostra genealogia de conceitos**
   - Por quê: Você usa vim (vi em 12 notas), estuda tomismo (15 notas), e mencionou "rastrear evolução" 4 vezes

### Pessoas para Conhecer
1. **Comunidade de Philosophy of Software Engineering**
   - Conexão: suas notas sobre "epistemologia de código" (2026-02-20) e "DDD como ontologia" (2026-03-01)

### Assuntos para Investigar
1. **Ética de Agentes Autônomos**
   - O que você já sabe: limites da delegação (nota 2026-01-10), primazia do julgamento humano (nota 2026-02-15)
   - O que falta: framework prático para decisões em tempo real com múltiplos agentes

### Coisas para Escrever
1. **"Por Que Programadores Precisam de Filosofia"**
   - Ângulo: phronesis como skill de engenharia, não apenas humanística
   - Suporte: você tem 15 notas conectando "pensamento sistêmico" e "ética de código"
   - Sua própria frase (2026-03-12): "Código sem filosofia é craft sem propósito"
```

## 4. Graduação de Ideias

### /graduate
```
/graduate
```
**Resposta correta:**
```markdown
## Ideias das Suas Notas Diárias (últimos 14 dias)

### 1. "Automação como Serviço à Virtude"
- **Origem**: Nota de 2026-03-18, 23:14
- **Trecho original**: "Por que automatizar X parece vazio? Ah, porque não serve a nenhuma virtude. É eficiência por eficiência."
- **Conexões**: suas notas "Ética da Automação" (2026-01-10) e "Limites da Delegação" (2026-02-15)
- **Potencial**: Artigo curto ou thread. O insight é original.

### 2. "DDD como Ontologia Aristotélica"
- **Origem**: Nota de 2026-03-22, 09:30
- **Trecho original**: "Bounded contexts são como gêneros aristotélicos - cada um com suas próprias categorias"
- **Conexões**: "Hierarquia de Conceitos" (2026-03-10), "Lógica e Código" (2026-02-05)
- **Potencial**: Talk ou post. Você tem material suficiente para 30 minutos de apresentação.
```

## 5. Teste de Crenças

### /challenge
```
/challenge "IA vai substituir programadores em 2 anos"
```
**Resposta correta:**
```markdown
## Análise da Sua Posição

### Sua Posição Atual
"IA vai substituir programadores em 2 anos"

### Suas Próprias Notas Contradizem Isso

1. **2026-03-20**: "Phronesis é o que a IA não pode simular. Julgamento final é humano."
   - Você mesmo diz que julgamento não é delegável.

2. **2026-03-15**: "A IA me ajudou a escrever código mais rápido, mas a decisão do QUE escrever foi 100% minha"
   - Você reconhece que a IA acelera, mas não decide.

3. **2026-02-28**: "Automação sem phronesis é cega"
   - Se a IA substituísse programadores, quem teria phronesis?

### Consistência: 35%

### Perguntas para Você
- Se a IA substituir programadores, quem fará o julgamento ético sobre o código?
- Você mencionou 7 vezes que "decisões finais são humanas" - isso contradiz "substituição total"
- Sua nota de 2026-03-10 diz "IA é ferramenta, não agente" - mudou de ideia? Por quê?
```

## 6. Genealogia de Conceito

### /trace
```
/trace "phronesis"
```
**Resposta correta:**
```markdown
## Evolução de "Phronesis" no Seu Repositório

### Primeira Menção
- **2025-08-12**, nota "Estudo Aristóteles"
- Trecho: "Phronesis = sabedoria prática. Diferente de sophia (teórica). Interessante para decisões de código."

### Linha do Tempo

**Fase 1: Curiosidade Intelectual (Ago-Out 2025)**
- 7 notas, todas acadêmicas
- Foco: definições, distinções entre phronesis/sophia/episteme

**Fase 2: Aplicação Prática (Nov-Dez 2025)**
- 12 notas, começando a conectar com tecnologia
- Nota-chave (2025-11-15): "PHRONESIS É O QUE A IA NÃO PODE SIMULAR" (em caps, você estava empolgado)
- Conexão com dilemas de IA aparece pela primeira vez

**Fase 3: Framework Pessoal (Jan 2026-Atual)**
- 23 notas, agora integrado ao seu dia a dia
- Você usa phronesis como critério para avaliar ferramentas
- Nota de 2026-03-01: "Phronesis virou meu filtro mental para tudo"

### Momentos que Mudaram Seu Pensamento
1. **2025-11-15**: Insight repentino - phronesis como antídoto à idolatria tecnológica
2. **2026-01-10**: Conexão com "burocracia cognitiva" - phronesis impede burocracia
3. **2026-03-01**: Integração total - phronesis como filtro para decisões diárias

### Estado Atual
Você não estuda mais phronesis - você a aplica. Suas últimas 5 notas usam o conceito naturalmente, sem explicar o que é.
```

## 7. Drift e Temas Não Articulados

### /drift
```
/drift
```
**Resposta correta:**
```markdown
## O Que Seu Subconsciente Está Circulando

### Temas que Aparecem sem Fio Conector

1. **"Sistemas"** - aparece em 14 notas de contextos diferentes
   - Código: "sistema de autenticação" (2026-03-20)
   - Filosofia: "sistemas de pensamento" (2026-03-15)
   - Pessoal: "sistema de organização" (2026-03-10)
   - **Interpretação**: Você está buscando um princípio unificador. Talvez seja hora de articular o que "sistema" significa para você.

2. **"Limites"** - frase recorrente em 9 notas
   - "Limites da automação" (2026-03-18)
   - "Limites da delegação" (2026-03-12)
   - "Preciso de limites claros" (2026-03-05)
   - **Interpretação**: Você está tentando definir fronteiras - onde termina a ferramenta e começa o humano?

### Intenções vs. Comportamento

| Você disse (nota de 2026-03-01) | O que fez (últimos 30 dias) | Gap |
|---|---|---|
| "2h/dia de estudo profundo" | Média: 45min | -62% |
| "Publicar 1 post/semana" | 2 posts em 30 dias | -83% |
| "Revisar PRs em 24h" | Média: 3.2 dias | -220% |

### Trabalho Evitado
- Revisão do módulo de pagamentos (nota de 2026-03-10 diz "preciso revisar", nunca revisou)
- Conversa sobre prazos com o Marcus (mencionada em 2026-03-15, adiada 3x)

### Racionalização Detectada
Você escreveu em 2026-03-18: "Estou focado em prioridades mais urgentes". Mas suas notas mostram que as "prioridades urgentes" eram tarefas confortáveis, não as difíceis.
```

## 8. Resposta no Seu Estilo

### /ghost
```
/ghost "O que você acha sobre usar IA para escrever?"
```
**Resposta correta:**
```markdown
## Como Você Responderia

Baseado nas suas 23 notas sobre IA e escrita, seu estilo é: direto, usa metáforas de engenharia, busca causa final.

### Sua Resposta Provável

"Usar IA para escrever é como usar calculadora pra matemática - a ferramenta executa, mas o julgamento é seu. O problema não é a ferramenta, é quando você delega o ato de pensar. Escrever é cristalizar pensamento. Se você delega a escrita, delega o pensamento. E phronesis não se delega."

### Fontes
- Sua metáfora favorita: "ferramenta vs. mestre" (aparece em 8 notas)
- Sua frase de 2026-03-12: "Escrever é cristalizar pensamento"
- Sua posição recorrente: "Julgamento final é humano" (11 notas)
```

## 9. Encerramento do Dia

### /close-day
```
/close-day
```
**Resposta correta:**
```markdown
## Encerramento - 2026-03-25

### O Que Você Fez Hoje (baseado em commits e notas)
- Commit às 11:23: "feat: add JWT refresh token endpoint" - você finalizou a autenticação!
- Nota às 14:30: "Reunião com Marcus ok. Ele quer mudar o escopo do projeto X"
- Commit às 16:45: "fix: handle edge case in token validation"

### Insights de Hoje
- Sua nota das 11:25 diz: "A parte difícil não era tão difícil. Era medo de falhar."
- Isso conecta com sua nota de 2026-03-22 ("estou evitando a parte difícil") - você encarou o que evitava.

### Hipóteses Ajustadas
- "Autenticação vai levar mais 2 semanas" → Na verdade levou 1 dia quando você focou
- Sua confiança na estimativa: reduzida (você superestimou a dificuldade)

### Para Amanhã
- Responder ao Marcus sobre mudança de escopo (você disse que responderia hoje, não respondeu)
- PR #47 ainda precisa de revisão (aberto há 6 dias agora)

### Reflexão
Você cumpriu a prioridade que definiu em 2026-03-22 ("terminar autenticação até sexta"). Mas negligenciou a comunicação com a equipe. A virtude de hoje: **perseverança**. A que faltou: **justiça** (para com o Marcus, que espera resposta).
```
