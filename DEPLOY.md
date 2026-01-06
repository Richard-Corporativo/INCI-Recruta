# Deploy na Vercel - Sistema de Recrutamento

## ✅ Status do Projeto

O projeto está **pronto para deploy** na Vercel!

- ✅ Build de produção funcionando (`npm run build`)
- ✅ Configuração Vercel (`vercel.json`) para SPA routing
- ✅ Variáveis de ambiente documentadas (`.env.example`)
- ✅ Dependências atualizadas

---

## 🚀 Como Fazer Deploy

### **Opção 1: Deploy via Vercel Dashboard (Recomendado)**

1. Faça push do código para o GitHub:
   ```bash
   git add .
   git commit -m "Preparado para deploy na Vercel"
   git push origin main
   ```

2. Acesse [vercel.com](https://vercel.com) e faça login

3. Clique em **"Add New Project"**

4. Importe o repositório do GitHub

5. Configure as **Environment Variables** no painel da Vercel:
   - `VITE_SUPABASE_URL` → Sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` → Sua chave anônima do Supabase

6. Clique em **Deploy**

---

### **Opção 2: Deploy via CLI**

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

---

## 🔐 Variáveis de Ambiente Necessárias

Configure estas variáveis no painel da Vercel (Project Settings → Environment Variables):

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública do Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**⚠️ Importante:** Não commite o arquivo `.env` no Git! Ele já está no `.gitignore`.

---

## 📋 Checklist Pré-Deploy

- [x] Build local funcionando (`npm run build`)
- [x] Rotas configuradas no `vercel.json`
- [x] Variáveis de ambiente documentadas
- [x] `.gitignore` protegendo arquivos sensíveis
- [x] Código commitado no repositório

---

## 🔧 Configurações do Projeto

### **Framework Preset**
- Framework: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### **Routing**
O arquivo `vercel.json` já está configurado para redirecionar todas as rotas para `index.html` (necessário para SPAs com React Router).

---

## 🌐 Após o Deploy

1. **Teste todas as funcionalidades:**
   - Login de admin
   - Login de candidato
   - Aplicação para vagas
   - Painel administrativo

2. **Configure domínio customizado** (opcional):
   - Acesse Project Settings → Domains
   - Adicione seu domínio

3. **Monitore logs e analytics:**
   - Vercel Dashboard → Deployments
   - Vercel Analytics (se habilitado)

---

## 📞 Suporte

Em caso de problemas no deploy:
- Verifique os logs no Vercel Dashboard
- Confirme que as variáveis de ambiente estão corretas
- Teste o build local: `npm run build && npm run preview`

---

**Última atualização:** 2026-01-05
**Versão:** 1.0.0
