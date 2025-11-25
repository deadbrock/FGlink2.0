# 📋 Funcionalidades Detalhadas - FGlink

## 🎯 Visão Geral

O FGlink é um sistema completo para gestão comercial focado em empresas de serviços de limpeza profissional.

---

## 📊 1. Dashboard

### Métricas em Tempo Real
- **Total de Clientes** - Quantidade de clientes ativos
- **Total de Propostas** - Todas as propostas criadas
- **Comissões Acumuladas** - Valor total de comissões
- **Receita Mensal** - Faturamento do mês atual

### Cards de Status
- 🟡 **Em Análise** - Propostas aguardando aprovação
- 🟢 **Aprovadas** - Propostas aprovadas
- 🔴 **Rejeitadas** - Propostas rejeitadas

### Gráficos Interativos
- **Receita por Mês** - Evolução mensal do faturamento
- **Propostas por Status** - Distribuição visual
- **Propostas por Serviço** - Análise por tipo de serviço

---

## 👥 2. Gestão de Clientes

### Cadastro Completo
- **Pessoa Jurídica (PJ)**
  - Razão Social
  - CNPJ
  - Nome do Contato
  
- **Pessoa Física (PF)**
  - Nome Completo
  - CPF

### Informações de Contato
- Email
- Telefone
- Endereço completo (Rua, Cidade, Estado, CEP)
- Observações

### Funcionalidades
- ✅ Busca por nome, email ou telefone
- ✅ Visualização do número de propostas por cliente
- ✅ Status ativo/inativo
- ✅ Edição e exclusão
- ✅ Histórico de propostas

---

## 📝 3. Propostas Comerciais

### Criação de Propostas

#### Informações Básicas
- Seleção de cliente
- Título da proposta
- Descrição detalhada
- Período (data início e fim)

#### Tipos de Serviço
- 🧹 Copeiragem
- 🏗️ Limpeza Pós-Obra
- 🏢 Limpeza Geral
- 🏭 Limpeza Industrial
- 🌳 Jardinagem
- 🚪 Portaria
- 📞 Recepção
- 📦 Outros

#### Tipos de Contrato
- **Contrato Regular** - Comissão de 5%
- **MOT (Mão de Obra Temporária)** - Comissão de 4%

### Itens da Proposta
- Descrição do item
- Quantidade
- Valor unitário
- **Cálculo automático do total**

### Cálculo Automático
- ✅ Soma automática de todos os itens
- ✅ Cálculo da comissão baseado no tipo de contrato
- ✅ Visualização em tempo real

### Status da Proposta
- 🟡 **Em Análise** - Aguardando avaliação
- 🔵 **Em Negociação** - Em discussão com cliente
- 🟢 **Aprovada** - Proposta aceita
- 🔴 **Rejeitada** - Proposta recusada
- ⚫ **Cancelada** - Proposta cancelada

### Visualização Detalhada
- Informações completas da proposta
- Dados do cliente e vendedor
- Lista de todos os itens
- Valor total e comissão
- Botões de ação rápida (Aprovar/Rejeitar)

---

## 💰 4. Comissões Automáticas

### Cálculo Automático
Ao criar uma proposta, o sistema **automaticamente**:
1. Calcula a comissão baseada no tipo de contrato
2. Cria o registro de comissão
3. Vincula ao vendedor responsável

### Percentuais
- **Contrato Regular:** 5% do valor total
- **MOT:** 4% do valor total

### Status das Comissões
- 🟡 **Pendente** - Aguardando pagamento
- 🟢 **Paga** - Comissão já paga
- 🔴 **Cancelada** - Comissão cancelada

### Funcionalidades
- ✅ Visualização de todas as comissões
- ✅ Filtro por status
- ✅ Busca por proposta ou vendedor
- ✅ Marcação de pagamento com um clique
- ✅ Registro de data de pagamento

### Estatísticas
- Total acumulado
- Valor pendente
- Valor pago
- Comissões do mês

---

## 📈 5. Relatórios

### Tipos de Relatório

