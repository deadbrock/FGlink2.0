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
    const timestamp = new Date().getTime()
    const response = await fetch(`/api/pdf-config?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('📥 [OFFICIAL] Configuração carregada do servidor:', data)
      
      if (data && Object.keys(data).length > 0) {
        const merged = { ...defaultConfig, ...data }
        console.log('✅ [OFFICIAL] Usando configuração personalizada:', {
          companyName: merged.companyName,
          headerColor: merged.headerColor,
          showInsalubridadeColumn: merged.showInsalubridadeColumn,
        })
        return merged
      }
    }
  } catch (error) {
    console.error('❌ [OFFICIAL] Erro ao carregar configuração:', error)
  }
  
  console.log('⚠️ [OFFICIAL] Usando configuração padrão')
  return defaultConfig
}

export async function generateOfficialProposalPDF(proposal: any, customText?: string) {
  console.log('🚀 [OFFICIAL] Iniciando geração de PDF...')
  
  // Carregar configuração personalizada
  const config = await loadPDFConfig()
  
  console.log('🎨 [OFFICIAL] CONFIGURAÇÃO FINAL APLICADA:', {
    companyName: config.companyName,
    headerColor: config.headerColor,
    logoSize: config.logoSize,
    tableHeaderColor: config.tableHeaderColor,
    showInsalubridadeColumn: config.showInsalubridadeColumn,
  })
  
  // Criar elemento HTML com o template oficial
  const element = document.createElement('div')
  element.style.width = '210mm'
  element.style.padding = config.pageMargin
  element.style.backgroundColor = 'white'
  element.style.fontFamily = config.fontFamily
  element.style.fontSize = config.fontSize
  element.style.lineHeight = config.lineHeight
  
  // Calcular valores
  const totalMensal = proposal.totalValue
  const diasContrato = proposal.endDate && proposal.startDate 
    ? Math.ceil((new Date(proposal.endDate).getTime() - new Date(proposal.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 30
  const meses = Math.ceil(diasContrato / 30)
  const totalContrato = totalMensal * meses

  // Data de hoje formatada
  const hoje = new Date()
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  element.innerHTML = `
    <!-- PÁGINA 1: PROPOSTA -->
    <div style="page-break-after: always;">
      <!-- Cabeçalho -->
      <div style="text-align: center; margin-bottom: 30px;">
        ${config.showLogo ? `<img src="/logo-fglink.png" alt="${config.companyName} Logo" style="width: ${config.logoSize}; height: auto; margin-bottom: 10px;" onerror="this.style.display='none'" />` : ''}
        <h1 style="color: ${config.headerColor}; margin: 0; font-size: 28pt;">${config.companyName}</h1>
        <p style="color: #666; margin: 5px 0; font-size: 12pt;">${config.companySubtitle}</p>
      </div>

      <!-- Data e Destinatário -->
      <div style="margin-bottom: 30px;">
        <p style="margin: 5px 0;">${dataFormatada}</p>
        <p style="margin: 5px 0;"><strong>Att. ${proposal.client.contactName || proposal.client.name}</strong></p>
        <p style="margin: 5px 0;"><strong>Empresa:</strong> ${proposal.client.name}</p>
      </div>

      <!-- Carta de Apresentação -->
      <div style="text-align: justify; margin-bottom: 30px;">
        <p style="margin-bottom: 15px;">Prezados(as),</p>
        
        <p style="margin-bottom: 15px;">
          Encaminhamos a seguir a proposta comercial de número: <strong>${proposal.number}</strong>
        </p>

        ${(customText || config.introText).split('\n\n').map((p: string) => `<p style="margin-bottom: 15px;">${p}</p>`).join('')}

        <p style="margin-bottom: 15px;">
          <strong>O objetivo desta proposta é atender ${proposal.client.name} nos seguintes serviços:</strong>
        </p>

        <p style="margin-bottom: 20px;">
          ${proposal.description || proposal.title}
        </p>
      </div>

      <!-- Quadro Resumo -->
      <div style="margin-bottom: 30px;">
        <h3 style="background: ${config.tableHeaderColor}; color: white; padding: 10px; text-align: center; margin: 0 0 2px 0;">
          ${config.tableHeaderText}
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
          <thead>
            <tr style="background: #e3f2fd;">
              <th style="border: 1px solid #333; padding: 8px; text-align: left;">DESCRIÇÃO</th>
              ${config.showInsalubridadeColumn ? '<th style="border: 1px solid #333; padding: 8px; text-align: center; width: 80px;">INSALUBR.</th>' : ''}
              <th style="border: 1px solid #333; padding: 8px; text-align: center; width: 80px;">PERÍODO</th>
              <th style="border: 1px solid #333; padding: 8px; text-align: right; width: 100px;">VALOR UNITÁRIO</th>
              <th style="border: 1px solid #333; padding: 8px; text-align: center; width: 60px;">QUANT.</th>
              <th style="border: 1px solid #333; padding: 8px; text-align: right; width: 120px;">VALOR TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${proposal.items.map((item: any) => `
            <tr>
              <td style="border: 1px solid #333; padding: 8px;">${item.description}</td>
              ${config.showInsalubridadeColumn ? '<td style="border: 1px solid #333; padding: 8px; text-align: center;">NÃO</td>' : ''}
              <td style="border: 1px solid #333; padding: 8px; text-align: center;">${Math.ceil(item.quantity)} dias</td>
              <td style="border: 1px solid #333; padding: 8px; text-align: right;">R$ ${item.unitPrice.toFixed(2).replace('.', ',')}</td>
              <td style="border: 1px solid #333; padding: 8px; text-align: center;">1</td>
              <td style="border: 1px solid #333; padding: 8px; text-align: right; font-weight: bold;">R$ ${item.totalPrice.toFixed(2).replace('.', ',')}</td>
            </tr>
            `).join('')}
            <tr style="background: #f5f5f5;">
              <td colspan="${config.showInsalubridadeColumn ? '5' : '4'}" style="border: 1px solid #333; padding: 10px; text-align: right; font-weight: bold;">
                VALOR TOTAL DA PROPOSTA
              </td>
              <td style="border: 1px solid #333; padding: 10px; text-align: right; font-weight: bold; font-size: 12pt; color: ${config.tableHeaderColor};">
                R$ ${totalContrato.toFixed(2).replace('.', ',')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Itens Inclusos -->
      <div style="margin-bottom: 20px;">
        <p style="margin-bottom: 10px;">
          <strong>A presente proposta contempla:</strong> ${config.itemsIncluded}
        </p>
      </div>

      <!-- Observações -->
      <div style="background: ${config.observationBgColor}; border-left: 4px solid ${config.observationBorderColor}; padding: 15px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 10pt;">
          <strong>Observação:</strong> ${proposal.observations || config.defaultObservation}
        </p>
      </div>

      <!-- Rodapé Página 1 -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid ${config.headerColor}; font-size: 10pt; color: #666;">
        <p style="margin: 3px 0;">📞 ${config.companyPhone} | 📱 ${config.companyMobile}</p>
        <p style="margin: 3px 0;">📧 ${config.companyEmail} | 🌐 ${config.companyWebsite}</p>
        <p style="margin: 3px 0;">📍 ${config.companyAddress}</p>
      </div>
    </div>

    <!-- PÁGINA 2: CONDIÇÕES E ASSINATURA -->
    <div style="page-break-after: always;">
      <!-- Cabeçalho Página 2 -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid ${config.headerColor};">
        <h2 style="color: ${config.headerColor}; margin: 0;">${config.companyName}</h2>
        <p style="color: #666; margin: 5px 0; font-size: 11pt;">${config.companySubtitle}</p>
      </div>

      <!-- Condições Comerciais -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">CONDIÇÕES COMERCIAIS</h3>
        
        <p style="margin: 15px 0;">
          <strong>Validade da Proposta:</strong> Esta proposta tem validade de ${config.proposalValidity} a contar da data da sua emissão e poderá ser revista no caso de mudanças na legislação em vigor ou comum acordo.
        </p>

        <p style="margin: 15px 0;">
          <strong>Forma de Pagamento:</strong> ${config.paymentTerms}
        </p>

        <p style="margin: 15px 0;">
          <strong>Início dos Serviços:</strong> ${proposal.startDate ? new Date(proposal.startDate).toLocaleDateString('pt-BR') : 'A combinar'}
        </p>

        ${proposal.endDate ? `
        <p style="margin: 15px 0;">
          <strong>Término dos Serviços:</strong> ${new Date(proposal.endDate).toLocaleDateString('pt-BR')}
        </p>
        ` : ''}
      </div>

      <!-- Mensagem Final -->
      <div style="margin-bottom: 40px; text-align: justify;">
        <p style="margin: 15px 0;">
          Aguardamos o retorno do <strong>Termo de Aceite</strong> devidamente assinado para darmos andamento na Implantação dos Serviços Especializados ora contratados.
        </p>
        <p style="margin: 15px 0;">
          Atenciosamente,
        </p>
      </div>

      <!-- Assinatura FGlink -->
      <div style="margin-bottom: 50px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <p style="margin: 5px 0; font-weight: bold; color: ${config.headerColor}; font-size: 14pt;">${proposal.user.name}</p>
        <p style="margin: 5px 0;">${config.executiveTitle}</p>
        <p style="margin: 5px 0;">📱 Fone: ${config.companyMobile}</p>
        <p style="margin: 5px 0;">📧 ${proposal.user.email}</p>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
          <p style="margin: 3px 0; font-weight: bold;">${config.companyName} - ${config.companySubtitle}</p>
          <p style="margin: 3px 0; font-size: 10pt;">CNPJ: ${config.companyCNPJ}</p>
        </div>
      </div>
    </div>

    <!-- PÁGINA 3: TERMO DE ACEITE -->
    <div>
      <!-- Cabeçalho Página 3 -->
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 15px; border-bottom: 3px solid ${config.headerColor};">
        <h2 style="color: ${config.headerColor}; margin: 0; font-size: 20pt;">${config.companyName}</h2>
        <p style="color: #666; margin: 5px 0;">${config.companySubtitle}</p>
      </div>

      <!-- Termo de Aceite -->
      <div style="border: 3px solid ${config.headerColor}; padding: 30px; border-radius: 10px;">
        <h2 style="text-align: center; color: ${config.headerColor}; margin-bottom: 30px; font-size: 18pt;">
          ${config.acceptanceTitle}
        </h2>

        <p style="margin: 20px 0; text-align: justify; line-height: 1.8;">
          ${config.acceptanceText} de número: <strong style="font-size: 14pt; color: ${config.headerColor};">${proposal.number}</strong>
        </p>

        <div style="margin: 40px 0;">
          <p style="margin: 10px 0;"><strong>EMPRESA:</strong> ${proposal.client.name}</p>
          ${proposal.client.cnpj ? `<p style="margin: 10px 0;"><strong>CNPJ:</strong> ${proposal.client.cnpj}</p>` : ''}
          ${proposal.client.cpf ? `<p style="margin: 10px 0;"><strong>CPF:</strong> ${proposal.client.cpf}</p>` : ''}
        </div>

        <!-- Campos para Assinatura -->
        <div style="margin-top: 60px;">
          <div style="margin-bottom: 40px;">
            <p style="margin: 5px 0;"><strong>Nome Legível:</strong></p>
            <div style="border-bottom: 2px solid #333; height: 40px; margin-top: 10px;"></div>
          </div>

          <div style="display: flex; gap: 40px; margin-bottom: 40px;">
            <div style="flex: 1;">
              <p style="margin: 5px 0;"><strong>RG:</strong></p>
              <div style="border-bottom: 2px solid #333; height: 40px; margin-top: 10px;"></div>
            </div>
            <div style="flex: 1;">
              <p style="margin: 5px 0;"><strong>CPF:</strong></p>
              <div style="border-bottom: 2px solid #333; height: 40px; margin-top: 10px;"></div>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <p style="margin: 5px 0;"><strong>Data:</strong></p>
            <div style="border-bottom: 2px solid #333; height: 40px; margin-top: 10px; width: 200px;"></div>
          </div>

          <div style="margin-top: 60px;">
            <div style="border-bottom: 2px solid #333; height: 60px; margin-bottom: 10px;"></div>
            <p style="text-align: center; margin: 0; font-weight: bold;">Assinatura e Carimbo da Empresa</p>
          </div>
        </div>
      </div>

      <!-- Rodapé Final -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #3b82f6; font-size: 9pt; color: #666;">
        <p style="margin: 3px 0; font-weight: bold;">FGlink - Serviços de Limpeza Profissional</p>
        <p style="margin: 3px 0;">CNPJ: 00.000.000/0001-00</p>
        <p style="margin: 3px 0;">📧 contato@fglink.com | 📱 (11) 99999-9999 | 🌐 www.fglink.com</p>
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

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= 297

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297
    }

    return pdf
  } finally {
    document.body.removeChild(element)
  }
}

export async function downloadOfficialProposalPDF(proposal: any, customText?: string) {
  const pdf = await generateOfficialProposalPDF(proposal, customText)
  pdf.save(`Proposta-Comercial-${proposal.number}.pdf`)
}

export async function viewOfficialProposalPDF(proposal: any, customText?: string) {
  const pdf = await generateOfficialProposalPDF(proposal, customText)
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

