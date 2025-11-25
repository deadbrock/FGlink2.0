import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const templates = await prisma.pDFTemplate.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Erro ao buscar templates de PDF:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar templates de PDF' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()

    const template = await prisma.pDFTemplate.create({
      data: {
        name: data.name,
        fileName: data.fileName,
        description: data.description,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao criar template de PDF:', error)
    return NextResponse.json(
      { error: 'Erro ao criar template de PDF' },
      { status: 500 }
    )
  }
}