#### 📊 Vendas por Vendedor
- Número de propostas por vendedor
- Propostas aprovadas
- Valor total vendido
- Comissões geradas
- Taxa de conversão

#### 👥 Análise de Clientes
- Top clientes por faturamento
- Número de propostas por cliente
- Última proposta
- Distribuição de valor

#### 🛠️ Distribuição por Serviço
- Quantidade de propostas por tipo
- Valor total por serviço
- Gráfico de pizza
- Tabela detalhada

#### 💵 Comissões
- Comissões pendentes por vendedor
- Comissões pagas
- Total por vendedor

### Filtros de Período
- Última semana
- Último mês
- Último trimestre
- Último ano
- Todo o período

### Exportação
- ✅ Exportar para CSV
- ✅ Dados formatados
- ✅ Pronto para Excel

---

## 👤 6. Gestão de Usuários

### Níveis de Acesso

#### 🔴 Administrador
- Acesso total ao sistema
- Gerenciar usuários
- Ver todas as propostas e comissões
- Configurações do sistema

#### 🔵 Gerente
- Ver todas as propostas
- Aprovar/rejeitar propostas
- Ver comissões de todos
- Relatórios completos

#### 🟢 Vendedor
- Criar propostas
- Ver suas próprias propostas
- Ver suas comissões
- Cadastrar clientes

### Cadastro de Usuários
- Nome completo
- Email (usado para login)
- Senha (criptografada)
- Função (Admin/Gerente/Vendedor)
- Status (Ativo/Inativo)

### Funcionalidades
- ✅ Busca por nome ou email
- ✅ Edição de perfil
- ✅ Alteração de senha
- ✅ Ativação/desativação de usuários
- ✅ Visualização de propostas por usuário

---

## ⚙️ 7. Configurações

### Informações do Sistema
- Versão atual
- Ambiente (Desenvolvimento/Produção)
- Framework e tecnologias

### Banco de Dados
- Tipo de banco
- Status da conexão
- ORM utilizado

### Segurança
- Sistema de autenticação
- Método de criptografia
- Tipo de sessão

### Módulos Ativos
- Status de cada funcionalidade
- Informações sobre o sistema

---

## 🎨 8. Interface e Design

### Características
- ✨ Design moderno e limpo
- 📱 Totalmente responsivo
- 🎯 Interface intuitiva
- ⚡ Performance otimizada
- 🌈 Cores e badges informativos
- 📊 Gráficos interativos
- 🔔 Notificações visuais

### Componentes UI
- Cards informativos
- Tabelas com busca e filtros
- Formulários validados
- Modais para ações
- Badges de status
- Gráficos Recharts
- Ícones Lucide

---

## 🔐 9. Segurança

### Autenticação
- Login com email e senha
- Senhas criptografadas (bcrypt)
- Sessões JWT
- Proteção de rotas

### Permissões
- Controle por nível de acesso
- Validação no backend
- Proteção de APIs

---

## 🚀 10. Performance

### Otimizações
- Server-side rendering (Next.js)
- Lazy loading de componentes
- Cache de dados
- Queries otimizadas (Prisma)
- Build otimizado para produção

---

## 📱 11. Responsividade

O sistema funciona perfeitamente em:
- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Smartphone

---

## 🔄 12. Fluxo de Trabalho Típico

### Cenário Completo

1. **Vendedor faz login**
2. **Cadastra um novo cliente**
   - Preenche dados PJ ou PF
   - Salva informações de contato
3. **Cria uma proposta**
   - Seleciona o cliente
   - Define tipo de serviço
   - Escolhe tipo de contrato
   - Adiciona itens com valores
   - Sistema calcula comissão automaticamente
4. **Gerente/Admin revisa**
   - Visualiza proposta completa
   - Aprova ou rejeita
5. **Sistema gera comissão**
   - Comissão fica pendente
   - Aparece no módulo de comissões
6. **Admin paga comissão**
   - Marca como paga
   - Registra data de pagamento
7. **Relatórios são gerados**
   - Análise de vendas
   - Performance de vendedores
   - Faturamento por período

---

**Sistema completo e profissional para gestão comercial! 🎉**

