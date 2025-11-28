import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error('Não autenticado')
  }

  if (session.user.role !== 'ADMIN') {
    throw new Error('Acesso negado. Apenas administradores.')
  }

  return session
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error('Não autenticado')
  }

  return session
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return null
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    // avatarUrl removido - buscar diretamente do banco quando necessário
  }
}
