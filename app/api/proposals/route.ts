import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateCommission } from '@/lib/utils'

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        client: {
          select: {
            name: true,
          }
        },
        user: {
          select: {
            name: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(proposals)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create proposal
    const proposal = await prisma.proposal.create({
      data: {
        number: body.number,
        clientId: body.clientId,
        userId: body.userId,
        title: body.title,
        description: body.description || null,
        status: 'EM_ANALISE',
        serviceType: body.serviceType,
        contractType: body.contractType,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        totalValue: body.totalValue,
        observations: body.observations || null,
        items: {
          create: body.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          }))
        }
      },
      include: {
        items: true,
      }
    })

    // Calculate and create commission
    const commissionPercentage = body.contractType === 'MOT' ? 4 : 5
    const commissionAmount = calculateCommission(body.totalValue, body.contractType)

    await prisma.commission.create({
      data: {
        proposalId: proposal.id,
        userId: body.userId,
        baseValue: body.totalValue,
        percentage: commissionPercentage,
        amount: commissionAmount,
        status: 'PENDENTE',
      }
    })

    return NextResponse.json(proposal, { status: 201 })
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    )
  }
}

