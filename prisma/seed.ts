import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fglink.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@fglink.com',
      password: adminPassword,
      role: 'ADMIN',
      active: true,
    },
  })
  console.log('✅ Usuário admin criado:', admin.email)

  // Create vendedor user
  const vendedorPassword = await bcrypt.hash('vendedor123', 10)
  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@fglink.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'vendedor@fglink.com',
      password: vendedorPassword,
      role: 'VENDEDOR',
      active: true,
    },
  })
  console.log('✅ Usuário vendedor criado:', vendedor.email)

  // Create sample clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Empresa ABC Ltda',
      cnpj: '12345678000190',
      email: 'contato@empresaabc.com',
      phone: '11987654321',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      contactName: 'Maria Santos',
      active: true,
    },
  })
  console.log('✅ Cliente criado:', client1.name)

  const client2 = await prisma.client.create({
    data: {
      name: 'Indústria XYZ S.A.',
      cnpj: '98765432000111',
      email: 'comercial@industriaxyz.com',
      phone: '11912345678',
      address: 'Av. Industrial, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04567-890',
      contactName: 'Carlos Oliveira',
      active: true,
    },
  })
  console.log('✅ Cliente criado:', client2.name)

  // Create sample proposal
  const proposal = await prisma.proposal.create({
    data: {
      number: 'PROP-202411-0001',
      clientId: client1.id,
      userId: vendedor.id,
      title: 'Serviço de Limpeza Mensal',
      description: 'Limpeza completa das instalações',
      status: 'APROVADA',
      serviceType: 'LIMPEZA_GERAL',
      contractType: 'CONTRATO_REGULAR',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-11-30'),
      totalValue: 15000,
      items: {
        create: [
          {
            description: 'Limpeza de escritórios',
            quantity: 12,
            unitPrice: 800,
            totalPrice: 9600,
          },
          {
            description: 'Limpeza de banheiros',
            quantity: 12,
            unitPrice: 450,
            totalPrice: 5400,
          },
        ],
      },
    },
  })
  console.log('✅ Proposta criada:', proposal.number)

  // Create commission
  const commission = await prisma.commission.create({
    data: {
      proposalId: proposal.id,
      userId: vendedor.id,
      baseValue: 15000,
      percentage: 5,
      amount: 750,
      status: 'RECEBIDA',
      paymentType: 'A_VISTA',
      installments: 1,
      receivedAt: new Date(),
    },
  })
  console.log('✅ Comissão criada:', commission.amount)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

