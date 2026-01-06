# 🚀 Guia de Deploy - INCI Recruta

## ✅ Passos Completados:
1. ✅ `engines.node` adicionado ao `package.json`
2. ✅ `.env.example` atualizado
3. ✅ Build testado e funcionando
4. ✅ Todas as correções implementadas

---

## 📋 Próximos Passos (Execute nesta ordem):

### 1. Verificar Variáveis de Ambiente no Vercel
**Onde**: Vercel Dashboard → Seu Projeto → Settings → Environment Variables

**Variáveis necessárias**:
```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Como obter os valores**:
1. Acesse: https://app.supabase.com/project/_/settings/api
2. Copie "Project URL" → `VITE_SUPABASE_URL`
3. Copie "anon public" key → `VITE_SUPABASE_ANON_KEY`

⚠️ **IMPORTANTE**: Adicione para todos os ambientes (Production, Preview, Development)

---

### 2. Fazer Commit das Alterações

```bash
# Verificar o que foi alterado
git status

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "fix: correções de produção - favicon, logout, cache e exclusão de conta

- Atualizado favicon e título para INCI Recruta
- Corrigido carregamento infinito com timeout de segurança
- Implementado limpeza de cache no logout
- Adicionado funcionalidade de exclusão de conta
- Corrigido botão de logout (não precisa mais clicar 2x)
- Adicionado engines.node no package.json
- Atualizado .env.example"

# Verificar o commit
git log -1
```

---

### 3. Fazer Merge na Branch Main

```bash
# Ver branch atual
git branch

# Se não estiver na main, fazer checkout
git checkout main

# Fazer merge (se estiver em outra branch)
git merge sua-branch-atual

# Ou se já estiver na main, pular este passo
```

---

### 4. Criar Tag de Versão

```bash
# Criar tag anotada
git tag -a v1.0.0 -m "Release v1.0.0 - Correções de produção

Principais mudanças:
- Favicon e título atualizados
- Carregamento infinito corrigido
- Cache limpo no logout
- Exclusão de conta implementada
- Logout funcionando corretamente"

# Verificar tag criada
git tag -l

# Ver detalhes da tag
git show v1.0.0
```

---

### 5. Push para o Repositório

```bash
# Push do código
git push origin main

# Push da tag
git push origin v1.0.0

# Ou push de tudo de uma vez
git push origin main --tags
```

⚠️ **O Vercel vai fazer deploy automaticamente após o push!**

---

### 6. Testar Preview URL

**Onde encontrar**:
1. Acesse Vercel Dashboard
2. Vá para o seu projeto
3. Clique no último deployment
4. Copie a URL de preview (algo como: `inci-recruta-xxx.vercel.app`)

**O que testar**:
- [ ] Aplicação carrega (não fica em "Gerenciando sessão...")
- [ ] Favicon aparece como "INCI Recruta"
- [ ] Login de admin funciona
- [ ] Login de candidato funciona
- [ ] Logout funciona na primeira tentativa
- [ ] Dados aparecem após navegação
- [ ] Exclusão de conta funciona (⚠️ CUIDADO - deleta de verdade!)

---

### 7. Promover para Produção (Se Preview OK)

**Opção 1 - Automático**:
- Se o deploy foi na branch `main`, já está em produção!

**Opção 2 - Manual**:
1. Vercel Dashboard → Deployments
2. Encontre o deployment que testou
3. Clique nos 3 pontinhos → "Promote to Production"

---

## 🔍 Verificações Pós-Deploy

### Imediatamente após deploy:
```bash
# Verificar se está no ar
curl -I https://seu-dominio.vercel.app

# Deve retornar: HTTP/2 200
```

### Nos primeiros 10 minutos:
- [ ] Abrir console do navegador (F12)
- [ ] Verificar se há erros
- [ ] Testar login/logout
- [ ] Verificar se dados carregam

### Nas primeiras 24 horas:
- [ ] Monitorar Vercel Analytics
- [ ] Verificar Supabase Dashboard (uso de recursos)
- [ ] Testar todas as funcionalidades principais

---

## 🆘 Se Algo Der Errado

### Rollback Rápido:
```bash
# Vercel Dashboard → Deployments → Deployment anterior → "Promote to Production"
```

### Ou via CLI:
```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer rollback
vercel rollback
```

---

## 📞 Checklist Final Antes de Promover

- [ ] Preview URL testada e funcionando
- [ ] Sem erros no console do navegador
- [ ] Login/Logout funcionando
- [ ] Dados carregando corretamente
- [ ] Favicon correto
- [ ] Performance aceitável (< 3s para carregar)

---

## 🎉 Após Deploy Bem-Sucedido

1. Atualizar `PRE-DEPLOY-CHECKLIST.md` marcando itens completados
2. Notificar time no canal #deploys
3. Monitorar por 24h
4. Documentar qualquer problema encontrado

---

**Boa sorte com o deploy! 🚀**
