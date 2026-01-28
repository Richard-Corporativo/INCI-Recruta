# Proposta: Analytics e Dashboard de Diversidade

## Por que
Faltam métricas consolidadas para visão executiva e conformidade ESG. É necessário monitorar a saúde do funil e identificar gargalos de diversidade (evasão por grupo) com total segurança jurídica e anonimato, garantindo processos inclusivos sem expor candidatos individualmente.

## O que muda
- **Dados:** Coleta opcional e segregada de Gênero, Raça/Cor e PcD (Tabela segregada `candidate_demographics`).
- **Segurança:** Implementação de K-anonymity (N ≥ 10) para exibição de dados e bloqueio total de visualização individual.
- **Visualização:** Novo Dashboard de D&I com Funil de Conversão por Grupo e indicadores de "Gap" vs Baseline.

## Impacto
- **Capabilities Afetadas:** `analytics-system` (nova), `candidate-profile-security` (nova).
- **Código:** Criação de tabela segregada, Triggers de LGPD, Views materializadas ou seguras para agregação.
