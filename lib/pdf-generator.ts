import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Configuração padrão
const defaultConfig = {
  showLogo: true,
  logoSize: '150px',
  companyName: 'FGlink',
  companySubtitle: 'Serviços de Limpeza Profissional',
  headerColor: '#3b82f6',
  introText: `A FGlink antecipa seus agradecimentos pela confiança depositada em nosso trabalho, visto que atuamos neste mercado com reconhecida capacidade técnica operacional.

Ao longo dos anos aprimoramos nossa gestão, implantando serviços especializados e inovadores que trazem satisfação aos nossos clientes.

Parte deste sucesso, deve-se à preocupação constante com o acompanhamento de todos os nossos colaboradores e das suas tarefas, que possibilita aprender com os processos e implantar melhorias contínuas, mantendo nossa QUALIDADE sempre em alta.`,
  tableHeaderColor: '#3b82f6',
  tableHeaderText: 'QUADRO RESUMO',
  showInsalubridadeColumn: false,
  itemsIncluded: 'Salário, Vale transporte, Vale refeição, Cesta básica, Fardamento e EPI\'s, Encargos e Impostos',
  defaultObservation: 'Na presente proposta não estão previstos reajustes de salário e benefícios, devendo a mesma ser reajustada conforme homologação da convenção coletiva da categoria.',
  observationBgColor: '#fff3cd',
  observationBorderColor: '#ffc107',
  paymentTerms: 'O faturamento da nota será realizado após 30 (trinta) dias corridos da prestação do serviço com pagamento programado para 10 (dez) dias corridos a contar da data da sua emissão.',
  proposalValidity: '30 (trinta) dias',
  executiveTitle: 'Executivo(a) Comercial',
  companyPhone: '(11) 1234-5678',
  companyMobile: '(11) 99999-9999',
  companyEmail: 'contato@fglink.com',
  companyWebsite: 'www.fglink.com',
  companyCNPJ: '00.000.000/0001-00',
  companyAddress: 'Endereço da Empresa',
  acceptanceTitle: 'TERMO DE ACEITE DA PROPOSTA COMERCIAL',
  acceptanceText: 'Declaramos para os devidos fins que estamos de acordo com os termos da Proposta Comercial',
  fontSize: '11pt',
  fontFamily: 'Arial, sans-serif',
  lineHeight: '1.6',
  pageMargin: '20mm',
}

