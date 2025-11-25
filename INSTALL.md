# 🚀 Guia de Instalação - FGlink

Este guia irá ajudá-lo a configurar e executar o sistema FGlink em sua máquina.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior ([Download](https://nodejs.org/))
- **npm** (vem com o Node.js) ou **yarn**
- **Git** ([Download](https://git-scm.com/))

## 🔧 Instalação Passo a Passo

### 1️⃣ Clone ou Navegue até o Projeto

Se você já está na pasta do projeto, pule para o passo 2.

```bash
cd FGlink2.0
```

### 2️⃣ Instale as Dependências

Execute o comando abaixo para instalar todas as dependências necessárias:

```bash
npm install
```

⏱️ *Isso pode levar alguns minutos...*

### 3️⃣ Configure o Banco de Dados

O sistema usa SQLite por padrão, que não requer instalação adicional.

Execute os comandos abaixo para criar o banco de dados:

```bash
npm run db:push
```

Você verá uma mensagem confirmando que as tabelas foram criadas.

### 4️⃣ Popule o Banco com Dados Iniciais

Para facilitar o teste, vamos adicionar alguns dados de exemplo:

```bash
npm run db:seed
```

Isso irá criar:
- ✅ 2 usuários (admin e vendedor)
- ✅ 2 clientes de exemplo
- ✅ 1 proposta de exemplo
- ✅ 1 comissão de exemplo

### 5️⃣ Inicie o Servidor

Agora você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Aguarde até ver a mensagem:
```
✓ Ready in X.Xs
```

### 6️⃣ Acesse o Sistema

Abra seu navegador e acesse:

```
http://localhost:3000
```

Você será redirecionado para a página de login.

## 🔐 Credenciais de Acesso

Use uma das credenciais abaixo para fazer login:

### Administrador
- **Email:** `admin@fglink.com`
- **Senha:** `admin123`

### Vendedor
- **Email:** `vendedor@fglink.com`
- **Senha:** `vendedor123`

## 🎉 Pronto!

Agora você pode explorar todas as funcionalidades do sistema:

- 📊 **Dashboard** - Visualize métricas e gráficos
- 👥 **Clientes** - Cadastre e gerencie clientes
- 📝 **Propostas** - Crie propostas comerciais
- 💰 **Comissões** - Acompanhe comissões automáticas
- 📈 **Relatórios** - Gere relatórios detalhados
- 👤 **Usuários** - Gerencie usuários do sistema

## 🛠️ Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Visualizar banco de dados (Prisma Studio)
npm run db:studio

# Criar build de produção
npm run build

# Iniciar em modo produção
npm start
```

## ❓ Problemas Comuns

### Erro: "Cannot find module"
**Solução:** Execute `npm install` novamente

### Erro: "Port 3000 is already in use"
**Solução:** Feche outros aplicativos usando a porta 3000 ou mude a porta:
```bash
PORT=3001 npm run dev
```

### Erro ao fazer login
**Solução:** Verifique se executou o seed corretamente:
```bash
npm run db:seed
```

### Banco de dados não encontrado
**Solução:** Execute novamente:
```bash
npm run db:push
```

## 📞 Suporte

Se encontrar algum problema durante a instalação:

1. Verifique se todos os pré-requisitos estão instalados
2. Certifique-se de estar usando Node.js 18+
3. Tente remover a pasta `node_modules` e executar `npm install` novamente
4. Verifique se não há erros no console

## 🔄 Resetar o Banco de Dados

Se precisar resetar completamente o banco de dados:

```bash
# No Windows
del prisma\dev.db
npm run db:push
npm run db:seed

# No Linux/Mac
rm prisma/dev.db
npm run db:push
npm run db:seed
```

## 🎯 Próximos Passos

Após a instalação, recomendamos:

1. ✅ Explorar o dashboard
2. ✅ Criar um novo cliente
3. ✅ Criar uma proposta comercial
4. ✅ Visualizar a comissão gerada automaticamente
5. ✅ Gerar relatórios

---

**Desenvolvido com ❤️ para FGlink**

