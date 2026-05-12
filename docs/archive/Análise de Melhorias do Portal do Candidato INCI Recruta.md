# Análise

# **Análise de Melhorias do Portal do Candidato INCI Recruta**

**Nível de confiança:**

* **Alto** para análise do código e arquitetura.  
* **Médio** para segurança real de dados, porque não validei políticas aplicadas no Supabase remoto.  
* **Médio** para UX visual.

**O que já existe:**

* Portal público com listagem de vagas, filtros, detalhe da vaga e formulário de candidatura.  
* Portal do candidato com perfil, candidaturas, favoritos, configurações, upload de currículo, avatar e recomendações determinísticas.  
* Backend Supabase com Auth, tabelas de candidatos, vagas, favoritos, currículos, avatares, auditoria e RPC de recomendação.  
* Fluxo admin conectado ao mesmo modelo de candidatos e vagas.

**Problemas que travam evolução segura:**

* O build falha em src/app/(admin)/layout.tsx (line 1), por hooks em layout sem "use client".  
* Há documentação desatualizada: README.md (line 1\) ainda descreve Vite/React Router, mas o projeto atual é Next App Router.  
* Existem services duplicados por casing: CandidateService.ts e candidate.service.ts, JobService.ts e job.service.ts. Isso aumenta risco de bug intermitente no Antigravity.  
* useCandidateData busca todos os candidatos e filtra no cliente. Com volume maior, isso vira gargalo e depende demais de RLS.  
* O middleware redireciona candidato para /perfil, mas a área real é /candidate/dashboard.  
* O fallback de Auth assume admin se não achar perfil no banco. Isso é risco crítico.  
* Cadastro público de empresa define role: recruiter via metadata. Isso precisa de aprovação manual ou fluxo separado.  
* A migration de avatar permite Public can view avatars com USING (true), inadequado para dados pessoais.  
* Currículos e avatares estão em bytea no banco. Funciona para baixo volume, mas é ruim para escala, custo, tráfego e performance.

# Tarefas

1. **Baseline técnico obrigatório:**  
   * Corrigir o build.  
   * Definir outputFileTracingRoot ou resolver lockfiles múltiplos.  
   * Atualizar README, ARCHITECTURE e SYSTEM\_MAP para refletirem Next.js atual.  
   * Padronizar services canônicos em minúsculo: candidate.service.ts, job.service.ts, user.service.ts, role.service.ts, [audit.service.ts](http://audit.service.ts).

2. **Segurança de autenticação e autorização:**  
   * Alterar fallback do Auth para candidate ou acesso negado, nunca admin.  
   * Corrigir middleware para redirecionar candidatos para /candidate/dashboard.  
   * Validar role pelo banco e RLS, não confiar em user\_metadata.  
   * Bloquear auto cadastro público como recruiter sem aprovação.  
   * Criar checklist RLS para users, candidates, candidate\_resumes, candidate\_avatars, candidate\_saved\_jobs, jobs, feedbacks.

3. **Segurança de dados pessoais:**  
   * Remover leitura pública de avatares em candidate\_avatars.  
   * Migrar currículo e avatar para Supabase Storage privado com paths por usuário.  
   * Manter metadados no banco, não o arquivo inteiro.  
   * Implementar download por URL assinada ou rota controlada.  
   * Revisar logs para não expor e-mail, telefone, currículo ou dados sensíveis em console.

4. **Backend e dados:**  
   * Trocar busca de todos os candidatos por queries filtradas no servidor: user\_id, job\_id, status e paginação.  
   * Separar melhor perfil base do candidato e candidaturas por vaga, mesmo que inicialmente ainda use a tabela atual.  
   * Garantir índice para candidates.user\_id, candidates.job\_id, jobs.status, jobs.workflow\_status, candidate\_saved\_jobs.user\_id.  
   * Adicionar prevenção de candidatura duplicada por usuário e vaga.

5. **Frontend do Portal do Candidato:**  
   * Manter dashboard enxuto: completude, perfil, recomendações e ações rápidas.  
   * Melhorar “Minhas Candidaturas” com visão inspirada no Job Tracker: salvas, inscritas, entrevistas, finalizadas e arquivadas.  
   * Adicionar status legível e próximo passo por candidatura, sem expor lógica interna do Kanban admin.  
   * Ajustar “Favoritas” para carregamento paginado e vazio mais acionável.  
   * Remover CTAs duplicados ou excessivos.

6. **Integrações necessárias:**  
   * Configurar notificações por e-mail para eventos mínimos: candidatura recebida, mudança relevante de etapa, encerramento e atualização de currículo.  
   * Tratar WhatsApp como preferência futura, não como integração obrigatória agora.  
   * Validar OAuth Google e LinkedIn apenas se o perfil em public.users for criado com role segura.  
   * Melhorar Edge Function notify-talent-bank: CORS restrito, sanitização de conteúdo e logs sem PII excessiva.

7. **Performance:**  
   * Filtrar vagas no backend ou criar RPC paginada para vagas públicas.  
   * Aplicar debounce real nos filtros de busca.  
   * Evitar JobService.getJobs() para buscar favoritos; buscar somente IDs salvos.  
   * Medir: build limpo, LCP menor que 2.5s, INP menor que 200ms, consultas principais abaixo de 300ms no Supabase.

8. **Testes e aceite:**  
   * npm run build passa sem erro.  
   * Candidato não acessa Admin.  
   * Admin não cai no Portal do Candidato.  
   * Candidato só vê seus dados.  
   * Candidato consegue salvar vaga, candidatar-se, desistir e atualizar perfil.  
   * RLS bloqueia acesso cruzado entre candidatos.  
   * Upload de currículo aceita só PDF e respeita limite.  
   * Vagas encerradas ou fora do prazo não aceitam candidatura.

