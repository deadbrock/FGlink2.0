import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateProposalFromTemplate } from '@/lib/pdf-template-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Buscando proposta:', params.id)
    
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        user: true,
        items: true,
        pdfTemplate: true,
      }
    })

    if (!proposal) {
      console.log('❌ Proposta não encontrada')
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      )
    }

    console.log('📋 Proposta encontrada:', {
      number: proposal.number,
      pdfTemplateId: proposal.pdfTemplateId,
      hasTemplate: !!proposal.pdfTemplate,
      templateName: proposal.pdfTemplate?.name,
    })

    if (!proposal.pdfTemplate) {
      console.log('⚠️ Nenhum template de PDF selecionado para esta proposta')
      return NextResponse.json(
        { error: 'Nenhum template de PDF selecionado para esta proposta' },
        { status: 404 }
      )
    }

    console.log('🚀 Gerando PDF do template para proposta:', proposal.number)
    console.log('📄 Usando template:', proposal.pdfTemplate.name)

    // Gerar PDF do template personalizado
    const pdfBuffer = await generateProposalFromTemplate(proposal, proposal.pdfTemplate.fileName)

    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'Template não configurado. Use o gerador padrão.' },
        { status: 404 }
      )
    }

    console.log('✅ PDF do template gerado com sucesso!')

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Proposta-${proposal.number}.pdf"`,
      },
    })
  } catch (error) {
    console.error('❌ Erro ao gerar PDF do template:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar PDF do template' },
      { status: 500 }
    )
  }
}

