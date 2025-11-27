import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se é admin
    await requireAdmin()

    const body = await request.json()

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se email já está em uso por outro usuário
    if (body.email && body.email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: body.email },
      })

      if (emailInUse) {
        return NextResponse.json(
          { error: 'Este email já está em uso' },
          { status: 400 }
        )
      }
    }

    // Preparar dados para atualização
    const updateData: any = {
      name: body.name,
      email: body.email,
      role: body.role,
      active: body.active,
      avatarUrl: body.avatarUrl,
    }

    // Se senha foi fornecida, fazer hash
    if (body.password && body.password.trim() !== '') {
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: 'A senha deve ter no mínimo 6 caracteres' },
          { status: 400 }
        )
      }
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    console.log('✅ Usuário atualizado:', user.email)

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar usuário' },
      { status: error.message === 'Acesso negado. Apenas administradores.' ? 403 : 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se é admin
    await requireAdmin()

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            proposals: true,
            commissions: true,
          },
        },
      },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se tem propostas ou comissões
    if (existingUser._count.proposals > 0 || existingUser._count.commissions > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um usuário com propostas ou comissões. Desative-o ao invés de excluir.' },
        { status: 400 }
      )
    }

    // Excluir usuário
    await prisma.user.delete({
      where: { id: params.id },
    })

    console.log('✅ Usuário excluído:', existingUser.email)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao excluir usuário' },
      { status: error.message === 'Acesso negado. Apenas administradores.' ? 403 : 500 }
    )
  }
}
