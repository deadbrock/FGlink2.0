import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateCommission } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        items: true,
        commission: true,
      }
    })

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(proposal)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Delete existing items
    await prisma.proposalItem.deleteMany({
      where: { proposalId: params.id }
    })

    // Update proposal
    const proposal = await prisma.proposal.update({
      where: { id: params.id },
      data: {
        clientId: body.clientId,
        title: body.title,
        description: body.description || null,
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

    // Update commission
    const commissionPercentage = body.contractType === 'MOT' ? 4 : 5
    const commissionAmount = calculateCommission(body.totalValue, body.contractType)

    await prisma.commission.updateMany({
      where: { proposalId: params.id },
      data: {
        baseValue: body.totalValue,
        percentage: commissionPercentage,
        amount: commissionAmount,
      }
    })

    return NextResponse.json(proposal)
  } catch (error) {
    console.error('Error updating proposal:', error)
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete commission first
    await prisma.commission.deleteMany({
      where: { proposalId: params.id }
    })

    // Delete proposal (items will be deleted automatically due to cascade)
    await prisma.proposal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    )
  }
}

