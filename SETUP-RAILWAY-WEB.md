# 🌐 Configurar Banco de Dados via Railway Web (SEM CLI)

## ⚠️ PROBLEMA ATUAL

```
ERROR: relation "public.User" does not exist
```

Isso significa que o banco de dados PostgreSQL está vazio - sem tabelas!

---

## ✅ SOLUÇÃO: Usar a Interface Web do Railway

### **PASSO 1: Acessar o Railway Dashboard**

1. Acesse: https://railway.app
2. Faça login
3. Clique no projeto **FGlink2.0**

---

### **PASSO 2: Adicionar Comando de Build**

1. No Railway, clique no seu **serviço principal** (não no PostgreSQL)
2. Vá em **"Settings"** (⚙️)
3. Role até **"Build"**
4. Em **"Build Command"**, adicione:

```bash
npm run build && npx prisma db push --accept-data-loss
```

5. Clique em **"Save"**

---

### **PASSO 3: Adicionar Comando de Start**

1. Ainda em **"Settings"**
2. Role até **"Deploy"**
3. Em **"Start Command"**, verifique se está:

```bash
npm run start
```

4. Clique em **"Save"**

---

### **PASSO 4: Criar Variável para Seed**

1. Vá em **"Variables"** (no menu lateral)
2. Clique em **"+ New Variable"**
3. Adicione:

```
Nome: RAILWAY_RUN_SEED
Valor: true
```

4. Clique em **"Add"**

---

### **PASSO 5: Fazer Redeploy**

1. Vá em **"Deployments"**
2. Clique nos **três pontinhos** (⋮) do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o build terminar (vai demorar ~2-3 minutos)

---

### **PASSO 6: Criar Usuário Admin Manualmente**

Após o deploy, precisamos criar o usuário admin. Temos 2 opções:

#### **Opção A: Via Railway Shell (Se disponível)**

1. No Railway, clique no seu serviço
2. Procure por **"Shell"** ou **"Terminal"** no menu
3. Se encontrar, execute:

```bash
npm run create-admin
```

#### **Opção B: Via Script SQL Direto no PostgreSQL**

1. No Railway, clique no serviço **PostgreSQL**
2. Vá em **"Data"** ou **"Query"**
3. Execute este SQL:

```sql
-- Criar usuário admin
INSERT INTO "User" (
  id,
  name,
  email,
  password,
  role,
  active,
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-' || gen_random_uuid()::text,
  'Administrador',
  'admin@fglink.com',
  '$2a$10$YourHashedPasswordHere',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

**⚠️ PROBLEMA:** A senha precisa estar em hash bcrypt!

---

## 🎯 SOLUÇÃO MAIS SIMPLES: Usar Prisma Studio

### **Via Conexão Direta ao Banco**

1. **Copie a DATABASE_URL do Railway:**
   - No Railway → PostgreSQL → Variables
   - Copie o valor de `DATABASE_URL`

2. **No seu computador local, crie um arquivo `.env.production`:**

```bash
DATABASE_URL="postgresql://postgres:senha@host:port/database"
```

3. **Execute localmente:**

```bash
# Criar as tabelas
npx prisma db push --accept-data-loss

# Criar o usuário admin
npm run create-admin
```

Isso vai conectar no banco do Railway e criar tudo!

---

## 📋 MÉTODO ALTERNATIVO: Script Node.js

Crie um arquivo `create-tables-and-admin.js`:

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Criando usuário admin...')
  
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
  
  console.log('✅ Usuário admin criado:', admin.email)
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Execute:
```bash
DATABASE_URL="sua-url-do-railway" node create-tables-and-admin.js
```

---

## 🚀 SOLUÇÃO RECOMENDADA (Mais Fácil)

### **Use o arquivo `.env.production` localmente:**

1. Crie o arquivo `.env.production` na raiz do projeto
2. Cole a `DATABASE_URL` do Railway
3. Execute:

```bash
# Windows PowerShell
$env:DATABASE_URL = "postgresql://postgres:senha@host:port/database"
npx prisma db push --accept-data-loss
npm run create-admin
```

```bash
# Windows CMD
set DATABASE_URL=postgresql://postgres:senha@host:port/database
npx prisma db push --accept-data-loss
npm run create-admin
```

---

## 🎉 DEPOIS DE CONFIGURAR

Teste o login em:
- **Vercel:** https://f-glink2-0.vercel.app
- **Railway:** https://seu-dominio.up.railway.app

**Credenciais:**
```
Email: admin@fglink.com
Senha: admin123
```

---

## 🆘 SE AINDA NÃO FUNCIONAR

Verifique os logs:
1. Railway → Deployments → Clique no deploy → View Logs
2. Procure por erros relacionados a Prisma ou Database

Comandos úteis para debug:
```bash
# Ver se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

# Ver se o usuário admin existe
SELECT * FROM "User" WHERE email = 'admin@fglink.com';
```

