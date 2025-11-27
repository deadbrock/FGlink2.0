import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'sales'
    const period = searchParams.get('period') || 'month'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        startDate = new Date(0)
        break
    }

    const dateFilter = period === 'all' ? {} : { createdAt: { gte: startDate } }

    // Summary data
    const totalProposals = await prisma.proposal.count({ where: dateFilter })
    const totalRevenue = await prisma.proposal.aggregate({
      _sum: { totalValue: true },
      where: { ...dateFilter, status: 'APROVADA' }
    })
    const totalCommissions = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: dateFilter
    })

    const summary = {
      totalProposals,
      totalRevenue: totalRevenue._sum.totalValue || 0,
      totalCommissions: totalCommissions._sum.amount || 0,
    }

    let reportData: any = { summary }

    // Sales by User Report
    if (type === 'sales') {
      const users = await prisma.user.findMany({
        where: { role: { in: ['VENDEDOR', 'GERENTE'] } }
      })

      const salesByUser = await Promise.all(
        users.map(async (user) => {
          const proposals = await prisma.proposal.count({
            where: { userId: user.id, ...dateFilter }
          })

          const approved = await prisma.proposal.count({
            where: { userId: user.id, status: 'APROVADA', ...dateFilter }
          })

          const totalValue = await prisma.proposal.aggregate({
            _sum: { totalValue: true },
            where: { userId: user.id, status: 'APROVADA', ...dateFilter }
          })

          const commissions = await prisma.commission.aggregate({
            _sum: { amount: true },
            where: { userId: user.id, ...dateFilter }
          })

          return {
            id: user.id,
            name: user.name,
            proposals,
            approved,
            totalValue: totalValue._sum.totalValue || 0,
            commissions: commissions._sum.amount || 0,
          }
        })
      )

      reportData.salesByUser = salesByUser.sort((a, b) => b.totalValue - a.totalValue)
    }

    // Clients Report
    if (type === 'clients') {
      const clients = await prisma.client.findMany({
        include: {
          proposals: {
            where: { ...dateFilter, status: 'APROVADA' }
          }
        }
      })

      const topClients = clients
        .map(client => ({
          id: client.id,
          name: client.name,
          proposals: client.proposals.length,
          totalValue: client.proposals.reduce((sum, p) => sum + p.totalValue, 0),
          lastProposal: client.proposals.length > 0
            ? client.proposals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
            : null
        }))
        .filter(c => c.proposals > 0)
        .sort((a, b) => b.totalValue - a.totalValue)

      reportData.topClients = topClients
    }

    // Services Report
    if (type === 'services') {
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

      const serviceBreakdown = await Promise.all(
        serviceTypes.map(async (service) => {
          const count = await prisma.proposal.count({
            where: { serviceType: service as any, ...dateFilter }
          })

          const value = await prisma.proposal.aggregate({
            _sum: { totalValue: true },
            where: { serviceType: service as any, status: 'APROVADA', ...dateFilter }
          })

          return {
            name: service.replace(/_/g, ' '),
            count,
            value: value._sum.totalValue || 0
          }
        })
      )

      reportData.serviceBreakdown = serviceBreakdown.filter(s => s.count > 0)
    }

    // Commissions Report
    if (type === 'commissions') {
      const users = await prisma.user.findMany({
        where: { role: { in: ['VENDEDOR', 'GERENTE'] } }
      })

      const commissionsBreakdown = await Promise.all(
        users.map(async (user) => {
          const pending = await prisma.commission.aggregate({
            _sum: { amount: true },
            where: { userId: user.id, status: 'PENDENTE', ...dateFilter }
          })

          const paid = await prisma.commission.aggregate({
            _sum: { amount: true },
            where: { userId: user.id, status: 'RECEBIDA', ...dateFilter }
          })

          return {
            id: user.id,
            name: user.name,
            pending: pending._sum.amount || 0,
            paid: paid._sum.amount || 0,
            total: (pending._sum.amount || 0) + (paid._sum.amount || 0)
          }
        })
      )

      reportData.commissionsBreakdown = commissionsBreakdown
        .filter(c => c.total > 0)
        .sort((a, b) => b.total - a.total)
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

