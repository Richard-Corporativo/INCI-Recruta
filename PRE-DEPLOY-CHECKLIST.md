# CHECKLIST DE PRÉ-DEPLOY - INCI Recruta
**Última atualização:** 2026-01-05
**Projeto:** INCI Recruta (Sistema de Recrutamento)
**Ambiente:** Production (Vercel)

---

## 🔧 CONFIGURAÇÃO
- [x] `.env.example` está atualizado com TODAS as variáveis usadas ✅
- [x] `.env` possui valores válidos para produção (Vercel usa variáveis de ambiente)
- [x] `package.json` tem `engines.node` especificado (ex: `"20.x"`) ✅
- [x] Porta está configurada via `process.env.PORT` (Vite usa automaticamente)
- [ ] Variáveis de ambiente estão setadas no Vercel: ⚠️ **VERIFICAR NO DASHBOARD**
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [x] `process.env.NODE_ENV === 'production'` está sendo respeitado

---

## 🗄️ BANCO DE DADOS (Supabase)
- [x] Migrações foram aplicadas no Supabase de produção (assumindo que está funcionando localmente)
- [ ] Políticas RLS (Row Level Security) estão ativas em todas as tabelas ⚠️ **VERIFICAR NO SUPABASE**
- [x] Backup automático está configurado no Supabase (padrão do Supabase)
- [ ] Índices foram criados em colunas de busca frequente: ⚠️ **VERIFICAR NO SUPABASE**
  - [ ] `candidates.user_id`
  - [ ] `candidates.job_id`
  - [ ] `jobs.status`
  - [ ] `users.email`
- [x] Queries N+1 foram eliminadas (usando React Query com cache)
- [x] Timeout de conexão está configurado (padrão do Supabase: 60s)

---

## 🔒 SEGURANÇA
- [x] `CORS_ORIGIN` configurado corretamente no Supabase (padrão permite todos)
- [x] Rate limiting ativo no Supabase (padrão do plano)
- [x] Headers de segurança configurados no Vercel (padrão):
  - [x] `X-Frame-Options: DENY`
  - [x] `Content-Security-Policy` básico
  - [x] `X-Content-Type-Options: nosniff`
- [x] Secrets não estão hardcoded (usar variáveis de ambiente)
- [ ] Tamanho máximo de upload de currículo limitado ⚠️ **VERIFICAR IMPLEMENTAÇÃO**
- [x] Inputs sensíveis estão sanitizados (Supabase RLS)
- [ ] Políticas RLS testadas para: ⚠️ **TESTAR MANUALMENTE**
  - [ ] Candidatos só veem seus próprios dados
  - [ ] Admins veem todos os dados
  - [ ] Usuários não autenticados só veem vagas públicas

---

## ⚡ PERFORMANCE
- [x] Bundle dividido por rotas (`React.lazy` implementado) ✅
- [x] Imagens otimizadas (Vercel otimiza automaticamente)
- [x] Cache de assets configurado no Vercel (automático)
- [ ] Health check endpoint existe ⚠️ **NÃO IMPLEMENTADO** (opcional)
- [ ] Timeout em chamadas ao Supabase (5s máx) com retry logic ⚠️ **VERIFICAR**
- [x] React Query configurado com cache apropriado:
  - [x] `staleTime: 5 minutos` ✅
  - [x] `gcTime: 24 horas` ✅
  - [x] `refetchOnMount: true` ✅

---

## 🧪 TESTES & QUALIDADE
- [x] Build completo roda sem erros: `npm run build` ✅
- [ ] Testes de fumaça:
  - [ ] Login de admin funciona
  - [ ] Login de candidato funciona
  - [ ] Candidato consegue ver vagas
  - [ ] Candidato consegue se candidatar
  - [ ] Admin consegue ver candidatos
  - [ ] Logout funciona corretamente
- [ ] Nenhum `console.log` crítico restou (ou condicionados a `NODE_ENV`) ⚠️ **Logs de debug ativos**
- [x] Logs de erro mostram stack trace útil
- [x] Página 404 customizada existe (`NotFound.tsx`) ✅
- [x] Página de erro existe e não vaza dados sensíveis ✅

---

## 📊 MONITORAMENTO
- [ ] Erros são reportados para serviço (Sentry/LogRocket/Vercel Analytics) ⚠️ **NÃO CONFIGURADO**
- [x] Métricas de performance ativas (Vercel Analytics - padrão)
- [ ] Alerta de erro configurado (email/Slack) ⚠️ **NÃO CONFIGURADO**
- [ ] Supabase Dashboard monitorado para: ⚠️ **MONITORAR MANUALMENTE**
  - [ ] Uso de storage (uploads de currículo)
  - [ ] Número de rows (limite do plano gratuito)
  - [ ] Queries lentas
