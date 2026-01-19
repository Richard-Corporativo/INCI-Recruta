# Proposta: Implementar Banco de Talentos e Portal do Candidato Expandido

## Por que
Atualmente, o sistema exige que todo candidato esteja vinculado a uma vaga específica (`jobId`). Isso impede a criação de um "Banco de Talentos" (candidatura espontânea) e limita a estratégia de recrutamento passivo. Além disso, a definição salarial está rígida no Cargo, quando deveria ser flexível na Vaga.

## O que muda
- Permitir candidatos sem `jobId` (Banco de Talentos).
- Refatorar a UI de candidatura para suportar fluxo "Espontâneo".
- Migrar definição de salário de `Roles` para `Jobs`.
- Ajustar persistência e filtros para incluir candidatos do pool geral.

## Impacto
- **Capabilities Afetadas:** `candidate-portal`, `job-structure` (nova), `role-structure` (nova).
- **Código:** Schema do banco (`candidates`, `jobs`, `roles`), API de cadastro, UI do Portal.
