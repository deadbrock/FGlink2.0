import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { proposalId, to, subject, message } = body

    // Buscar proposta completa
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        client: true,
        user: true,
        items: true,
      }
    })

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      )
    }

    // NOTA: Em produção, você deve integrar com um serviço de email como:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Nodemailer + SMTP
    
    // Por enquanto, vou simular o envio
    console.log('📧 Simulando envio de email:')
    console.log('Para:', to)
    console.log('Assunto:', subject)
    console.log('Mensagem:', message)
    console.log('Proposta:', proposal.number)

    // Aqui você adicionaria a integração real:
    /*
    import nodemailer from 'nodemailer'
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
      attachments: [{
        filename: `Proposta-${proposal.number}.pdf`,
        content: pdfBuffer,
      }]
    })
    */

    // Registrar envio no banco de dados (opcional)
    // await prisma.proposalEmail.create({
    //   data: {
    //     proposalId,
    //     to,
    //     subject,
    //     message,
    //     sentAt: new Date(),
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso (simulado)',
      // Em produção, retorne informações do envio real
    })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}

