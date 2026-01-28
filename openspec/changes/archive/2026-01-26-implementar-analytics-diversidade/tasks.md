# Tasks: Analytics e Diversidade

## 1. Banco de Dados & Segurança
- [x] 1.1 Criar tabela `candidate_demographics` (1:1 com candidates, ON DELETE CASCADE).
- [x] 1.2 Implementar RLS: Bloquear `SELECT` público. Permitir `INSERT` pelo próprio user.
- [x] 1.3 Criar Secure View ou RPC `get_funnel_diversity_metrics` que implementa a lógica `IF count < 10 THEN null`.
- [x] 1.4 Criar tabela `audit_logs` (se necessário) ou trigger para logar acesso a dados sensíveis.

## 2. Frontend - Coleta Ética
- [x] 2.1 Formulário de Candidatura: Adicionar passo/bloco "Diversidade" (Opcional).
- [x] 2.2 Disclaimer LGPD: "Dados usados apenas estatisticamente...".
- [x] 2.3 Integração: Salvar dados na tabela `candidate_demographics` via service segregado.

## 3. Frontend - Dashboards & Governança
- [ ] 3.1 Criar Página `Analytics` (acesso restrito a Admin/RH Manager).
- [ ] 3.2 Implementar Widget "Funil de Conversão por Grupo" (Dados da RPC segura).
- [ ] 3.3 Implementar Widget "Gaps vs Baseline" (Diferença % entre grupos).
- [ ] 3.4 Validar Regra de Omissão: Testar com < 10 candidatos e garantir que mostra "Dados Insuficientes".
- [ ] 3.5 Garantia de Bloqueio: Verificar se Cards/Perfil de candidato NÃO mostram dados demográficos.

