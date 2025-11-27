# 🚀 Guia de Deploy - FGlink 2.0

## 📋 Pré-requisitos

- Conta no Railway (https://railway.app)
- Conta no Vercel (https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)

## 🗄️ Deploy do Backend e Banco de Dados (Railway)

### 1. Criar Projeto no Railway

1. Acesse https://railway.app e faça login
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha seu repositório FGlink2.0

### 2. Adicionar PostgreSQL

1. No projeto Railway, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente o banco e a variável `DATABASE_URL`

### 3. Configurar Variáveis de Ambiente

No Railway, adicione as seguintes variáveis:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_URL=https://seu-app.railway.app
NEXTAUTH_SECRET=gere-uma-chave-secreta-aqui
NODE_ENV=production
```

**Para gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. ✅ PostgreSQL Já Configurado

O schema já está configurado para PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"  // ✅ Já configurado!
  url      = env("DATABASE_URL")
}
```

⚠️ **Importante:** A variável `DATABASE_URL` será fornecida automaticamente pelo Railway quando você adicionar o PostgreSQL!

### 5. Build e Deploy

O Railway detectará automaticamente e fará o deploy usando o `nixpacks.toml`.

**Comandos automáticos:**
- Install: `npm install --legacy-peer-deps`
- Build: `npm run build` (que inclui `prisma generate`)
- Start: `npm run start`

**Não é necessário configurar manualmente!** O Railway usará as configurações do `nixpacks.toml`.

### 6. Executar Migrations

Após o primeiro deploy, execute no terminal do Railway:

```bash
npx prisma db push
```

## 🌐 Deploy do Frontend (Vercel)

### Opção 1: Deploy Completo na Vercel

Se preferir fazer tudo na Vercel (mais simples):

1. Acesse https://vercel.com
2. Clique em "Add New" → "Project"
3. Importe seu repositório
4. Configure as variáveis de ambiente:
   - `DATABASE_URL` (do Railway ou Vercel Postgres)
   - `NEXTAUTH_URL` (URL do seu projeto Vercel)
   - `NEXTAUTH_SECRET`

5. Deploy automático!

### Opção 2: Frontend na Vercel + Backend no Railway

**No Railway:**
- Configure apenas as APIs e banco de dados
- Use um domínio customizado ou o fornecido pelo Railway

**Na Vercel:**
- Configure para usar as APIs do Railway
- Atualize `NEXTAUTH_URL` para o domínio da Vercel
- Configure rewrites no `next.config.js` se necessário

## 🔧 Configurações Importantes

### 1. Atualizar Prisma Schema

Para PostgreSQL, atualize `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 2. Criar Usuário Admin Inicial

Após o deploy, crie um usuário admin via Prisma Studio ou script:

```bash
npx prisma studio
```

Ou crie um script `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@fglink.com',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  })
  
  console.log('Admin criado:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Execute:
```bash
npx tsx scripts/create-admin.ts
```

## 🔒 Segurança

### Variáveis de Ambiente Obrigatórias

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=chave-secreta-forte-aqui
NODE_ENV=production
```

### Gerar NEXTAUTH_SECRET Seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 📦 Estrutura de Deploy

```
Railway (Backend + DB)
├── PostgreSQL Database
├── Prisma ORM
├── Next.js API Routes
└── NextAuth Authentication

Vercel (Frontend)
├── Next.js Pages
├── React Components
└── Static Assets
```

## ✅ Checklist de Deploy

- [ ] Repositório Git configurado
- [ ] PostgreSQL criado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Schema Prisma atualizado para PostgreSQL
- [ ] Build bem-sucedido
- [ ] Migrations executadas
- [ ] Usuário admin criado
- [ ] Login funcionando
- [ ] Upload de arquivos testado
- [ ] PDFs sendo gerados
- [ ] Domínio customizado configurado (opcional)

## 🐛 Troubleshooting

### Erro: "authOptions is not a valid Route export field"
✅ **Resolvido!** Movemos `authOptions` para `lib/auth-options.ts`

### Erro: Prisma Client não gerado
```bash
npx prisma generate
```

### Erro: Tabelas não existem
```bash
npx prisma db push
```

### Erro: Cannot find module '@prisma/client'
```bash
npm install @prisma/client
npx prisma generate
```

## 📞 Suporte

Em caso de dúvidas:
1. Verifique os logs no Railway/Vercel
2. Teste localmente primeiro
3. Confirme todas as variáveis de ambiente

## 🎉 Deploy Concluído!

Após seguir todos os passos, seu sistema estará online e pronto para uso!

**URLs de Acesso:**
- Frontend: `https://seu-app.vercel.app`
- Backend: `https://seu-app.railway.app`
- Login: `https://seu-app.vercel.app/login`

**Credenciais Iniciais:**
- Email: `admin@fglink.com`
- Senha: `admin123` (altere imediatamente!)

