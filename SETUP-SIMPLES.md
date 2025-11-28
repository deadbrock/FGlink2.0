# 🚀 SETUP SIMPLES - 2 Comandos

## ⚡ Solução Rápida (Do seu computador local)

### **PASSO 1: Copiar a DATABASE_URL do Railway**

1. Acesse: https://railway.app
2. Entre no projeto **FGlink2.0**
3. Clique no serviço **PostgreSQL** (ícone de elefante 🐘)
4. Clique em **"Variables"** no menu lateral
5. Procure por `DATABASE_URL`
6. Clique no ícone de **copiar** 📋

A URL será algo como:
```
postgresql://postgres:SuaSenha@containers-us-west-123.railway.app:7432/railway
```

---

### **PASSO 2: Executar os Comandos**

Abra o **PowerShell** na pasta do projeto e execute:

#### **Comando 1: Criar as tabelas**

```powershell
$env:DATABASE_URL="COLE_AQUI_SUA_URL_DO_RAILWAY"
npx prisma db push --accept-data-loss
```

**Exemplo real:**
```powershell
$env:DATABASE_URL="postgresql://postgres:abc123@containers-us-west-123.railway.app:7432/railway"
npx prisma db push --accept-data-loss
```

Aguarde até ver: `✔ Generated Prisma Client`

---

#### **Comando 2: Criar o usuário admin**

```powershell
npm run create-admin
```

Aguarde até ver: `✅ Usuário admin criado com sucesso!`

---

### **PASSO 3: Testar o Login**

Acesse: https://f-glink2-0.vercel.app

**Credenciais:**
```
Email: admin@fglink.com
Senha: admin123
```

---

## 🎉 PRONTO!

Se funcionou, você verá o dashboard do FGlink!

---

## ❌ Se der erro "command not found"

Execute assim (tudo em uma linha):

```powershell
$env:DATABASE_URL="sua-url-aqui"; node node_modules\.bin\prisma db push --accept-data-loss
```

E depois:

```powershell
node scripts\create-admin.ts
```

---

## 🆘 Troubleshooting

### Erro: "Can't reach database server"

✅ Verifique se a DATABASE_URL está correta
✅ Verifique se o PostgreSQL está rodando no Railway

### Erro: "User already exists"

✅ Ótimo! O usuário já foi criado. Tente fazer login.

### Erro: "Table already exists"

✅ Ótimo! As tabelas já foram criadas. Execute só o comando 2.

---

## 📞 Precisa de Ajuda?

Me envie:
1. A mensagem de erro completa
2. O comando que você executou
3. Screenshot do erro (se possível)

