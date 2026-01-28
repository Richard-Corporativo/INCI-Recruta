# Design: Notificações para RH

## Architectural Pattern
Utilizaremos chamadas via `supabase.functions.invoke` no frontend (via `CandidateService`) após a inserção bem-sucedida de um candidato sem vaga. 

### Why not Database Webhooks?
Embora Webhooks de Banco de Dados sejam uma opção, a invocação direta permite passar informações de contexto de forma mais simples e lidar com a lógica de e-mail sem precisar monitorar a tabela de candidatos para todas as inserções (evitando ruído em candidaturas normais).

## Components
1.  **Frontend (`CandidateService.ts`):** 
    - Após `addCandidate`, se `jobId` for nulo, chama a função `notify-talent-bank`.
2.  **Edge Function (`notify-talent-bank`):**
    - **Tecnologia:** Deno (TypeScript).
    - **Email Service:** Recomendamos Resend ou Postmark. Como o projeto não tem um provedor definido, implementaremos uma estrutura flexível onde o API Key pode ser injetado.
    - **Debounce:** Guardaremos um log temporário ou apenas verificaremos a data da última notificação do mesmo e-mail para evitar spam.

## Security
- A Edge Function validará o JWT do usuário ou uma chave de serviço para garantir que apenas chamadas legítimas disparem e-mails.
- Dados sensíveis (API Keys) serão configurados apenas via Supabase Secrets.
