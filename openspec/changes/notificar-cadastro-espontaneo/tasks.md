# Tasks: Notificações para RH

## 1. Setup da Infraestrutura
- [x] 1.1 Criar estrutura da Edge Function `notify-talent-bank` (Pasta `supabase/functions/`).
- [x] 1.2 Implementar lógica de envio de e-mail (Template HTML com dados do candidato).
- [x] 1.3 Implementar lógica de debounce/supressão de duplicados.

## 2. Integração Frontend
- [x] 2.1 Modificar `src/services/CandidateService.ts` para invocar a Edge Function após sucesso no `addCandidate` (apenas se `jobId` for NULL).
- [x] 2.2 Garantir que erros na notificação não impeçam o sucesso do cadastro do candidato (falha silenciosa para o usuário, log para o sistema).

## 3. Configuração de Ambiente
- [x] 3.1 Adicionar `RH_NOTIFICATIONS_EMAIL` ao `.env.example`.
- [x] 3.2 Documentar necessidade de configurar `RESEND_API_KEY` (ou similar) no Supabase Secrets para o envio real.

## 4. Validação
- [x] 4.1 Testar fluxo de cadastro espontâneo e verificar logs da Edge Function.
- [x] 4.2 Verificar link direto para o perfil no admin gerado no corpo do e-mail.
