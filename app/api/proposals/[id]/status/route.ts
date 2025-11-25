import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const proposal = await prisma.proposal.update({
      where: { id: params.id },
      data: {
        status: body.status,
      }
    })

    // If proposal is approved, update commission status
    if (body.status === 'APROVADA') {
      await prisma.commission.updateMany({
        where: { proposalId: params.id },
        data: {
          status: 'PENDENTE',
        }
      })
    }

    // If proposal is rejected or cancelled, cancel commission
    if (body.status === 'REJEITADA' || body.status === 'CANCELADA') {
      await prisma.commission.updateMany({
        where: { proposalId: params.id },
        data: {
          status: 'CANCELADA',
        }
      })
    }

    return NextResponse.json(proposal)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update proposal status' },
      { status: 500 }
    )
  }
}

