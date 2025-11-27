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

    // Se for VENDEDOR, filtra por userId
    const userFilter = currentUser.role === 'ADMIN' 
      ? {} 
      : { userId: currentUser.id }

    // Get total clients (apenas admin vê todos)
    const totalClients = currentUser.role === 'ADMIN' 
      ? await prisma.client.count({ where: { active: true } })
      : await prisma.client.count({ 
          where: { 
            active: true,
            proposals: {
              some: { userId: currentUser.id }
            }
          }
        })

    // Get total proposals
    const totalProposals = await prisma.proposal.count({
      where: userFilter
    })

    // Get proposals by status
    const pendingProposals = await prisma.proposal.count({
      where: { ...userFilter, status: 'EM_ANALISE' }
    })

    const approvedProposals = await prisma.proposal.count({
      where: { ...userFilter, status: 'APROVADA' }
    })

    const rejectedProposals = await prisma.proposal.count({
      where: { ...userFilter, status: 'REJEITADA' }
    })

    // Get total commissions (received)
    const commissionsSum = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { 
        ...userFilter,
        status: 'RECEBIDA' 
      }
    })

    // Get monthly revenue (current month)
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyRevenueSum = await prisma.proposal.aggregate({
      _sum: { totalValue: true },
      where: {
        ...userFilter,
        status: 'APROVADA',
        createdAt: { gte: firstDayOfMonth }
      }
    })

    // Proposals by status for chart
    const proposalsByStatus = [
      { name: 'Em Análise', value: pendingProposals },
      { name: 'Aprovadas', value: approvedProposals },
      { name: 'Rejeitadas', value: rejectedProposals },
      { 
        name: 'Em Negociação', 
        value: await prisma.proposal.count({ 
          where: { ...userFilter, status: 'EM_NEGOCIACAO' }
        })
      },
    ]

    // Revenue by month (last 6 months)
    const revenueByMonth = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const revenue = await prisma.proposal.aggregate({
        _sum: { totalValue: true },
        where: {
          ...userFilter,
          status: 'APROVADA',
          createdAt: {
            gte: date,
            lt: nextMonth
          }
        }
      })

      revenueByMonth.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        revenue: revenue._sum.totalValue || 0
      })
    }

    // Proposals by service type
    const serviceTypes = [
      'COPEIRAGEM',
      'LIMPEZA_POS_OBRA',
      'LIMPEZA_GERAL',
      'LIMPEZA_INDUSTRIAL',
      'JARDINAGEM',
      'PORTARIA',
      'RECEPCAO',
      'OUTROS'
    ]

    const proposalsByService = await Promise.all(
      serviceTypes.map(async (service) => {
        const count = await prisma.proposal.count({
          where: { ...userFilter, serviceType: service as any }
        })
        const sum = await prisma.proposal.aggregate({
          _sum: { totalValue: true },
          where: { ...userFilter, serviceType: service as any }
        })
        return {
          service: service.replace(/_/g, ' '),
          count,
          value: sum._sum.totalValue || 0
        }
      })
    )

    return NextResponse.json({
      stats: {
        totalClients,
        totalProposals,
        totalCommissions: commissionsSum._sum.amount || 0,
        monthlyRevenue: monthlyRevenueSum._sum.totalValue || 0,
        pendingProposals,
        approvedProposals,
        rejectedProposals,
      },
      proposalsByStatus,
      revenueByMonth,
      proposalsByService: proposalsByService.filter(s => s.count > 0)
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

