import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📥 Confirmando recebimento da parcela:', params.id)

    // Buscar a parcela
    const installment = await prisma.commissionInstallment.findUnique({
      where: { id: params.id },
      include: {
        commission: true,
      },
    })

    if (!installment) {
      return NextResponse.json(
        { error: 'Parcela não encontrada' },
        { status: 404 }
      )
    }

    if (installment.status === 'RECEBIDA') {
      return NextResponse.json(
        { error: 'Esta parcela já foi recebida' },
        { status: 400 }
      )
    }

    // Marcar parcela como recebida
    await prisma.commissionInstallment.update({
      where: { id: params.id },
      data: {
        status: 'RECEBIDA',
        receivedAt: new Date(),
      },
    })

    console.log('✅ Parcela marcada como recebida')

    // Verificar se todas as parcelas foram recebidas
    const allInstallments = await prisma.commissionInstallment.findMany({
      where: { commissionId: installment.commissionId },
    })

    const allReceived = allInstallments.every(i => i.status === 'RECEBIDA')

    if (allReceived) {
      // Atualizar status da comissão para RECEBIDA
      await prisma.commission.update({
        where: { id: installment.commissionId },
        data: {
          status: 'RECEBIDA',
          receivedAt: new Date(),
        },
      })
      console.log('✅ Todas as parcelas recebidas! Comissão marcada como RECEBIDA')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Erro ao confirmar recebimento:', error)
    return NextResponse.json(
      { error: 'Erro ao confirmar recebimento' },
      { status: 500 }
    )
  }
}