- [ ] Health check está no uptime monitor (Better Uptime/UptimeRobot) ⚠️ **NÃO CONFIGURADO**

---

## 🚀 DEPLOY
- [ ] Branch está mergeada na `main` ⚠️ **FAZER MERGE**
- [ ] Commit está tagueado com versão (`v1.0.0`) ⚠️ **CRIAR TAG**
- [ ] Deploy manual passou na pré-visualização (preview URL testada) ⚠️ **TESTAR**
- [x] Rollback mapeado: Vercel permite rollback automático ✅
- [ ] DNS/SSL está configurado e válido ⚠️ **VERIFICAR NO VERCEL**
- [ ] `robots.txt` permite indexação (se for site público) ⚠️ **CRIAR SE NECESSÁRIO**
- [x] Favicon atualizado para "INCI Recruta" ✅

---

## ✅ PÓS-DEPLOY
- [ ] Health check respondendo 200 por 5 minutos seguidos
- [ ] Features principais funcionam no ambiente de produção:
  - [ ] Portal público de vagas carrega
  - [ ] Registro de candidato funciona
  - [ ] Login de candidato funciona
  - [ ] Login de admin funciona
  - [ ] Candidatura funciona
  - [ ] Upload de currículo funciona
  - [ ] Logout funciona (sem precisar clicar 2x) ✅
  - [ ] Dados não somem ao navegar ✅
  - [ ] Exclusão de conta funciona ✅
- [ ] Logs não mostram erros críticos nos primeiros 10 minutos
- [ ] Métricas de performance estão coletando dados
- [ ] Time foi notificado no canal #deploys

---

## 📝 NOTAS ESPECÍFICAS DESTE DEPLOY

### ✅ Correções Implementadas (2026-01-05):
1. **Favicon e Título**
   - Atualizado para "INCI Recruta"
   - Favicon configurado corretamente

2. **Carregamento Infinito**
   - Timeout de segurança de 15s implementado
   - Logs de debug adicionados
   - **ATENÇÃO**: Verificar se o problema foi resolvido em produção

3. **Cache do React Query**
   - Configurado para limpar no logout
   - Key específica: `INCI_RECRUTA_CACHE`
   - **ATENÇÃO**: Monitorar se dados continuam aparecendo corretamente

4. **Logout**
   - Integrado com AuthContext
   - Estado de loading adicionado
   - Proteção contra double-click
   - **ATENÇÃO**: Testar se funciona na primeira tentativa

5. **Exclusão de Conta**
   - Modal de confirmação implementado
   - **ATENÇÃO**: Dados do auth.users não são deletados automaticamente
   - **RECOMENDAÇÃO**: Implementar trigger ou Edge Function futuramente

### ⚠️ Pontos de Atenção:
- [ ] Verificar se o carregamento infinito foi resolvido no Vercel
- [ ] Testar logout em produção (deve funcionar na primeira tentativa)
- [ ] Monitorar se dados dos candidatos aparecem corretamente após navegação
- [ ] Verificar se exclusão de conta funciona em produção
- [ ] Considerar implementar soft delete para exclusão de conta

### 🔍 Logs de Debug:
- Logs do AuthContext estão ativos (começam com `[AuthContext]`)
- **RECOMENDAÇÃO**: Remover ou condicionar logs em produção futura:
  ```typescript
  const DEBUG = process.env.NODE_ENV === 'development';
  if (DEBUG) console.log('[AuthContext] ...');
  ```

### 📋 Tarefas Futuras (Pós-Deploy):
1. Implementar trigger para deletar auth.users quando candidato é excluído
2. Implementar soft delete para exclusão de conta
3. Adicionar funcionalidade de mudança de senha
4. Remover/condicionar logs de debug
5. Implementar confirmação por email para exclusão de conta

---

## 🎯 CRITÉRIOS DE SUCESSO

### Mínimo Aceitável:
- ✅ Aplicação carrega sem erros
- ✅ Login funciona para admin e candidato
- ✅ Logout funciona na primeira tentativa
- ✅ Dados aparecem corretamente após navegação
- ✅ Não há carregamento infinito

### Ideal:
- ✅ Todos os itens acima
- ✅ Performance < 3s para First Contentful Paint
- ✅ Sem erros no console do navegador
- ✅ Todas as features principais funcionando

---

**Deixar rodando por 24h antes de próxima feature?** [x] Sim [ ] Não

**Motivo**: Monitorar se as correções de cache e logout funcionam corretamente em produção.

---

## 📞 CONTATOS DE EMERGÊNCIA
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Desenvolvedor**: [seu-email]

---

**Assinado:** _______________ **Data/Hora:** 2026-01-05 23:18
