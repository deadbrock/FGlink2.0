import { NextRequest, NextResponse } from 'next/server'
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

    // Se for ADMIN ou GERENTE, mostra todos os clientes
    // Se for VENDEDOR, mostra apenas clientes com quem tem propostas
    const where = (currentUser.role === 'ADMIN' || currentUser.role === 'GERENTE')
      ? {}
      : {
          proposals: {
            some: { userId: currentUser.id }
          }
        }

    const clients = await prisma.client.findMany({
      where,
      include: {
        _count: {
          select: { proposals: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`👥 Clientes carregados para ${currentUser.name} (${currentUser.role}): ${clients.length}`)

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        cnpj: body.cnpj || null,
        cpf: body.cpf || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zipCode: body.zipCode || null,
        contactName: body.contactName || null,
        observations: body.observations || null,
        active: body.active ?? true,
      }
    })
    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}

