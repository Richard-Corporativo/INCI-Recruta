# Virtual Phronesis — Second Brain Commands

Framework de 12 comandos slash para transformar seu repositório de conhecimento pessoal em uma ferramenta de pensamento.

## Regra Fundamental

**NUNCA retorne placeholders genéricos.** Cada comando lê os arquivos REAIS do usuário e retorna dados contextualizados com trechos, datas e fontes específicas.

## Os 12 Comandos

### Operacionais
| Comando | Função |
|---------|--------|
| **/context** | Carrega estado real: projetos, prioridades, reflexões (com trechos e datas) |
| **/today** | Plano do dia baseado em menções reais e calendário |
| **/close-day** | Captura do que ACONTECEU (commits, notas, horários) |
| **/schedule** | Alocação de tempo com justificativa baseada em notas |

### Cognitivos
| Comando | Função |
|---------|--------|
| **/ghost** | Responder no estilo real do usuário (análise de escrita) |
| **/challenge** | Testar crenças contra histórico real (contradições citadas) |
| **/connect** | Conectar domínios com notas reais que ligam ambos |
| **/emerge** | Identificar clusters de ideias com notas específicas |

### Criativos
| Comando | Função |
|---------|--------|
| **/ideas** | Gerar ideias com nota de suporte real para cada uma |
| **/graduate** | Promover ideias com trecho exato da nota original |
| **/drift** | Revelar temas com notas onde aparecem |
| **/trace** | Rastrear evolução com trechos de cada fase |

## Como Responder

### Correto (conteúdo real)
```markdown
### Prioridades (baseado na sua nota de 2026-03-20)
1. Finalizar autenticação JWT - você mencionou "urgente" 3 vezes esta semana
2. Revisar PR #47 - aberto há 5 dias, você disse em 2026-03-20: "preciso olhar"
```

### Incorreto (placeholder genérico)
```markdown
### Prioridades
1. [Tarefa mais importante]
2. [Segunda prioridade]
```

## Estrutura

```
virtual-phronesis/
├── SKILL.md              # Framework principal (12 comandos + regras)
├── scripts/commands.py   # Classes com instruções de leitura real
├── references/examples.md # Exemplos com conteúdo contextualizado
├── evals/evals.json      # 12 eval cases (expected: conteúdo real)
└── README.md             # Este arquivo
```

## Filosofia

1. **Lógica Tomista** - Appreensão → Concepção → Julgamento
2. **Ética das Virtudes** - Phronesis como sabedoria prática
3. **Anti-Burocracia** - Eliminar red tape cognitivo
4. **Autonomia Humana** - IA como ferramenta, não agente moral
5. **Contexto Real** - Sempre trabalhar com dados do usuário, nunca inventar
