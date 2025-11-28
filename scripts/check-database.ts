import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 Verificando estrutura do banco de dados...\n')

  try {
    // Verificar cada tabela
    const checks = [
      { name: 'User', query: () => prisma.user.count() },
      { name: 'Client', query: () => prisma.client.count() },
      { name: 'Proposal', query: () => prisma.proposal.count() },
      { name: 'ProposalItem', query: () => prisma.proposalItem.count() },
      { name: 'Commission', query: () => prisma.commission.count() },
      { name: 'CommissionInstallment', query: () => prisma.commissionInstallment.count() },
      { name: 'ProposalTemplate', query: () => prisma.proposalTemplate.count() },
      { name: 'ProposalTemplateItem', query: () => prisma.proposalTemplateItem.count() },
      { name: 'PDFTemplate', query: () => prisma.pDFTemplate.count() },
    ]

    let allOk = true

    for (const check of checks) {
      try {
        const count = await check.query()
        console.log(`✅ ${check.name.padEnd(25)} - ${count} registro(s)`)
      } catch (error: any) {
        console.log(`❌ ${check.name.padEnd(25)} - ERRO: ${error.message}`)
        allOk = false
      }
    }

    console.log('\n' + '='.repeat(60))
    
    if (allOk) {
      console.log('✅ Todas as tabelas estão OK!')
      console.log('\n📊 Resumo:')
      console.log(`   - 9 tabelas verificadas`)
      console.log(`   - Todas acessíveis`)
      console.log(`   - Banco de dados pronto para uso!`)
    } else {
      console.log('❌ Algumas tabelas estão faltando ou com erro!')
      console.log('\n🔧 Execute: npx prisma db push --accept-data-loss')
    }

  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error)
    console.log('\n🔧 Verifique se a DATABASE_URL está configurada corretamente')
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

