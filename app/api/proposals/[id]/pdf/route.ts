import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
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

    // NOTA: Para gerar PDF real, você deve usar bibliotecas como:
    // - @react-pdf/renderer
    // - pdfmake
    // - puppeteer
    // - jsPDF

    // Por enquanto, vou retornar um PDF simulado (HTML convertido)
    // Em produção, você usaria uma biblioteca de geração de PDF

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Proposta ${proposal.number}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #3b82f6;
      margin: 0;
    }
    .info-section {
      margin-bottom: 30px;
    }
    .info-section h2 {
      color: #3b82f6;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border: 1px solid #e5e7eb;
    }
    th {
      background-color: #3b82f6;
      color: white;
    }
    .total {
      text-align: right;
      font-size: 20px;
      font-weight: bold;
      color: #3b82f6;
      margin-top: 20px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>FGlink</h1>
    <p>Serviços de Limpeza Profissional</p>
    <h2>PROPOSTA COMERCIAL</h2>
    <p><strong>${proposal.number}</strong></p>
  </div>

  <div class="info-section">
    <h2>Dados do Cliente</h2>
    <p><strong>Nome:</strong> ${proposal.client.name}</p>
    <p><strong>Email:</strong> ${proposal.client.email}</p>
    <p><strong>Telefone:</strong> ${proposal.client.phone}</p>
    ${proposal.client.cnpj ? `<p><strong>CNPJ:</strong> ${proposal.client.cnpj}</p>` : ''}
  </div>

  <div class="info-section">
    <h2>Detalhes da Proposta</h2>
    <p><strong>Título:</strong> ${proposal.title}</p>
    ${proposal.description ? `<p><strong>Descrição:</strong> ${proposal.description}</p>` : ''}
    <p><strong>Tipo de Serviço:</strong> ${proposal.serviceType.replace(/_/g, ' ')}</p>
    <p><strong>Tipo de Contrato:</strong> ${proposal.contractType === 'MOT' ? 'MOT - Mão de Obra Temporária' : 'Contrato Regular'}</p>
    ${proposal.startDate ? `<p><strong>Período:</strong> ${new Date(proposal.startDate).toLocaleDateString('pt-BR')} até ${proposal.endDate ? new Date(proposal.endDate).toLocaleDateString('pt-BR') : 'Indeterminado'}</p>` : ''}
  </div>

  <div class="info-section">
    <h2>Itens da Proposta</h2>
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Quantidade</th>
          <th>Valor Unitário</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${proposal.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>R$ ${item.unitPrice.toFixed(2)}</td>
          <td>R$ ${item.totalPrice.toFixed(2)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="total">
      Valor Total: R$ ${proposal.totalValue.toFixed(2)}
    </div>
  </div>

  ${proposal.observations ? `
  <div class="info-section">
    <h2>Observações</h2>
    <p>${proposal.observations}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>FGlink - Serviços de Limpeza Profissional</p>
    <p>Email: contato@fglink.com | Telefone: (11) 1234-5678</p>
    <p>Proposta válida por 30 dias a partir da data de emissão</p>
    <p>Data de emissão: ${new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>
    `

    // Retornar HTML como resposta (navegador pode salvar como PDF)
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="Proposta-${proposal.number}.html"`,
      },
    })

    // Para PDF real, use algo como:
    /*
    import puppeteer from 'puppeteer'
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Proposta-${proposal.number}.pdf"`,
      },
    })
    */
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    )
  }
}

