import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const commissions = await prisma.commission.findMany({
      include: {
        proposal: {
          include: {
            client: {
              select: {
                name: true,
              }
            }
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

    // Calculate stats
    const total = await prisma.commission.aggregate({
      _sum: { amount: true },
    })

    const pending = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { status: 'PENDENTE' }
    })

    const paid = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { status: 'PAGA' }
    })

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: { gte: firstDayOfMonth }
      }
    })

    return NextResponse.json({
      commissions,
      stats: {
        total: total._sum.amount || 0,
        pending: pending._sum.amount || 0,
        paid: paid._sum.amount || 0,
        thisMonth: thisMonth._sum.amount || 0,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}

