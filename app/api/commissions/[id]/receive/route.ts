import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { paymentType, installments, observations } = await request.json()

    // Buscar a comissão
    const commission = await prisma.commission.findUnique({
      where: { id: params.id },
    })

    if (!commission) {
      return NextResponse.json(
        { error: 'Comissão não encontrada' },
        { status: 404 }
      )
    }

    if (commission.status !== 'PENDENTE') {
      return NextResponse.json(
        { error: 'Esta comissão já foi processada' },
        { status: 400 }
      )
    }

    // Se for à vista
    if (paymentType === 'A_VISTA') {
      await prisma.commission.update({
        where: { id: params.id },
        data: {
          status: 'RECEBIDA',
          paymentType: 'A_VISTA',
          installments: 1,
          receivedAt: new Date(),
          observations,
        },
      })

      return NextResponse.json({ success: true })
    }

    // Se for parcelado
    if (paymentType === 'PARCELADO') {
      const installmentAmount = commission.amount / installments

      // Criar as parcelas
      const installmentsData = []
      for (let i = 1; i <= installments; i++) {
        installmentsData.push({
          commissionId: params.id,
          installmentNumber: i,
          amount: installmentAmount,
          status: 'PENDENTE',
        })
      }

      // Atualizar comissão e criar parcelas em uma transação
      await prisma.$transaction([
        prisma.commission.update({
          where: { id: params.id },
          data: {
            status: 'PARCIAL',
            paymentType: 'PARCELADO',
            installments,
            observations,
          },
        }),
        prisma.commissionInstallment.createMany({
          data: installmentsData,
        }),
      ])

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Tipo de pagamento inválido' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error receiving commission:', error)
    return NextResponse.json(
      { error: 'Erro ao processar recebimento' },
      { status: 500 }
    )
  }
}

