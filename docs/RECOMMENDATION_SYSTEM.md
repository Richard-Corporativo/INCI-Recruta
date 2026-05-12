# Algoritmo das 3 Primeiras Vagas (Job Recommendation)

## 1. O Que É
O **Algoritmo das 3 Primeiras Vagas** é um sistema de recomendação determinístico e performático, executado diretamente no banco de dados (Supabase Postgres). Ele calcula um índice de compatibilidade (Score 0-100) entre um candidato e as vagas ativas, priorizando as 3 melhores oportunidades para exibição imediata no Dashboard e na Listagem de Vagas.

**Diferencial**: É totalmente gratuito (sem uso de APIs de IA/LLM) e baseado em dados estruturados do perfil.

---

## 2. O Que Foi Feito
1.  **Schema do Banco**: Adicionada a coluna `desired_work_model` na tabela `candidates`.
2.  **Lógica de Score (RPC)**: Criação da função `get_recommended_jobs_for_candidate` que avalia:
    *   **Habilidades (45 pts)**: Cruzamento de palavras-chave entre o perfil e os requisitos da vaga.
    *   **Localização (20 pts)**: Vagas remotas recebem pontuação cheia; vagas presenciais comparam cidade/estado.
    *   **Senioridade (15 pts)**: Comparação entre o nível atual do candidato e a exigência da vaga.
    *   **Disponibilidade (10 pts)**: Match entre o aviso prévio do candidato e a urgência da vaga.
    *   **Modalidade (10 pts)**: Match entre a preferência do candidato (Híbrido/Remoto/Presencial) e o modelo da vaga.
3.  **Interface de Configuração**: Inclusão do seletor de "Modalidade Desejada" nas configurações de perfil do candidato.
4.  **Camada de Dados (Frontend)**: Criação de um Service e um Custom Hook (`useRecommendedJobs`) para gerenciar estados de carregamento e fallbacks.
5.  **UI/UX**: Implementação do bloco visual com anel de progresso (score), motivos do match (auditável) e design responsivo.

---

## 3. O Que o Dev Precisa Saber e Localização

### Arquivos Principais:
*   **Lógica SQL (RPC)**: `/supabase/migrations/20260504_job_recommendations_rpc.sql`
*   **Serviço de Dados**: `src/services/recommendation.service.ts`
*   **Hook de Reutilização**: `src/hooks/useRecommendedJobs.ts`
*   **Componente Visual**: `src/components/candidate/RecommendedJobsBlock.tsx`
*   **Integração Dashboard**: `src/views/candidate/CandidateDashboard.tsx`
*   **Integração Listagem Pública**: `src/views/public/JobsList.tsx`

---

## 4. Performance do Banco
Atualmente, o algoritmo usa buscas de texto (`ILIKE`) para comparar habilidades. Para garantir performance com o crescimento da base:
*   **Índices**: Recomenda-se criar índices `B-Tree` nas colunas `location`, `seniority` e `status` da tabela `jobs`.
*   **Trigramas (Opcional)**: Se houver lentidão na busca de skills, podemos ativar a extensão `pg_trgm` do Postgres para buscas de texto ultra-rápidas.

---

## 5. Gamificação (Próximos Passos)
A estrutura já está preparada para incentivar o usuário:
*   **Profile Completeness**: O componente avisa quando faltam dados (Skills/Localização) para gerar recomendações personalizadas.
*   **Badges de Match**: O sistema exibe o "porquê" do match (ex: "Mesmo Estado", "Habilidades compatíveis"), o que gera confiança e aumenta a taxa de cliques (CTR).
*   **Ranking**: O uso de `#1`, `#2`, `#3` no design cria um senso de exclusividade e urgência.
