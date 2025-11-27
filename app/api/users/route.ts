import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Verificar se é admin
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            proposals: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar usuários' },
      { status: error.message === 'Acesso negado. Apenas administradores.' ? 403 : 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Verificar se é admin
    await requireAdmin()

    const body = await request.json()

    // Validações
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || 'VENDEDOR',
        active: body.active !== undefined ? body.active : true,
        avatarUrl: body.avatarUrl || null,
      },
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

    console.log('✅ Usuário criado:', user.email)

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar usuário' },
      { status: error.message === 'Acesso negado. Apenas administradores.' ? 403 : 500 }
    )
  }
}
