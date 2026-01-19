# Tasks: Workflow e Auditoria

## 1. Banco de Dados
- [ ] 1.1 Alterar `jobs`: adicionar `workflow_status` (enum: 'draft', 'pending_approval', 'approved', 'published', 'archived').
- [ ] 1.2 Alterar `audit_logs` ou criar nova tabela: suporte a JSONB para `old_value` e `new_value`.

## 2. Backend / Lógica
- [ ] 2.1 Implementar State Machine no `JobService`:
    - Validar transições (ex: Draft -> Published requer role Admin/Quality).
- [ ] 2.2 Implementar Logger de Diff: Função que compara estados antes/depois do update e grava o delta.

## 3. Frontend
- [ ] 3.1 UI de Vagas: Botões de ação baseados no status atual (ex: "Enviar para Aprovação", "Aprovar e Publicar").
- [ ] 3.2 UI de Auditoria: Aba "Histórico" no detalhe da Vaga mostrando diff visual (De -> Para).
