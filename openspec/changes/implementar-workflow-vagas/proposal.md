# Proposta: Workflow de Aprovação e Auditoria de Vagas

## Por que
A publicação direta de vagas gera riscos de erros e desalinhamento estratégico. É necessário um ciclo de aprovação formal. Além disso, a auditoria atual não captura *o que* mudou, dificultando rastreabilidade.

## O que muda
- Máquina de Estados na Vaga: Rascunho -> Pendente -> Aprovada (Publicada).
- Bloqueio de publicação direta por Gestores.
- Auditoria granular (JSON Diff) para Jobs e Roles.

## Impacto
- **Capabilities Afetadas:** `job-workflow` (nova), `audit-system` (nova).
- **Código:** Servidor (triggers/middleware), Service de Logs, UI de Vagas (botões de transição).
