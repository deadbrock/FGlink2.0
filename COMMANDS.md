# 🛠️ Comandos Úteis - FGlink

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Criar banco de dados
npm run db:push

# Popular banco com dados iniciais
npm run db:seed

# Instalar + setup completo (primeiro uso)
npm install && npm run db:push && npm run db:seed
```

---

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Servidor estará em http://localhost:3000
```

---

## 🗄️ Banco de Dados

```bash
# Abrir Prisma Studio (visualizar dados)
npm run db:studio

# Criar/atualizar estrutura do banco
npm run db:push

# Popular com dados de exemplo
npm run db:seed

# Gerar cliente Prisma (após alterar schema)
npx prisma generate
```

---

## 🏗️ Build e Produção

```bash
# Criar build otimizado
npm run build

# Iniciar em modo produção
npm start

# Build + Start
npm run build && npm start
```

---

## 🔄 Reset e Manutenção

### Reset Completo do Banco

**Windows (PowerShell/CMD):**
```bash
del prisma\dev.db
npm run db:push
npm run db:seed
```

**Linux/Mac:**
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Limpar node_modules e reinstalar
```bash
# Windows
rmdir /s /q node_modules
npm install

# Linux/Mac
rm -rf node_modules
npm install
```

### Limpar cache do Next.js
```bash
# Windows
rmdir /s /q .next
npm run dev

# Linux/Mac
rm -rf .next
npm run dev
```

---

## 🧪 Teste Rápido do Sistema

### Após instalação, teste assim:

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir navegador em http://localhost:3000

# 3. Fazer login com:
# Email: admin@fglink.com
# Senha: admin123

# 4. Testar funcionalidades:
# - Dashboard (métricas e gráficos)
# - Clientes (criar novo cliente)
# - Propostas (criar nova proposta)
# - Comissões (ver comissão automática)
# - Relatórios (gerar relatórios)
```

---

## 🔍 Debug e Inspeção

```bash
# Ver logs do Prisma
npx prisma studio

# Verificar estrutura do banco
npx prisma db pull

# Validar schema
npx prisma validate

# Formatar schema
npx prisma format
```

---

## 📊 Prisma Studio

```bash
# Abrir interface visual do banco de dados
npm run db:studio

# Acesse: http://localhost:5555
```

No Prisma Studio você pode:
- ✅ Ver todos os dados
- ✅ Editar registros
- ✅ Adicionar dados manualmente
- ✅ Deletar registros
- ✅ Executar filtros

---

## 🔐 Gerenciar Usuários (via Prisma Studio)

```bash
# 1. Abrir Prisma Studio
npm run db:studio

# 2. Ir em "User"

# 3. Ver/Editar usuários existentes

# 4. Criar novos usuários
# Nota: Senhas devem ser hasheadas com bcrypt
```

---

## 📝 Scripts Personalizados

Você pode adicionar mais scripts em `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  }
}
```

---

## 🌐 Mudar Porta do Servidor

```bash
# Usar porta diferente (ex: 3001)
PORT=3001 npm run dev

# Windows (PowerShell)
$env:PORT=3001; npm run dev

# Windows (CMD)
set PORT=3001 && npm run dev
```

---

## 🔄 Atualizar Dependências

```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar todas as dependências
npm update

# Atualizar uma dependência específica
npm install next@latest
```

---

## 📦 Adicionar Novas Dependências

```bash
# Adicionar dependência de produção
npm install nome-pacote

# Adicionar dependência de desenvolvimento
npm install -D nome-pacote

# Remover dependência
npm uninstall nome-pacote
```

---

## 🐛 Resolução de Problemas

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port already in use"
```bash
# Windows - matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Erro: Prisma não encontra banco
```bash
npx prisma generate
npm run db:push
```

### Erro: NextAuth
```bash
# Verificar se NEXTAUTH_SECRET está configurado no .env
# Gerar novo secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 Testar Responsividade

### Chrome DevTools
1. Abrir DevTools (F12)
2. Click em "Toggle device toolbar" (Ctrl+Shift+M)
3. Testar diferentes dispositivos:
   - iPhone 12/13/14
   - iPad
   - Desktop

---

## 🚀 Deploy

### Vercel (Recomendado para Next.js)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer deploy
vercel

# Seguir instruções
```

### Railway
```bash
# Conectar repositório Git
# Railway detectará Next.js automaticamente
# Configurar variáveis de ambiente no dashboard
```

### Variáveis de Ambiente para Produção
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="seu-secret-super-secreto"
```

---

## 📊 Monitoramento

```bash
# Ver uso de memória
node --trace-warnings npm run dev

# Análise de bundle
npm run build
# Depois verificar .next/analyze
```

---

## ⚡ Performance

```bash
# Build otimizado
npm run build

# Análise de tempo de build
time npm run build

# Cache do Next.js (não deletar em produção)
# .next/cache
```

---

## 🎯 Comandos por Situação

### Primeira Instalação
```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Desenvolvimento Diário
```bash
npm run dev
```

### Antes de Commit
```bash
npm run build  # Verificar se build funciona
```

### Deploy
```bash
npm run build
npm start
```

### Problema Geral
```bash
rm -rf node_modules .next
npm install
npm run db:push
npm run dev
```

---

## 💡 Dicas

1. **Sempre execute `npm run db:push` após alterar `schema.prisma`**
2. **Use `npm run db:studio` para visualizar dados facilmente**
3. **Execute `npm run db:seed` quando precisar de dados de teste**
4. **Em caso de erro, tente limpar `.next` e `node_modules`**
5. **Mantenha o `.env` seguro e nunca o commit no Git**

---

## 📞 Atalhos Úteis

| Comando | Atalho |
|---------|--------|
| Iniciar dev | `npm run dev` |
| Ver banco | `npm run db:studio` |
| Reset banco | `del prisma\dev.db && npm run db:push && npm run db:seed` |
| Build | `npm run build` |
| Limpar tudo | `rm -rf node_modules .next && npm install` |

---

**Mantenha este arquivo como referência rápida! 📌**

