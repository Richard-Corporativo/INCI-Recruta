# Design: implement-conversion-ux-playbook

## UX Architecture
A otimização seguirá o framework do Playbook focado em três pilares:
1. **Clareza de Intenção**: Garantir que a proposta de valor seja compreensível em 5 segundos.
2. **Redução de Carga Cognitiva**: Uso de Grid de 8px e Lei da Proximidade para agrupar informações relacionadas.
3. **Escaneabilidade**: Aplicação de padrões de leitura F e Z.

## Visual Strategy
- **Hierarquia Cromática**: A cor `primary` será reservada estritamente para CTAs de conversão. Elementos de navegação usarão tons de `muted` ou `accent`.
- **Fórmulas de Copy**: CTAs serão atualizados de termos genéricos ("Entrar", "Salvar") para termos orientados a benefício ("Acessar meu Painel", "Publicar Vaga Agora").
- **Fricção Reversa**: Formulários de candidatura serão revisados para layout de coluna única com labels externos, otimizando o preenchimento em dispositivos móveis.

## Technical Considerations
- **Performance**: Implementação de Skeleton Screens em `Jobs.tsx` e `Dashboard.tsx` para melhorar a percepção de velocidade.
- **Acessibilidade (WCAG)**: Garantia de contraste 4.5:1 em todos os novos estados de hover e focus.
- **Micro-interações**: Uso de Framer Motion (ou transições CSS padronizadas) para feedbacks de submissão de formulário.
