#!/bin/bash

# Script de configuração para produção
# Execute este script no Railway após o deploy

echo "🚀 Configurando FGlink em Produção..."
echo ""

# 1. Verificar variáveis de ambiente
echo "📋 Verificando variáveis de ambiente..."
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não configurada!"
  exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "❌ NEXTAUTH_SECRET não configurada!"
  exit 1
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "❌ NEXTAUTH_URL não configurada!"
  exit 1
fi

echo "✅ Todas as variáveis estão configuradas!"
echo ""

# 2. Criar tabelas no banco de dados
echo "🗄️  Criando tabelas no banco de dados..."
npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
  echo "✅ Tabelas criadas com sucesso!"
else
  echo "❌ Erro ao criar tabelas!"
  exit 1
fi
echo ""

# 3. Criar usuário admin
echo "👤 Criando usuário administrador..."
npm run create-admin

if [ $? -eq 0 ]; then
  echo "✅ Usuário admin criado com sucesso!"
else
  echo "❌ Erro ao criar usuário admin!"
  exit 1
fi
echo ""

# 4. Resumo
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📝 Credenciais de acesso:"
echo "   Email: admin@fglink.com"
echo "   Senha: admin123"
echo ""
echo "🌐 Acesse: $NEXTAUTH_URL"
echo ""
echo "⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!"

