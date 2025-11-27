import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('💾 Salvando template:', {
      name: data.name,
      fileName: data.fileName,
      fieldsCount: data.fields?.length || 0,
    })
    
    const templateConfig = {
      fileName: data.fileName,
      fields: data.fields,
      createdAt: new Date().toISOString(),
    }

    // Salvar configuração do template (usar fileName sem extensão como chave)
    const configKey = data.fileName.replace('.pdf', '')
    const configPath = join(process.cwd(), `pdf-template-${configKey}.json`)
    await writeFile(configPath, JSON.stringify(templateConfig, null, 2))
    
    console.log('✅ Config salva em:', configPath)
    
    // Salvar no banco de dados
    const template = await prisma.pDFTemplate.create({
      data: {
        name: data.name || 'Template Personalizado',
        fileName: data.fileName, // Salvar o nome real do arquivo (ex: template-123456.pdf)
        description: data.description || 'Template importado',
        active: true,
      },
    })
    
    console.log('✅ Template salvo no banco:', {
      id: template.id,
      name: template.name,
      fileName: template.fileName,
    })

    return NextResponse.json({
      success: true,
      message: 'Template salvo com sucesso',
      templateId: template.id,
    })
  } catch (error) {
    console.error('❌ Erro ao salvar template:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar template' },
      { status: 500 }
    )
  }
}

