# 🔍 Diagnóstico e Solução do Erro 401

## ❌ Problema Identificado

Erro 401 (Unauthorized) no login indica que:
- ✅ O deploy foi bem-sucedido
- ❌ Mas o banco de dados não está configurado corretamente

---

## 🎯 Solução Passo a Passo

### **PASSO 1: Verificar Variáveis de Ambiente**

#### No Railway:
Acesse: Railway Dashboard → Seu Projeto → Variables

Certifique-se de que existem:
```bash
DATABASE_URL=postgresql://postgres:senha@host:port/database
NEXTAUTH_SECRET=c3Pjn4Ysrfjoa2NU0+C6hOKpbHvRvNHI8UWoqdQg/R4=
NEXTAUTH_URL=https://seu-dominio-railway.up.railway.app
NODE_ENV=production
```

⚠️ **IMPORTANTE:** O `NEXTAUTH_URL` deve ser a URL COMPLETA do Railway (com https://)

#### Na Vercel:
Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables

```bash
DATABASE_URL=postgresql://postgres:senha@host:port/database
NEXTAUTH_SECRET=c3Pjn4Ysrfjoa2NU0+C6hOKpbHvRvNHI8UWoqdQg/R4=
NEXTAUTH_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

⚠️ **IMPORTANTE:** Use a MESMA `NEXTAUTH_SECRET` em ambos!

---

### **PASSO 2: Configurar o Banco de Dados no Railway**

O banco de dados PostgreSQL está vazio! Precisamos criar as tabelas e o usuário admin.

#### Opção A: Via Railway CLI (Recomendado)

1. Instale o Railway CLI:
```bash
npm install -g @railway/cli
```

2. Faça login:
```bash
railway login
```

3. Conecte ao projeto:
```bash
railway link
```

4. Execute os comandos:
```bash
# Criar as tabelas
railway run npx prisma db push --accept-data-loss

# Criar usuário admin
railway run npm run create-admin
```

#### Opção B: Via Terminal do Railway (Mais Fácil)

1. Acesse o Railway Dashboard
2. Clique no seu projeto
3. Clique em **"Settings"** → **"Deploy Logs"**
4. Procure por um botão **"Shell"** ou **"Terminal"**
5. Execute:
```bash
npx prisma db push --accept-data-loss
npm run create-admin
```

#### Opção C: Via Variável de Ambiente (Automático)

Adicione no Railway uma variável:
```bash
RAILWAY_RUN_BUILD_COMMAND=npx prisma db push --accept-data-loss && npm run build
```

Depois faça um redeploy.

---

### **PASSO 3: Verificar se Funcionou**

Após executar os comandos acima, tente fazer login com:

**Credenciais do Admin:**
```
Email: admin@fglink.com
Senha: admin123
```

---

## 🔧 Comandos Úteis do Railway CLI

```bash
# Ver logs em tempo real
railway logs

# Abrir shell no container
railway shell

# Executar comando no Railway
railway run <comando>

# Ver variáveis de ambiente
railway variables
```

---

## 🆘 Troubleshooting

### Erro: "Command not found: prisma"

Execute:
```bash
railway run npx prisma db push
```

### Erro: "Database connection failed"

Verifique se a `DATABASE_URL` está correta:
```bash
railway variables
```

### Erro: "NEXTAUTH_SECRET is not defined"

Adicione a variável no Railway:
```bash
NEXTAUTH_SECRET=c3Pjn4Ysrfjoa2NU0+C6hOKpbHvRvNHI8UWoqdQg/R4=
```

### Erro: "Invalid credentials" após criar admin

O usuário foi criado! Tente com as credenciais:
- Email: `admin@fglink.com`
- Senha: `admin123`

---

## 📊 Checklist Final

- [ ] ✅ Variáveis de ambiente configuradas no Railway
- [ ] ✅ Variáveis de ambiente configuradas na Vercel
- [ ] ✅ `DATABASE_URL` aponta para o PostgreSQL do Railway
- [ ] ✅ `NEXTAUTH_SECRET` é a mesma em ambos
- [ ] ✅ `NEXTAUTH_URL` está correto (com https://)
- [ ] ✅ Executou `npx prisma db push` no Railway
- [ ] ✅ Executou `npm run create-admin` no Railway
- [ ] ✅ Testou login com admin@fglink.com / admin123

---

## 🎉 Próximos Passos Após o Login

1. Acesse o módulo **Usuários**
2. Crie contas para seus vendedores
3. Configure os clientes
4. Comece a criar propostas!

---

## 📞 Suporte

Se o problema persistir, verifique:
1. Console do navegador (F12) para ver erros detalhados
2. Logs do Railway: `railway logs`
3. Logs da Vercel: Vercel Dashboard → Deployment → Logs

