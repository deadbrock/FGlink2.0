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
    const configPath = join(process.cwd(), `pdf-template-${fileName}.json`)
    const data = await readFile(configPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.log('⚠️ Configuração do template não encontrada:', fileName)
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
    nomeCliente: proposal.client.name,
    cnpj: proposal.client.cnpj || '',
    cpf: proposal.client.cpf || '',
    numeroProposta: proposal.number,
    data: dataFormatada,
    dataSimples: today.toLocaleDateString('pt-BR'),
    valorTotal: `R$ ${proposal.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    valorTotalNumero: proposal.totalValue,
    observacoes: proposal.observations || '',
    executivo: proposal.user.name,
    telefone: '(81) 4042-7878',
    celular: '(81) 99123-6035',
    email: proposal.user.email,
    emailEmpresa: 'comercial@fgservices.com.br',
    cnpjEmpresa: '14.116.352/0001-11',
    enderecoEmpresa: 'Rua Minas Gerais, 137, Ana Albuquerque, Igarassu - PE',
    items: proposal.items || [],
    titulo: proposal.title,
    descricao: proposal.description || '',
    tipoServico: proposal.serviceType,
    tipoContrato: proposal.contractType,
    dataInicio: proposal.startDate ? new Date(proposal.startDate).toLocaleDateString('pt-BR') : '',
    dataFim: proposal.endDate ? new Date(proposal.endDate).toLocaleDateString('pt-BR') : '',
  }
}

// Obter valor do campo
function getFieldValue(fieldName: string, data: any): string {
  // Remover {{ }} se existir
  const cleanName = fieldName.replace(/[{}]/g, '')
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

  // Desenhar cada item
  items.forEach((item, index) => {
    const y = startY - (index * lineHeight)
    
    // Descrição
    page.drawText(item.description.substring(0, 50), {
      x: startX + 10,
      y: y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    // Quantidade
    page.drawText(item.quantity.toString(), {
      x: startX + 300,
      y: y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    // Valor
    page.drawText(`R$ ${item.totalPrice.toFixed(2)}`, {
      x: startX + 400,
      y: y,
      size: 9,
      font: font,
      color: rgb(0, 0, 0),
    })
  })
}

// Exportar para uso no cliente
export async function downloadTemplateProposalPDF(proposal: any) {
  // Esta função será chamada do lado do servidor
  // Retorna o buffer do PDF para download
  return await generateProposalFromTemplate(proposal)
}