// Carregar configuração do PDF
async function loadPDFConfig() {
  try {
    // Adicionar timestamp para evitar cache
    const timestamp = new Date().getTime()
    const response = await fetch(`/api/pdf-config?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('📥 Configuração carregada do servidor:', data)
      
      // Se tiver dados, mesclar com configuração padrão
      if (data && Object.keys(data).length > 0) {
        const merged = { ...defaultConfig, ...data }
        console.log('✅ Usando configuração personalizada:', {
          companyName: merged.companyName,
          headerColor: merged.headerColor,
          showInsalubridadeColumn: merged.showInsalubridadeColumn,
        })
        return merged
      }
    }
  } catch (error) {
    console.error('❌ Erro ao carregar configuração do PDF:', error)
  }
  
  console.log('⚠️ Usando configuração padrão')
  return defaultConfig
}

export async function generateProposalPDF(proposal: any) {
  console.log('🚀 Iniciando geração de PDF...')
  
  // Carregar configuração personalizada
  const config = await loadPDFConfig()
  
  console.log('🎨 CONFIGURAÇÃO FINAL APLICADA:', {
    companyName: config.companyName,
    headerColor: config.headerColor,
    logoSize: config.logoSize,
    tableHeaderColor: config.tableHeaderColor,
    showInsalubridadeColumn: config.showInsalubridadeColumn,
  })
  
  // Criar elemento HTML temporário para o PDF
  const element = document.createElement('div')
  element.style.width = '210mm' // A4 width
  element.style.padding = config.pageMargin
  element.style.backgroundColor = 'white'
  element.style.fontFamily = config.fontFamily
  element.style.fontSize = config.fontSize
  element.style.lineHeight = config.lineHeight
  
  element.innerHTML = `
    <div style="text-align: center; border-bottom: 3px solid ${config.headerColor}; padding-bottom: 20px; margin-bottom: 30px;">
      ${config.showLogo ? `<img src="/logo-fglink.png" alt="${config.companyName} Logo" style="width: ${config.logoSize}; height: auto; margin: 0 auto 15px; display: block;" onerror="this.style.display='none'" />` : ''}
      <h1 style="color: ${config.headerColor}; margin: 0; font-size: 32px;">${config.companyName}</h1>
      <p style="color: #666; margin: 5px 0;">${config.companySubtitle}</p>
      <h2 style="margin: 20px 0 10px; font-size: 24px;">PROPOSTA COMERCIAL</h2>
      <p style="font-size: 18px; font-weight: bold; color: ${config.headerColor};">${proposal.number}</p>
    </div>

    <div style="margin-bottom: 30px;">
      <p style="margin-bottom: 15px;"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      <p style="margin-bottom: 10px;"><strong>Att.</strong> ${proposal.client.name}</p>
      <p style="margin-bottom: 10px;"><strong>Empresa:</strong> ${proposal.client.company || proposal.client.name}</p>
    </div>

    <div style="margin-bottom: 30px; text-align: justify; white-space: pre-line;">
      ${config.introText}
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="background: ${config.tableHeaderColor}; color: white; text-align: center; padding: 12px; margin: 0 0 2px 0; font-size: 16px;">
        ${config.tableHeaderText}
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #e3f2fd;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ccc; font-size: 12px;">DESCRIÇÃO</th>
            ${config.showInsalubridadeColumn ? '<th style="padding: 10px; text-align: center; border: 1px solid #ccc; font-size: 12px; width: 100px;">INSALUBR.</th>' : ''}
            <th style="padding: 10px; text-align: center; border: 1px solid #ccc; font-size: 12px; width: 100px;">PERÍODO</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ccc; font-size: 12px; width: 120px;">VALOR</th>
          </tr>
        </thead>
        <tbody>
          ${proposal.items.map((item: any, index: number) => `
          <tr style="background-color: ${index % 2 === 0 ? 'white' : '#f9fafb'};">
            <td style="padding: 10px; border: 1px solid #ccc; font-size: 11px;">${item.description}</td>
            ${config.showInsalubridadeColumn ? '<td style="padding: 10px; text-align: center; border: 1px solid #ccc; font-size: 11px;">NÃO</td>' : ''}
            <td style="padding: 10px; text-align: center; border: 1px solid #ccc; font-size: 11px;">${proposal.startDate && proposal.endDate ? Math.ceil((new Date(proposal.endDate).getTime() - new Date(proposal.startDate).getTime()) / (1000 * 60 * 60 * 24)) + ' dias' : '30 dias'}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ccc; font-size: 11px; font-weight: bold;">R$ ${item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          `).join('')}
          <tr style="background-color: #f0f9ff;">
            <td colspan="${config.showInsalubridadeColumn ? '3' : '2'}" style="padding: 12px; text-align: right; border: 1px solid #ccc; font-size: 13px; font-weight: bold;">VALOR TOTAL:</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ccc; font-size: 14px; font-weight: bold; color: ${config.tableHeaderColor};">R$ ${proposal.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-bottom: 20px;">
      <p style="margin: 0; font-size: 12px;"><strong>A presente proposta contempla:</strong></p>
      <p style="margin: 5px 0 0 0; font-size: 11px;">${config.itemsIncluded}</p>
    </div>

    <div style="background: ${config.observationBgColor}; border-left: 4px solid ${config.observationBorderColor}; padding: 15px; margin: 20px 0; font-size: 11px;">
      <p style="margin: 0;"><strong>Observação:</strong></p>
      <p style="margin: 5px 0 0 0;">${proposal.observations || config.defaultObservation}</p>
    </div>

    <div style="margin: 30px 0;">
      <h3 style="font-size: 13px; margin-bottom: 10px; color: ${config.headerColor};">CONDIÇÕES COMERCIAIS:</h3>
      <p style="font-size: 11px; margin: 5px 0;"><strong>Condições de Pagamento:</strong> ${config.paymentTerms}</p>
      <p style="font-size: 11px; margin: 5px 0;"><strong>Validade da Proposta:</strong> ${config.proposalValidity}</p>
    </div>

    <div style="margin-top: 50px; text-align: center;">
      <p style="font-size: 11px; margin: 5px 0;">Atenciosamente,</p>
      <div style="margin: 40px auto 10px; width: 250px; border-top: 1px solid #333;"></div>
      <p style="font-size: 11px; margin: 5px 0; font-weight: bold;">${proposal.user.name}</p>
      <p style="font-size: 10px; margin: 5px 0; color: #666;">${config.executiveTitle}</p>
    </div>

    <div style="margin-top: 40px; padding: 15px; background: #f5f5f5; border-radius: 8px; text-align: center; font-size: 10px; color: #666;">
      <p style="margin: 3px 0; font-weight: bold; color: #333; font-size: 12px;">${config.companyName}</p>
      <p style="margin: 3px 0;">📞 ${config.companyPhone} | 📱 ${config.companyMobile}</p>
      <p style="margin: 3px 0;">📧 ${config.companyEmail} | 🌐 ${config.companyWebsite}</p>
      <p style="margin: 3px 0;">📍 ${config.companyAddress}</p>
      <p style="margin: 8px 0 3px 0;">CNPJ: ${config.companyCNPJ}</p>
    </div>

    <div style="margin-top: 50px; page-break-before: always; border: 2px solid ${config.headerColor}; padding: 20px; border-radius: 8px;">
      <h3 style="text-align: center; color: ${config.headerColor}; margin: 0 0 20px 0; font-size: 14px;">${config.acceptanceTitle}</h3>
      <p style="font-size: 11px; text-align: justify; margin-bottom: 20px;">${config.acceptanceText} <strong>${proposal.number}</strong>, apresentada pela empresa <strong>${config.companyName}</strong>.</p>
      
      <div style="margin-top: 40px;">
        <p style="font-size: 11px; margin: 5px 0;"><strong>Cliente:</strong> ${proposal.client.name}</p>
        ${proposal.client.cnpj ? `<p style="font-size: 11px; margin: 5px 0;"><strong>CNPJ:</strong> ${proposal.client.cnpj}</p>` : ''}
        ${proposal.client.cpf ? `<p style="font-size: 11px; margin: 5px 0;"><strong>CPF:</strong> ${proposal.client.cpf}</p>` : ''}
      </div>

      <div style="margin-top: 60px;">
        <div style="margin: 40px auto 10px; width: 300px; border-top: 1px solid #333;"></div>
        <p style="text-align: center; font-size: 11px; margin: 5px 0;">Assinatura do Responsável</p>
      </div>

      <div style="margin-top: 40px;">
        <p style="font-size: 11px; margin: 5px 0;"><strong>Nome:</strong> _____________________________________________</p>
        <p style="font-size: 11px; margin: 5px 0;"><strong>CPF:</strong> _____________________________________________</p>
        <p style="font-size: 11px; margin: 5px 0;"><strong>Data:</strong> ____/____/________</p>
      </div>
    </div>
  `

  // Adicionar ao DOM temporariamente
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  document.body.appendChild(element)

  try {
    // Converter HTML para canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    // Criar PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Adicionar primeira página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= 297 // A4 height in mm

    // Adicionar páginas extras se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297
    }

    return pdf
  } finally {
    // Remover elemento temporário
    document.body.removeChild(element)
  }
}

export async function downloadProposalPDF(proposal: any) {
  const pdf = await generateProposalPDF(proposal)
  pdf.save(`Proposta-${proposal.number}.pdf`)
}

export async function viewProposalPDF(proposal: any) {
  const pdf = await generateProposalPDF(proposal)
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

export async function printProposalPDF(proposal: any) {
  const pdf = await generateProposalPDF(proposal)
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)
  
  iframe.onload = () => {
    iframe.contentWindow?.print()
    setTimeout(() => {
      document.body.removeChild(iframe)
      URL.revokeObjectURL(url)
    }, 1000)
  }
}

