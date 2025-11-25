import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commission = await prisma.commission.update({
      where: { id: params.id },
      data: {
        status: 'PAGA',
        paidAt: new Date(),
      }
    })

    return NextResponse.json(commission)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to pay commission' },
      { status: 500 }
    )
  }
}

