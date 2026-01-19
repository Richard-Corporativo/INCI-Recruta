# Proposta: Inteligência de Tempo (SLA) e Forecast

## Por que
O processo atual é baseado em "achismo". Precisamos de dados reais sobre o tempo de cada etapa para identificar gargalos e prever fechamentos, além de alertas visuais (SLA) para garantir cadência e responsabilidade.

## O que muda
- Rastreamento de tempo de permanência em cada coluna do Kanban (`candidate_stage_history`).
- Configuração de SLA (dias) por etapa e responsável.
- Indicadores visuais: Semáforo (Verde/Amarelo/Vermelho) nos cards.
- Previsão de fechamento baseada em médias históricas.
- Widget "Prioridades do Dia".

## Impacto
- **Capabilities Afetadas:** `process-intelligence` (nova), `kanban-management`.
- **Código:** Logic de trânsito de etapa (Kanban), Schema DB, UI Dashboard/Kanban.
