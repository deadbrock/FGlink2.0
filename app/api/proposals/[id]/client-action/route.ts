import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, status, message } = body

    // Atualizar status da proposta
    const proposal = await prisma.proposal.update({
      where: { id: params.id },
      data: {
        status: status,
        observations: message ? `${message}\n\n---\nResposta do cliente` : undefined,
      },
      include: {
        client: true,
        user: true,
      }
    })

    // Atualizar comissão se aprovada
    if (status === 'APROVADA') {
      await prisma.commission.updateMany({
        where: { proposalId: params.id },
        data: {
          status: 'PENDENTE',
        }
      })
    }

    // Se rejeitada ou cancelada, cancelar comissão
    if (status === 'REJEITADA' || status === 'CANCELADA') {
      await prisma.commission.updateMany({
        where: { proposalId: params.id },
        data: {
          status: 'CANCELADA',
        }
      })
    }

    // NOTA: Aqui você pode enviar notificações por email
    // para o vendedor e administradores sobre a ação do cliente
    
    console.log('📧 Notificação de ação do cliente:')
    console.log('Proposta:', proposal.number)
    console.log('Cliente:', proposal.client.name)
    console.log('Ação:', action)
    console.log('Status:', status)
    console.log('Mensagem:', message)
    console.log('Vendedor:', proposal.user.email)

    // Exemplo de como enviar email de notificação:
    /*
    await sendEmail({
      to: proposal.user.email,
      subject: `Cliente respondeu à proposta ${proposal.number}`,
      html: `
        <h2>Ação do Cliente</h2>
        <p><strong>Cliente:</strong> ${proposal.client.name}</p>
        <p><strong>Proposta:</strong> ${proposal.number}</p>
        <p><strong>Ação:</strong> ${
          action === 'approve' ? 'Aprovada ✅' :
          action === 'reject' ? 'Recusada ❌' :
          'Solicitou Negociação 💬'
        }</p>
        ${message ? `<p><strong>Mensagem:</strong> ${message}</p>` : ''}
        <p><a href="${process.env.NEXTAUTH_URL}/dashboard/proposals">Ver no sistema</a></p>
      `
    })
    */

    return NextResponse.json({
      success: true,
      message: 'Ação registrada com sucesso',
      proposal,
    })
  } catch (error) {
    console.error('Erro ao processar ação do cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao processar ação' },
      { status: 500 }
    )
  }
}

