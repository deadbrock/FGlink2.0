import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Criando usuário administrador...')

  // Verificar se já existe um admin
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  })

  if (existingAdmin) {
    console.log('⚠️  Já existe um usuário administrador:')
    console.log('   Email:', existingAdmin.email)
    console.log('   Nome:', existingAdmin.name)
    return
  }

  // Criar senha hash
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@fglink.com',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  })

  console.log('✅ Usuário administrador criado com sucesso!')
  console.log('   Email:', admin.email)
  console.log('   Senha: admin123')
  console.log('   ⚠️  IMPORTANTE: Altere a senha após o primeiro login!')
}

main()
  .catch((error) => {
    console.error('❌ Erro ao criar administrador:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

