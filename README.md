# FGlink - Sistema Comercial

Sistema completo de gestão de propostas comerciais e comissões para empresas de serviços de limpeza profissional.

![FGlink](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748)

## 🚀 Funcionalidades

### 📊 Dashboard Completo
- Métricas em tempo real
- Gráficos interativos de receita e propostas
- Visão geral do negócio

### 👥 Gestão de Clientes
- Cadastro de Pessoa Física e Jurídica
- Histórico de propostas por cliente
- Informações de contato completas

### 📝 Propostas Comerciais
- Criação de propostas detalhadas
- Múltiplos itens por proposta
- Acompanhamento de status (Em Análise, Aprovada, Rejeitada, etc.)
- Tipos de serviço: Copeiragem, Limpeza Pós-Obra, Limpeza Geral, etc.

### 💰 Comissões Automáticas
- Cálculo automático baseado no tipo de contrato:
  - **5%** para Contratos Regulares
  - **4%** para MOT (Mão de Obra Temporária)
- Controle de pagamentos
- Histórico completo

### 📈 Relatórios Detalhados
- Vendas por vendedor
- Análise de clientes
- Distribuição por tipo de serviço
- Comissões por período
- Exportação para CSV

### 👤 Gestão de Usuários
- Três níveis de acesso: Admin, Gerente, Vendedor
- Autenticação segura com NextAuth
- Controle de permissões

## 🛠️ Tecnologias

- **Frontend:** Next.js 14, React, TypeScript
- **UI:** Tailwind CSS, Radix UI, shadcn/ui
- **Backend:** Next.js API Routes
- **Banco de Dados:** SQLite com Prisma ORM
- **Autenticação:** NextAuth.js
- **Gráficos:** Recharts
- **Validação:** Zod

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd FGlink2.0
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

4. **Popule o banco com dados iniciais**
```bash
npx prisma db seed
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse o sistema**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🔐 Credenciais Padrão

Após executar o seed, você pode fazer login com:

**Administrador:**
- Email: `admin@fglink.com`
- Senha: `admin123`

**Vendedor:**
- Email: `vendedor@fglink.com`
- Senha: `vendedor123`

## 📁 Estrutura do Projeto

```
FGlink2.0/
├── app/
│   ├── api/              # API Routes
│   ├── dashboard/        # Páginas do dashboard
│   ├── login/           # Página de login
│   └── globals.css      # Estilos globais
├── components/
│   ├── ui/              # Componentes UI reutilizáveis
│   ├── layout/          # Componentes de layout
│   ├── clients/         # Componentes de clientes
│   ├── proposals/       # Componentes de propostas
│   └── users/           # Componentes de usuários
├── lib/
│   ├── prisma.ts        # Cliente Prisma
│   └── utils.ts         # Funções utilitárias
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   └── seed.ts          # Dados iniciais
└── types/               # Tipos TypeScript
```

## 🎨 Design

O sistema foi desenvolvido com foco em:
- **Interface moderna e limpa**
- **Experiência do usuário intuitiva**
- **Responsividade total**
- **Acessibilidade**
- **Performance otimizada**

## 📊 Módulos do Sistema

### 1. Dashboard
- Visão geral com cards de métricas
- Gráficos de receita mensal
- Propostas por status
- Propostas por tipo de serviço

### 2. Clientes
- Listagem com busca e filtros
- Formulário completo de cadastro
- Suporte para PF e PJ
- Histórico de propostas

### 3. Propostas
- Criação com múltiplos itens
- Cálculo automático de valores
- Gestão de status
- Visualização detalhada
- Aprovação/Rejeição rápida

### 4. Comissões
- Cálculo automático ao criar proposta
- Listagem com filtros por status
- Controle de pagamentos
- Estatísticas em cards

### 5. Relatórios
- Múltiplos tipos de relatório
- Filtros por período
- Visualização em gráficos e tabelas
- Exportação para CSV

### 6. Usuários
- Cadastro de novos usuários
- Definição de funções
- Controle de status (ativo/inativo)
- Edição de perfis

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm run start

# Gerar cliente Prisma
npx prisma generate

# Criar/atualizar banco de dados
npx prisma db push

# Abrir Prisma Studio
npx prisma studio

# Executar seed
npx prisma db seed
```

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Configure um banco de dados PostgreSQL ou MySQL
4. Atualize a `DATABASE_URL` no `.env`
5. Execute as migrations: `npx prisma migrate deploy`
6. Inicie com `npm start`

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto é proprietário e confidencial.

## 👨‍💻 Suporte

Para suporte, entre em contato através do email: suporte@fglink.com

---

**Desenvolvido com ❤️ para FGlink**

"# FGlink2.0" 
