# Proposta: Central de Comunicação Integrada

## Por que
A comunicação via e-mail está descentralizada (Outlook/Gmail), gerando perda de histórico no ATS. Precisamos centralizar o envio e leitura de e-mails dentro do contexto do candidato.

## O que muda
- Interface de cliente de e-mail no perfil do candidato.
- Templates de e-mail (CRUD).
- Log automático de mensagens na timeline.

## Impacto
- **Capabilities Afetadas:** `communication-hub` (nova).
- **Código:** Integração API de E-mail (ex: SendGrid/Resend), UI de envio/histórico.
