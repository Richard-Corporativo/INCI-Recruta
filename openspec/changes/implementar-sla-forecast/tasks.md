# Tasks: SLA e Forecast

## 1. Banco de Dados
- [ ] 1.1 Criar tabela `candidate_stage_history`:
    - `candidate_id`, `stage_id`, `entry_time`, `exit_time`, `duration_seconds`.
- [ ] 1.2 Alterar `jobs`: Adicionar campo JSON `sla_settings` (configuração de dias/responsável por etapa).

## 2. Backend
- [ ] 2.1 Atualizar `CandidateService.updateStatus`:
    - Ao mover card, fechar registro anterior em `stage_history` (set `exit_time`) e criar novo (`entry_time`).
- [ ] 2.2 Criar serviço de cálculo de Forecast: Média de duração histórica por etapa vs. etapas restantes.

## 3. Frontend - Configuração
- [ ] 3.1 UI na Criação de Vaga ou Settings: Definir SLA (dias) para cada coluna do Kanban.

## 4. Frontend - Visualização
- [ ] 4.1 Kanban: Mostrar timer no card ("Nesta etapa há X dias").
- [ ] 4.2 Kanban: Aplicar borda/badge colorida (Verde/Amarelo/Vermelho) baseada no SLA configurado.
- [ ] 4.3 Dashboard: Widget "Prioridades do Dia" filtrando cards críticos.
- [ ] 4.4 Dashboard da Vaga: Exibir "Previsão de Fechamento".
