import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    // Validações
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      )
    }

    if (body.newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(body.currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(body.newPassword, 10)

    // Atualizar senha
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    console.log('✅ Senha alterada para:', user.email)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao alterar senha' },
      { status: 500 }
    )
  }
}

