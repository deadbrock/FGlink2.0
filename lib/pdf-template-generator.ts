import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { readFile } from 'fs/promises'
import { join } from 'path'

interface TemplateField {
  id: number
  name: string
  type: 'text' | 'number' | 'date' | 'table'
  x: number
  y: number
  page: number
}

interface TemplateConfig {
  fileName: string
  fields: TemplateField[]
  createdAt: string
}

// Carregar configuração do template por fileName
async function loadTemplateConfig(fileName: string): Promise<TemplateConfig | null> {
  try {
    // Remover extensão .pdf para buscar o config
    const configKey = fileName.replace('.pdf', '')
    const configPath = join(process.cwd(), `pdf-template-${configKey}.json`)
    
    console.log('🔍 Buscando config em:', configPath)
    
    const data = await readFile(configPath, 'utf-8')
    const config = JSON.parse(data)
    
    console.log('✅ Config carregada:', {
      fileName: config.fileName,
      fieldsCount: config.fields?.length || 0,
    })
    
    return config
  } catch (error) {
    console.log('⚠️ Configuração do template não encontrada:', fileName)
    console.log('❌ Erro:', error)
    return null
  }
}

// Gerar PDF usando template personalizado
export async function generateProposalFromTemplate(proposal: any, templateFileName: string): Promise<Buffer | null> {
  try {
    // Carregar configuração do template
    const config = await loadTemplateConfig(templateFileName)
    if (!config) {
      console.log('⚠️ Configuração não encontrada para:', templateFileName)
      return null
    }

    console.log('📄 Carregando template:', config.fileName)

    // Carregar PDF template
    const templatePath = join(process.cwd(), 'public', 'pdf-templates', config.fileName)
    const existingPdfBytes = await readFile(templatePath)
    
    // Carregar PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()
    
    // Carregar fonte
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    console.log('✅ Template carregado, preenchendo campos...')

    // Preparar dados para preenchimento
    const data = prepareProposalData(proposal)

    // Preencher cada campo
    for (const field of config.fields) {
      const page = pages[field.page - 1]
      if (!page) continue

      const value = getFieldValue(field.name, data)
      if (!value) continue

      // Preencher campo baseado no tipo
      if (field.type === 'table') {
        await fillTableField(page, field, data.items, font)
      } else {
        await fillTextField(page, field, value, font)
      }
    }

    console.log('✅ Campos preenchidos com sucesso!')

    // Retornar PDF como buffer
    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
  } catch (error) {
    console.error('❌ Erro ao gerar PDF do template:', error)
    return null
  }
}

