# 📋 Checklist de Deploy - Vercel

## ✅ Pré-requisitos

### 1. Variáveis de Ambiente
Antes de fazer o deploy, configure as seguintes variáveis de ambiente no painel da Vercel:

- [ ] `VITE_SUPABASE_URL` - URL do seu projeto Supabase
- [ ] `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

**Como obter as credenciais do Supabase:**
1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em `Settings` → `API`
4. Copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 2. Configuração do Projeto
- [x] `.gitignore` criado (exclui `.env`, `node_modules`, `dist`)
- [x] `vercel.json` configurado com rewrites para SPA
- [x] `package.json` com scripts de build corretos
- [ ] Código commitado no Git
- [ ] Repositório no GitHub/GitLab/Bitbucket

---

## 🚀 Passos para Deploy

### Opção A: Deploy via Vercel CLI

1. **Instalar Vercel CLI** (se ainda não tiver):
   ```bash
   npm install -g vercel
   ```

2. **Login na Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Na primeira vez, responda as perguntas de configuração
   - Para deploy de produção: `vercel --prod`

### Opção B: Deploy via Dashboard da Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em "Deploy"

---

## 🔧 Configurações da Vercel

### Build Settings (já configurado no vercel.json)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
Configure no painel da Vercel em: `Settings` → `Environment Variables`

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ Pós-Deploy

### 1. Verificar Build
- [ ] Build completou sem erros
- [ ] Aplicação está acessível na URL da Vercel

### 2. Testar Funcionalidades
- [ ] Login/Logout funciona
- [ ] Conexão com Supabase está OK
- [ ] Rotas estão funcionando (SPA routing)
- [ ] Assets estão carregando corretamente

### 3. Configurar Domínio (Opcional)
1. Vá em `Settings` → `Domains`
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### 4. Configurar Supabase
Adicione a URL do seu deploy na whitelist do Supabase:

1. Acesse Supabase Dashboard
2. Vá em `Authentication` → `URL Configuration`
3. Adicione sua URL da Vercel em:
   - **Site URL**: `https://seu-projeto.vercel.app`
   - **Redirect URLs**: `https://seu-projeto.vercel.app/**`

---

## 🐛 Troubleshooting

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Rode `npm run build` localmente para testar
- Verifique logs de build na Vercel

### Variáveis de ambiente não funcionam
- Certifique-se de que começam com `VITE_`
- Re-deploy após adicionar variáveis
- Verifique se estão configuradas para "Production"

### Rotas 404
- Verifique se `vercel.json` tem os rewrites corretos
- Confirme que está usando React Router corretamente

### Supabase não conecta
- Verifique se as variáveis de ambiente estão corretas
- Confirme que a URL da Vercel está na whitelist do Supabase
- Verifique CORS no Supabase

---

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Vite + Vercel](https://vercel.com/docs/frameworks/vite)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/quickstarts/vercel)

---

## 🎉 Deploy Completo!

Após seguir todos os passos, seu projeto estará no ar! 🚀

**URL de produção**: `https://seu-projeto.vercel.app`
