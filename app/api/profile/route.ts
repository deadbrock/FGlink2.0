import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request: Request) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    console.log('📋 Dados recebidos na API:', {
      userId: session.user.id,
      name: body.name,
      email: body.email,
      avatarUrl: body.avatarUrl ? 'presente' : 'vazio',
    })

    // Verificar se email já está em uso por outro usuário
    if (body.email && body.email !== session.user.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: body.email },
      })

      if (emailInUse) {
        console.log('❌ Email já em uso:', body.email)
        return NextResponse.json(
          { error: 'Este email já está em uso' },
          { status: 400 }
        )
      }
    }

    // Atualizar usuário
    console.log('💾 Atualizando usuário no banco...')
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        email: body.email,
        avatarUrl: body.avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    })

    console.log('✅ Perfil atualizado com sucesso:', {
      id: user.id,
      name: user.name,
      email: user.email,
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('❌ Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar perfil' },
      { status: 500 }
    )
  }
}