// Preparar dados da proposta
function prepareProposalData(proposal: any) {
  const today = new Date()
  const dataFormatada = today.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return {
    // Dados do Cliente (para cabeçalho do PDF)
    nomeCliente: proposal.client.name,
    empresa: proposal.client.name, // Alias para "Empresa"
    telefoneCliente: proposal.client.phone || '',
    fone: proposal.client.phone || '', // Alias para "Fone"
    contatoCliente: proposal.client.contactName || proposal.client.name,
    contato: proposal.client.contactName || proposal.client.name, // Alias para "Contato"
    emailCliente: proposal.client.email || '',
    cnpj: proposal.client.cnpj || '',
    cpf: proposal.client.cpf || '',
    
    // Dados da Proposta
    numeroProposta: proposal.number,
    data: dataFormatada,
    dataSimples: today.toLocaleDateString('pt-BR'),
    titulo: proposal.title,
    descricao: proposal.description || '',
    tipoServico: proposal.serviceType,
    tipoContrato: proposal.contractType,
    dataInicio: proposal.startDate ? new Date(proposal.startDate).toLocaleDateString('pt-BR') : '',
    dataFim: proposal.endDate ? new Date(proposal.endDate).toLocaleDateString('pt-BR') : '',
    observacoes: proposal.observations || '',
    
    // Valores - Usando nova nomenclatura
    valorTotalMensal: `R$ ${proposal.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    valorTotal: `R$ ${proposal.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Compatibilidade
    valorTotalNumero: proposal.totalValue,
    subtotal: `R$ ${proposal.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Alias para "Subtotal"
    
    // Dados do Vendedor
    executivo: proposal.user.name,
    vendedor: proposal.user.name, // Alias
    email: proposal.user.email,
    emailVendedor: proposal.user.email,
    
    // Dados da Empresa FG Services
    telefone: '(81) 4042-7878',
    celular: '(81) 99123-6035',
    emailEmpresa: 'comercial@fgservices.com.br',
    cnpjEmpresa: '14.116.352/0001-11',
    enderecoEmpresa: 'Rua Minas Gerais, 137, Ana Albuquerque, Igarassu - PE',
    nomeEmpresa: 'FG Services',
    razaoSocial: 'FG Services - Terceirização de Serviços',
    
    // Itens da Proposta (para tabela)
    items: proposal.items || [],
  }
}

// Obter valor do campo
function getFieldValue(fieldName: string, data: any): string {
  // Remover {{ }} se existir
  const cleanName = fieldName.replace(/[{}]/g, '')
  
  // Mapeamento de campos disponíveis:
  // DADOS DO CLIENTE:
  // - empresa / nomeCliente: Nome do cliente
  // - fone / telefoneCliente: Telefone do cliente
  // - contato / contatoCliente: Nome do contato
  // - emailCliente: Email do cliente
  // - cnpj / cpf: Documentos do cliente
  //
  // DADOS DA PROPOSTA:
  // - numeroProposta: Número da proposta (ex: PROP-202511-0001)
  // - data: Data formatada por extenso
  // - dataSimples: Data no formato dd/mm/aaaa
  // - titulo: Título da proposta
  // - descricao: Descrição da proposta
  //
  // VALORES:
  // - valorTotalMensal / valorTotal: Valor total formatado (R$ X.XXX,XX)
  // - subtotal: Valor total (alias)
  //
  // VENDEDOR:
  // - executivo / vendedor: Nome do vendedor
  // - email / emailVendedor: Email do vendedor
  //
  // EMPRESA FG SERVICES:
  // - nomeEmpresa: FG Services
  // - telefone: (81) 4042-7878
  // - celular: (81) 99123-6035
  // - emailEmpresa: comercial@fgservices.com.br
  //
  // TABELA:
  // - items: Array de itens (use type: 'table' para renderizar)
  //   Cada item contém: description, quantity, unitPrice, totalPrice
  
  return data[cleanName] || ''
}

// Preencher campo de texto
async function fillTextField(page: any, field: TemplateField, value: string, font: any) {
  const { width, height } = page.getSize()
  
  // Converter coordenadas (PDF usa origem no canto inferior esquerdo)
  const x = field.x
  const y = height - field.y - 20 // Ajustar para origem inferior
  
  page.drawText(value, {
    x: x,
    y: y,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })
}

// Preencher campo de tabela
async function fillTableField(page: any, field: TemplateField, items: any[], font: any) {
  const { width, height } = page.getSize()
  
  let startY = height - field.y - 40
  const startX = field.x
  const lineHeight = 20

  console.log(`📊 Preenchendo tabela com ${items.length} itens`)

  // Desenhar cada item
  items.forEach((item, index) => {
    const y = startY - (index * lineHeight)
    
    console.log(`  Item ${index + 1}:`, {
      descricao: item.description,
      quantidadePostos: item.quantity,
      valorUnitarioPosto: item.unitPrice,
      totalMensal: item.totalPrice
    })
    
    // Coluna 1: Descrição
    page.drawText(item.description.substring(0, 50), {
      x: startX + 10,
      y: y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    // Coluna 2: Valor Unitário do Posto (A)
    page.drawText(`R$ ${item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
      x: startX + 200,
      y: y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    // Coluna 3: Quantidade de Postos
    page.drawText(item.quantity.toString(), {
      x: startX + 320,
      y: y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    // Coluna 4: Valor Total Mensal
    page.drawText(`R$ ${item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
      x: startX + 400,
      y: y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    })
  })

  console.log('✅ Tabela preenchida com sucesso!')
}

// Exportar para uso no cliente
export async function downloadTemplateProposalPDF(proposal: any) {
  // Esta função será chamada do lado do servidor
  // Retorna o buffer do PDF para download
  return await generateProposalFromTemplate(proposal)
}

