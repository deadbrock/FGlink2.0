# 🔧 Configuração de Variáveis de Ambiente

## 📋 Desenvolvimento Local (SQLite)

Crie um arquivo `.env` na raiz do projeto:

```env
# Database - SQLite para desenvolvimento local
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Node Environment
NODE_ENV="development"
```

## 🚀 Produção (Railway + PostgreSQL)

Configure as seguintes variáveis no Railway:

### 1. DATABASE_URL (Automático)
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```
⚠️ **O Railway gera automaticamente quando você adiciona PostgreSQL!**

### 2. NEXTAUTH_URL
```env
NEXTAUTH_URL=https://seu-app.railway.app
```
📝 Use a URL fornecida pelo Railway após o deploy

### 3. NEXTAUTH_SECRET
```env
NEXTAUTH_SECRET=gere-uma-chave-secreta-forte-aqui
```

**Para gerar uma chave segura:**

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Online (se necessário):**
https://generate-secret.vercel.app/32

### 4. NODE_ENV
```env
NODE_ENV=production
```

## 🔄 Mudança de SQLite para PostgreSQL

### Localmente (Desenvolvimento)

Se quiser testar com PostgreSQL localmente:

1. Instale PostgreSQL
2. Crie um banco de dados
3. Atualize `.env`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/fglink"
```

### No Railway (Produção)

1. ✅ Schema já está configurado para PostgreSQL
2. ✅ Adicione o serviço PostgreSQL no Railway
3. ✅ A variável `DATABASE_URL` será criada automaticamente
4. Execute após o deploy:
```bash
npx prisma db push
npm run create-admin
```

## 📊 Formato da DATABASE_URL

### SQLite (Local)
```
file:./dev.db
```

### PostgreSQL (Railway/Produção)
```
postgresql://usuario:senha@host:porta/database
```

Exemplo completo:
```
postgresql://postgres:abc123@containers-us-west-123.railway.app:5432/railway
```

## ✅ Checklist de Configuração

### Desenvolvimento Local
- [ ] Criar arquivo `.env`
- [ ] Definir `DATABASE_URL` (SQLite)
- [ ] Definir `NEXTAUTH_URL` (localhost:3000)
- [ ] Gerar `NEXTAUTH_SECRET`
- [ ] Executar `npx prisma db push`
- [ ] Executar `npm run create-admin`

### Produção Railway
- [ ] Adicionar PostgreSQL no Railway
- [ ] Configurar `NEXTAUTH_URL` (URL do Railway)
- [ ] Gerar e configurar `NEXTAUTH_SECRET`
- [ ] Configurar `NODE_ENV=production`
- [ ] Deploy bem-sucedido
- [ ] Executar `npx prisma db push`
- [ ] Executar `npm run create-admin`

## 🔒 Segurança

⚠️ **NUNCA** commite o arquivo `.env` no Git!

O arquivo `.gitignore` já está configurado para ignorar:
- `.env`
- `.env.local`
- `.env.*.local`

## 🆘 Troubleshooting

### Erro: "Environment variable not found: DATABASE_URL"
✅ Verifique se o arquivo `.env` existe e está na raiz do projeto

### Erro: "Can't reach database server"
✅ Verifique se o PostgreSQL está rodando (local) ou se a URL está correta (Railway)

### Erro: "Invalid `prisma.user.create()` invocation"
✅ Execute `npx prisma db push` para criar as tabelas

### Erro: "PrismaClientInitializationError"
✅ Execute `npx prisma generate` para gerar o cliente

