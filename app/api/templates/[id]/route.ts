import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()

    // Deletar itens antigos
    await prisma.proposalTemplateItem.deleteMany({
      where: { templateId: params.id },
    })

    // Atualizar template com novos itens
    const template = await prisma.proposalTemplate.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        serviceType: data.serviceType,
        contractType: data.contractType,
        active: data.active,
        items: {
          create: data.items?.map((item: any, index: number) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            order: index,
          })) || [],
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao atualizar template:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.proposalTemplate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir template:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir template' },
      { status: 500 }
    )
  }
}

