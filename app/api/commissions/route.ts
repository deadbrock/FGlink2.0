import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Se for ADMIN, mostra todas as comissões
    // Se for VENDEDOR, mostra apenas suas comissões
    const where = currentUser.role === 'ADMIN' 
      ? {} 
      : { userId: currentUser.id }

    const commissions = await prisma.commission.findMany({
      where,
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
        installmentsPaid: {
          select: {
            id: true,
            installmentNumber: true,
            amount: true,
            status: true,
            receivedAt: true,
          },
          orderBy: { installmentNumber: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate stats (filtered by user if not admin)
    const total = await prisma.commission.aggregate({
      _sum: { amount: true },
      where,
    })

    const pending = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { 
        ...where,
        status: 'PENDENTE' 
      }
    })

    const received = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { 
        ...where,
        OR: [
          { status: 'RECEBIDA' },
          { status: 'PARCIAL' }
        ]
      }
    })

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: {
        ...where,
        createdAt: { gte: firstDayOfMonth }
      }
    })

    return NextResponse.json({
      commissions,
      stats: {
        total: total._sum.amount || 0,
        pending: pending._sum.amount || 0,
        received: received._sum.amount || 0,
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

