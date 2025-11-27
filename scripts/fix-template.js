// Script para corrigir o fileName do template antigo
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixTemplate() {
  try {
    console.log('🔍 Buscando template com fileName incorreto...')
    
    // Buscar template com nome errado
    const template = await prisma.pDFTemplate.findFirst({
      where: {
        fileName: 'modelo proposta.pdf'
      }
    })

    if (!template) {
      console.log('❌ Template não encontrado')
      return
    }

    console.log('📋 Template encontrado:', {
      id: template.id,
      name: template.name,
      fileName: template.fileName,
    })

    // Atualizar para o fileName correto
    const updated = await prisma.pDFTemplate.update({
      where: { id: template.id },
      data: {
        fileName: 'template-1764155503016.pdf'
      }
    })

    console.log('✅ Template corrigido:', {
      id: updated.id,
      name: updated.name,
      fileName: updated.fileName,
    })

    console.log('\n🎉 Correção concluída! Teste novamente.')
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixTemplate()

