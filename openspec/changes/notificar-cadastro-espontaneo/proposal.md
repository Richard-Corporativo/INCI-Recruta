# Proposal: Notificações para RH (Cadastros Espontâneos)

## Why
Atualmente, quando um candidato se cadastra no Banco de Talentos (candidatura sem vaga específica), não há alerta imediato para a equipe de recrutamento. Isso pode atrasar a identificação de talentos promissores. Notificações imediatas permitem uma triagem proativa.

## What changes
1.  **Gatilho de Notificação:** Modificar o `CandidateService` para disparar uma notificação quando um candidato for criado sem `job_id`.
2.  **Edge Function:** Criar uma Supabase Edge Function `notify-talent-bank` para processar e enviar o e-mail.
3.  **Proteção contra Spam:** Implementar lógica de debounce/agrupamento na Edge Function para evitar múltiplas notificações do mesmo candidato em curto prazo.
4.  **Configuração:** Utilizar a variável de ambiente `RH_NOTIFICATIONS_EMAIL` para definir o destinatário.

## Impact
- **RH:** Recebe alertas em tempo real sobre novos talentos.
- **Eficiência:** Reduz o tempo de resposta para candidaturas espontâneas.
- **Sistema:** Mantém a lógica de notificação centralizada e segura no backend.
